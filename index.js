#!/usr/bin/env node

var fs           = require('fs-extra'),
    readline     = require('readline'),
    cp           = require('child_process'),
    parseString  = require('xml2js').parseString;
    Utils        = require('./bin/utils');

var sourceFile   = __dirname + '/assets/index.html',
    targetFile   = process.cwd() + '/www/index.html',
    targetBackup = process.cwd() + '/www/index_old.html',
    jsDirectory  = __dirname + '/assets/js',
    jsDest       = process.cwd() + '/www/js',
    cordovaXML   = process.cwd() + '/config.xml';

var meteorUrl = '###METEOR_URL###',
    cordovaVersion = '###CORDOVA_VERSION###',
    cordovaAppVersion = '###CORDOVA_APP_VERSION###';

function checkIndex () {
  fs.readFile(targetFile, function (err, data) {
    if (err) return next();
    next();
  });
}

function checkBackupFile () {
  fs.readFile(targetBackup, function (err, data) {
    if (err) return next();
    fs.remove(targetBackup, function (err) {
      if (err) return next(err);
      next();
    });
  });
}

function backupIndex () {
  fs.move(targetFile, targetBackup, function (err) {
    if (err) return next(err);
    console.log('Backing up www/index.html into www/index_old.html ...\n');
    return next();
  });
}

function copyMeteorIndex () {
  fs.copy(sourceFile, targetFile, function (err) {
    if (err) return next(err);
    console.log('Creating new www/index.html file ...\n');
    return next();
  });
}

function copyJsFiles () {
  fs.copy(jsDirectory, jsDest, function (err) {
    if (err) return next(err);
    console.log('Creating needed JS files in ww/js/ ...\n');
    return next();
  });
}

function replaceMeteorUrl () {
  var ask = readline.createInterface(process.stdin, process.stdout);
  var question = 'What is the production URL of the meteor app?\n';
  question += '(example: http://todos.meteor.com) > ';
  ask.question(question, function (url) {
    Utils.strReplace(targetFile, meteorUrl, url, function (err) {
      if (err) return next(err);
      ask.close();
      console.log('\n');
      return next();
    });
  });
}

function replaceCordovaVersion () {
  cp.exec('cordova -v', function (err, stdout, stderr) {
    if (err) return next(err);
    var version = stdout.substr(0, stdout.indexOf('-'));
    version = version.substr(0, version.lastIndexOf('.'));
    Utils.strReplace(targetFile, cordovaVersion, version, function (err) {
      if (err) return next(err);
      console.log('Successfully set Cordova Version (' + version + ') in Meteor Rider ...\n');
      return next();
    });
  });
}

function checkForConfigXml () {
  fs.readFile(cordovaXML, function (err, data) {
    if (err) return next(err);
    return next(null, data);
  });
}

function replaceAppVersion (data) {
  parseString(data, function (err, result) {
    if (err) return next(err);
    var appVersion = result.widget.$.version;
    if (!appVersion) return next(new Error('App version is missing from config.xml'));
    Utils.strReplace(targetFile, cordovaAppVersion, appVersion, function (err) {
      if (err) return next(err);
      console.log('Successfully set Cordova App Version (' + appVersion + ') in Meteor Rider ...\n');
      return next();
    });
  });
}

function success () {
  console.log('MeteorRider has been successfully installed ...\n');
}

var tasks = [
  checkIndex,
  checkBackupFile,
  backupIndex,
  copyMeteorIndex,
  copyJsFiles,
  replaceMeteorUrl,
  replaceCordovaVersion,
  checkForConfigXml,
  replaceAppVersion,
  success
];

function next (err, result) {
  if (err) throw err;
  var currentTask = tasks.shift();
  if (currentTask) currentTask(result);
}

next();
