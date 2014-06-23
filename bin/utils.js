var fs = require('fs');

Utils = {
  strReplace: function (file, sourceStr, targetStr, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) return callback(err);
      var result = data.replace(sourceStr, targetStr.trim());
      fs.writeFile(file, result, 'utf8', function (err) {
        if (err) return callback(err);
        return callback(null);
      });
    });
  }
};

module.exports = Utils;
