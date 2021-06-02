var http = require("http");
var fs = require('fs');

var htmlLink = fs.readFileSync('public/index.html');
var galleryLink = fs.readFileSync('public/gallery.html');
var jsLink = fs.readFileSync('public/gallery.js');
var jsLink1 = fs.readFileSync('public/decoration.js')
var jsLink2 = fs.readFileSync('public/editor.js')
var cssLink = fs.readFileSync('public/style.css');
var errorLink = fs.readFileSync('public/404.html');


var bow = fs.readFileSync('public/sticker-imgs/bow.png');
var cake = fs.readFileSync('public/sticker-imgs/cake.png');
var flower = fs.readFileSync('public/sticker-imgs/flower.png');
var heart = fs.readFileSync('public/sticker-imgs/heart.png');
var micheal = fs.readFileSync('public/sticker-imgs/micheal.png');
var monkey = fs.readFileSync('public/sticker-imgs/monkey.png');
var riceball = fs.readFileSync('public/sticker-imgs/rice-ball.png');
var sparkles = fs.readFileSync('public/sticker-imgs/sparkles.png');

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
    else if (req.url == '/decoration.js') {
        res.writeHead(200, {
            "Content-Type": "text/js"
        });
        res.write(jsLink1);
    }
    else if (req.url == '/sticker-imgs/bow.png') {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.write(bow)
    }
    else if (req.url == '/sticker-imgs/cake.png') {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.write(cake)
    }
    else if (req.url == '/sticker-imgs/flower.png') {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.write(flower)
    }
    else if (req.url == '/sticker-imgs/heart.png') {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.write(heart)
    }
    else if (req.url == '/sticker-imgs/micheal.png') {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.write(micheal)
    }
    else if (req.url == '/sticker-imgs/monkey.png') {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.write(monkey)
    }
    else if (req.url == '/sticker-imgs/rice-ball.png') {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.write(riceball)
    }
    else if (req.url == '/sticker-imgs/sparkles.png') {
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.write(sparkles)
    }
    else if (req.url == '/editor.js') {
        res.writeHead(200, {
            "Content-Type": "text/js"
        });
        res.write(jsLink2);
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