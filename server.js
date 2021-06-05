/*
 * Write your routing code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name:
 * Email:
 */

var path = require('path');
var express = require('express');

var app = express();
var port = process.env.PORT || 3000;
const ViewEngine = require("express-handlebars");

function basicPages(req, res, next) {
  var pagenum = null;
  if (req.url === "/") {
    pagenum = 0;
  }
  else if (req.params.nav) {
    switch (req.params.nav.toLowerCase()) {
      case "home":
        pagenum = 0;
        break;
      case "gallery":
        pagenum = 1;
        req["gallery"] = -1;
        break;
      default:
        pagenum = -1;
        req["404"] = -1;
        break;
    }
  }
  else {
    pagenum = -5;
  }

  const navs = [{ str: "Home" }, { str: "Gallery" }];
  if (pagenum > -1) {
    navs[pagenum].active = true;
  }
  req.handlebarnav = navs;

  next();
  return;
}

app.engine('handlebars', ViewEngine());
app.set('view engine', 'handlebars');
app.get("/", basicPages, function (req, res, next) {

  res.status(200).render("index", {
    navlinks: req.handlebarnav,
    layout: false
  })
  return;
});
app.get('/:nav', basicPages, function (req, res, next) {

  if (req["404"] === -1) {
    next();
    return;
  }
  else if(req["gallery"] === -1){
      res.status(200).render('gallery',{
          navlinks: req.handlebarnav,
          layout: false
      })
      return;
  }
  res.status(200).render("index", {
    navlinks: req.handlebarnav,
    layout: false
  })
  return;
})
app.use(express.static('public'));

app.get('*', basicPages, function (req, res) {
  res.status(404).render('404', {
    navlinks: req.handlebarnav,
    layout: false
  })
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
