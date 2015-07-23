var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url;
var statusCode;
// require more modules/folders here!


exports.handleRequest = function (request, response) {
  // console.log(" --- REQUEST URL ---- : ", request.url);
  if (request.method === "GET"){
    if (request.url === "/"){
      // serve index.html
      // url = __dirname + '/public/index.html';
      url = "/Users/student/Desktop/2015-06-web-historian/web/public/index.html";
    } else {
      url = "/Users/student/Desktop/2015-06-web-historian/archives/sites" + request.url;
      // url = __dirname + '/../archives/sites' + request.url;
    }
    
    archive.isUrlArchived(url, function(exists){
      if(exists){
        archive.getFile(url, function(data){
          response.writeHead(200);
          response.end(data);
        });
      } else {
        response.writeHead(404);
        response.end();
      }
    });
  } else if (request.method === "POST"){
    
    response.end();
  } else { // this else is here just to make sure a response.end is called
    response.end(archive.paths.list);
  }
};


// /test/testdata/sites.txt'