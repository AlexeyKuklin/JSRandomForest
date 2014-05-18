'use strict';

var fs  = require('fs');
var utils = new (require('./utils')).Utils();

function Sample(features, label) {
    this.features = features; //= [];
    this.label = label;
}

function Dataset(types, header) {
    this.types = types;
    this.header = header; //= [];
    this.allFeatureColumns = [];
    this.featureColumns = [];
    this.featureRowsCnt = [];
    this.samples = [];
}

Dataset.prototype = {

    add: function (sample) {
        this.samples.push(sample);
    },

    count: function() {
        return this.samples.length
    },

    createLabelsMap: function() {
        var map = {};
        var count = this.count();
        for(var i = 0; i < count; i++) {
            var t = this.samples[i].label;
            map[t] = isNaN(map[t]) ? map[t] = 1 : map[t] + 1;
        }
        return map;
    },

    getEntropy: function() {
        var count = this.count();
        var map = this.createLabelsMap();
        utils.normalize(map, count);
        return utils.entropy(map);
    },

    setAllFeatureColumns: function(columns) {
        this.allFeatureColumns = columns;
    },

    setFeatureColumns: function(cnt) {
        this.featureColumns = this.getRandomSubRange(cnt);
    },

    setFeatureRows: function(cnt) {
        this.featureRowsCnt = cnt;
    },

    getRandomSubRange: function(cnt) {
        if(cnt > this.allFeatureColumns.length) {
            cnt = this.allFeatureColumns.length;
        }

        var tmp = this.allFeatureColumns.slice(0);
        var out = [];
        for(var i = 0; i < cnt; i++) {
            var j = utils.randi(0, tmp.length);
            out[i] = tmp[j];
            tmp.splice(j, 1);
        }
        return out;
    },

    setMissingValue: function(idx, value) {
        var i;
        var count = this.count();
        if(value == null) {
            var tmp = [];
            for(i = 0; i < count; i++) {
                var t = this.samples[i].features[idx];
                if(t != null) {
                    tmp.push(t);
                }
            }
            value = utils.median(tmp);
        }

        for(i = 0; i < count; i++) {
            if(this.samples[i].features[idx] == null) {
                this.samples[i].features[idx] = value;
            }
        }
        return value;
    },

    // Return array of string values, or NULL if CSV string not well formed.
    csvToArray: function(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = []; // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            function(m0, m1, m2, m3) {
                // Remove backslash from \' in single quoted values.
                if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    },


    castToScalar: function(value) {
        var hasDot = /\./;
        if (isNaN(value)) {
            return value;
        } else {
            if (hasDot.test(value)) {
                return parseFloat(value);
            } else {
                var t = parseInt(value);
                if(isNaN(t)) {
                    return null;
                } else {
                    return t;
                }
            }
        }
    },

    loadFromCSV: function(file, isHeader, inppos, outpos) {
        var self = this;
        fs.readFileSync(file).toString().split('\r\n').forEach(function(line) {
            if (isHeader) {
                isHeader = false;
                self.header = self.csvToArray(line);
            } else {
                var arr = self.csvToArray(line);
                if (arr && arr.length > 0) {
                    var input = [];
                    for(var i in inppos) {
                        var val = self.castToScalar(arr[inppos[i]]);
                        input.push(val);
                    }
                    var output = arr[outpos];
                    self.add(new Sample(input, output));
                }
            }
        });
    },

    saveToCSV: function(file) {
    }

};

exports.Sample = Sample;
exports.Dataset = Dataset;
