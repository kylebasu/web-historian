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
      url = __dirname + "/public/index.html";
    } else {
      url = __dirname + "/../archives/sites" + request.url;
      // url = __dirname + '/../archives/sites' + request.url;
    }
    console.log(" --- THIS IS REQUEST.URL --- : ", request.url);
    
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
    var dataString = '';
    // request.on data, 
    request.on('data', function(data){
      dataString += data;
    });
    request.on('end', function(){
      var website = JSON.parse(dataString).url;
      archive.addUrlToList(website + '\n', function(){
        response.writeHead(302);
        console.log(" POSTED: ", website);
        response.end();
      });
    });
  } else { // this else is here just to make sure a response.end is called
    response.end(archive.paths.list);
  }
};


// /test/testdata/sites.txt'