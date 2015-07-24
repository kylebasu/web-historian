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
    // GET DATA
    request.on('data', function(data){
      dataString += data;
      console.log(data);
    });

    // DATA RECEIVED
    request.on('end', function(){
      var website = dataString.replace("url=",'');
      console.log("DATASTRING - ", website);
      // check website is in texts
      archive.isUrlInList(website, function(is){
        // if yes
        if(is){
          var filePath = __dirname + "/../archives/sites/" + website;
          // look for file in folder
          archive.isUrlArchived(filePath, function(exists){
            // if in folder, serve file
            if(exists){
              // get the URL for the file
              //var website = "mywebsite.html";
              url = filePath;  
            } else {
              // if not in folder
              console.log("NOT ARCHIVED!!! - ", website);
              url = __dirname + "/public/robotsWorking.html"; 
            }
            archive.getFile(url, function(data){
              response.writeHead(302);
              response.end(data);
            });   
          });
        } else {
          // if not in sites.txt
          archive.addUrlToList(website + '\n', function(){
            // tell user to come back later <-
            url = __dirname + "/public/loading.html";
            archive.getFile(url, function(data){
              response.writeHead(302);
              response.end(data);
            });   
          });
        }
      });
    });
  } else { // this else is here just to make sure a response.end is called
    response.end(archive.paths.list);
  }
};


// /test/testdata/sites.txt'