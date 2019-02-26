const CleanCSS = require('clean-css')
const path = require('path')
const fs = require('fs')
const SRC = path.resolve(__dirname, '..', '')
const DIST = path.resolve(__dirname, '..', '', 'dist')
const ASSETS = '/dist'

var folder = SRC+"/assets/css/";
var options = { 
  compatibility: 'ie9' 
};

// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist) {
  var needle = 'super-forms';
  var fs = fs || require('fs'),
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    }else{
      if(path.extname(file)==='.css'){
        var slice_position = dir.indexOf(needle);
        filelist.push({
          path : dir.slice(slice_position+needle.length),
          name : file
        });
      }
    }
  });
  return filelist;
};

var files = walkSync(folder);
files.forEach(function (file, index) {
  //  var code = fs.readFileSync(file, 'utf8');
  fs.mkdir(DIST+file.path, { recursive: true }, (err) => {
      if (err) throw err;
      var code = fs.readFileSync(SRC+file.path+file.name, 'utf8');
      var output = new CleanCSS(options).minify(code);
      console.log('Cleaning up '+file.name);
      fs.writeFileSync(DIST+file.path+file.name, output.styles, 'utf8');
  });
});
