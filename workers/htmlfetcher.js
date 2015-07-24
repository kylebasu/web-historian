// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('/Users/student/Codes/2015-06-web-historian/helpers/archive-helpers.js');
archive.readListOfUrls(function(urlArray){
  console.log(urlArray);
  archive.downloadUrls(urlArray);
});

console.log("I'M RUNNING A CRON!!!");