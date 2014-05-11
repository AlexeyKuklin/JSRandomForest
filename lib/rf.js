'use strict';

//var tds = require('./dataset');
var tdt = require('./dt');

function RandomForest() {
    this.tree = [];
}

RandomForest.prototype = {

    train: function(dataset, numtrees, featureColumnsCnt, featureRowsCnt) {
        for (var i = 0; i < numtrees; i++ ) {
            dataset.setFeatureColumns(featureColumnsCnt);
            dataset.setFeatureRows(featureRowsCnt);
            this.tree[i] = new tdt.DTree(dataset);
        }

    },

    predict: function(dataset) {

    }
};

exports.RandomForest = RandomForest;