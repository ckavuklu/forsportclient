/*var sys = require("sys"),  
my_http = require("http"),  
path = require("path"),  
url = require("url"),  
filesys = require("fs");  
my_http.createServer(function(request,response){  
    var my_path = url.parse(request.url).pathname;  
    var full_path = path.join(process.cwd(),my_path);  
    path.exists(full_path,function(exists){  
        if(!exists){  
            response.writeHeader(404, {"Content-Type": "text/plain"});    
            response.write("404 Not Found\n");    
            response.end();  
        }  
        else{  
            filesys.readFile(full_path, "binary", function(err, file) {    
                 if(err) {    
                     response.writeHeader(500, {"Content-Type": "text/plain"});    
                     response.write(err + "\n");    
                     response.end();    
                 
                 }    
                 else{  
                    response.writeHeader(200);    
                    response.write(file, "binary");    
                    response.end();  
                }  
                       
            });  
        }  
    });  
}).listen(8080);  
sys.puts("Server Running on 8080");

*/




var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8080;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

  var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
  };

  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) headers["Content-Type"] = contentType;
      response.writeHead(200, headers);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");