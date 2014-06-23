#!/usr/bin/env node

var cp = require('child_process');

cp.exec('cordova -v', function (err, stdout, stderr) {
  if (err) throw err;
  console.log(err, stdout, stderr);
});
