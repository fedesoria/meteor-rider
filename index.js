#!/usr/bin/env node

var fs           = require('fs-extra'),
    sourceFile   = __dirname + '/assets/index.html',
    targetFile   = process.cwd() + '/www/index.html',
    targetBackup = process.cwd() + '/www/index_old.html',
    jsDirectory  = __dirname + '/assets/js',
    jsDest       = process.cwd() + '/www/js';


function backupIndex () {
  fs.readFile(targetFile, function (err, data) {
    if (err) return next(null);
  });
  fs.move(targetFile, targetBackup, function (err) {
    if (err) throw err;
    console.log('Backing up www/index.html into www/index_old.html ...\n');
    return next(null);
  });
}

function copyMeteorIndex () {
  next(null, sourceFile);
  fs.copy(sourceFile, targetFile, function (err) {
    if (err) throw err;
    console.log('Creating new www/index.html file ...\n');
    return next(null);
  });
}

function copyJsFiles () {
  fs.copy(jsDirectory, jsDest, function (err) {
    if (err) throw err;
    console.log('Creating needed JS files in ww/js/ ...\n');
    return next(null);
  });
}

function success () {
  console.log('MeteorRider has been successfully installed ...\n');
}

var tasks = [
  backupIndex,
  copyMeteorIndex,
  copyJsFiles,
  success
];

function next (err, result) {
  if (err) throw err;
  var currentTask = tasks.shift();
  if (currentTask) currentTask(result);
}

next();
