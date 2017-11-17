const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const yaml = require('js-yaml');

const src = path.join(__dirname, '../src/i18n');
const dest = path.join(__dirname, '../src/assets/i18n');

walk(src, (file) => {
  if (path.extname(file) === '.yaml') {
    let content;
    try {
      content = yaml.safeLoad(fs.readFileSync(file));
    } catch (err) {
      console.log(err.message);
      return;
    }
    const jsonFile = path.join(dest, `${file.slice(src.length, -4)}json`);
    const directory = path.dirname(jsonFile);
    mkdirp.sync(directory);
    fs.writeFileSync(jsonFile, JSON.stringify(content));
  }
})

function walk(dir, callback) {
  fs.readdir(dir, function(err, list) {
    if (err) {
      throw Error(err);
    }
    if (!list.length) {
      return;
    }

    list.forEach(function(file) {
      let filePath = path.join(dir, file)

      fs.stat(filePath, function(err, stat) {
        if (err) {
          throw Error(err);
        }
        if (stat && stat.isDirectory()) {
          walk(filePath, callback);
        }
        else {
          callback(filePath);
        }
      });
    });
  });
}
