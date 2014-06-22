#!/usr/bin/env node

var fs           = require('fs-extra'),
    sourceFile   = __dirname + '/www/index.html',
    targetFile   = __dirname + '/../www/index.html',
    targetBackup = __dirname + '/../www/index_old.html';

function backupIndex () {
  fs.readFile(targetFile, function(err, data) {
    if (err) return next(null);
    fs.writeFile(targetBackup, data, function (err) {
      if (err) throw err;
      next(null);
    });
  });
}

function checkMeteorIndexExists () {
  fs.exists(sourceFile, function (exists) {
    if (!exists) return next(new Error('MeteorRider source file is missing.'));
    next(null, sourceFile);
  });
}

function readMeteorIndex (sourceFile) {
  fs.readFile(sourceFile, function (err, data) {
    if (err) throw err;
    next(null, data);
  });
}

function copyMeteorIndex (data) {
  fs.writeFile(targetFile, data, function (err) {
    if (err) throw err;
    next(null);
  })
}

function success () {
  console.log('MeteorRider has successfully updated ' + targetFile);
}

var tasks = [
  backupIndex,
  checkMeteorIndexExists,
  readMeteorIndex,
  copyMeteorIndex,
  success
];

function next (err, result) {
  if (err) throw err;
  var currentTask = tasks.shift();
  if (currentTask)
    currentTask(result);
}

next();
