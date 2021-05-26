var http = require("http");
var fs = require('fs');

var htmlLink = fs.readFileSync('public/index.html');
var galleryLink = fs.readFileSync('public/gallery.html');
var jsLink = fs.readFileSync('public/gallery.js');
var cssLink = fs.readFileSync('public/style.css');
var errorLink = fs.readFileSync('public/404.html');

console.log("PORT:", process.env.PORT);

function requestHandler(req, res) {
    console.log("method:", req.method);
    console.log("url:", req.url);
    console.log("headers:", req.headers);

    if ((req.url == '/index.html') || (req.url == '/')) {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.write(htmlLink);
    }
    else if (req.url == '/gallery.html') {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.write(galleryLink);
    }
    else if (req.url == '/style.css') {
        res.writeHead(200, {
            "Content-Type": "text/css"
        });
        res.write(cssLink);
    }
    else if (req.url == '/gallery.js') {
        res.writeHead(200, {
            "Content-Type": "text/js"
        });
        res.write(jsLink);
    }
    else if (req.url == '/404.html') {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.write(errorLink);
    }
    else {
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.write(errorLink);
    }
    res.end();
}

var server = http.createServer(requestHandler);

server.listen(3000, function (err) {
    console.log("Server is on port 3000");
});