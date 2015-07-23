var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(this.paths.list, 'utf8', function(err, data){
    if (err) throw err;
    var urlArray=data.split("\n");
    callback(urlArray);
  });
};

exports.isUrlInList = function(website, callback){
  this.readListOfUrls(function(urls){
    urls.indexOf(website) !== -1 ? callback(true) : callback(false);
  });
};

exports.addUrlToList = function(website, callback){
  // console.log("ADDING URL TO LIST...");

  var that = this;
  this.isUrlInList(website, function(is){
    // console.log("IS OR ISN'T IN LIST");
    if (!is){
      fs.appendFile(that.paths.list, website, function(err){
        if (err) throw err;
        // console.log("WROTE DATA TO END OF FILE: ", website);
        callback();
      })
    } else {
      // console.log("DID NOT WRITE DATA - WEBSITE IN FILE");
      callback();
    }

  });
};

exports.isUrlArchived = function(url, callback){
  fs.exists(url, function(exists){
    callback(exists);
  })
};

exports.getFile = function(url, callback){
  fs.readFile(url, function(err, data){
    if (err) throw err;
    callback(data);
  });
}

exports.downloadUrls = function(urlArray){
  // for loop over array
  for (var i = 0; i< urlArray.length; i++){
    // fixture path set
    var fixturePath = this.paths.archivedSites + '/' + urlArray[i];
    // check if url is archived
    this.isUrlArchived(fixturePath, function(exists){
      // if !exist
      if(!exists){
        // add to file
        console.log("--- TRYING TO WRITE TO --- : ", fixturePath);
        fs.writeFile(fixturePath, "DATA WILL GO HERE", function(err){
          if (err) throw err;
        })
      }
    });
  }
};
