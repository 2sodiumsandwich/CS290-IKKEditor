(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['image'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<article class=\"edited-photo\">\r\n    <img type=\"button\" onclick=\"openImage(this.id)\" class=\"image-button\"></img>\r\n</article>";
},"useData":true});
})();