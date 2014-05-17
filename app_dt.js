'use strict';

var tds = require('./lib/dataset');
var tdt = require('./lib/dt');
var rf  = require('./lib/rf');
//var utils = new (require('.lib/utils')).Utils();

//PassengerId,Survived,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Cabin,Embarked
var ds = new tds.Dataset(['N', 'N', 'C', 'N']);
//console.log(ds.getRandomSubRange(10));

ds.loadFromCSV('./data/train.csv', true, [0, 2, 4, 5], 1);
ds.setAllFeatureColumns([2, 4, 5]);
var median_age = ds.setMissingValue(3, null); //3 in samples...
console.log('MEDIAN:');
console.log(median_age);

console.log(ds.header);
console.log(ds.samples);


//console.log(ds.samples[0].features);
//console.log(ds.samples[0].label);



/****

//var dt = new tdt.DTree(ds);
********/

/*
var ds2 = new tds.Dataset(['N', 'N', 'N', 'N']);
ds2.add(new tds.Sample([5.1, 3.4, 1.5, 0.2], null));  //0
var p = dt.predict(dt.root, ds2);
console.log('It should be 0 = ');
console.log(p);
*/

//var f = new rf.RandomForest();
//f.train(ds, 100, 3, 600);



