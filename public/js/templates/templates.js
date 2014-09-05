define(['handlebars'], function(Handlebars) {

this["templates"] = this["templates"] || {};

this["templates"]["error"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h1 class=\"error-message\">";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>";
  return buffer;
  });

this["templates"]["game"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header class=\"header\">\n    <h1 class=\"banner\" role=\"banner\">Gyroscopes &amp; Isotopes</h1>\n</header>\n\n<button id=\"electron-blast\" class=\"button inactive\">Electron Blast!</button>";
  });

this["templates"]["lobby"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header class=\"header\">\n    <h1 class=\"banner\" role=\"banner\">Gyroscopes &amp; Isotopes</h1>\n</header>\n\n<button id=\"ready-button\" class=\"button\">Ready</button>";
  });

this["templates"]["message"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h1 class=\"player-message ";
  if (stack1 = helpers.type) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.type; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "-message\">";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>";
  return buffer;
  });

this["templates"]["registration"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header class=\"header\">\n    <h2 class=\"instructions\">Please <strong>lock your device's orientation</strong> and <strong>stop it from going to sleep</strong> in order to get the best experimental conditions possible.</h2>\n</header>\n\n<form id=\"name-form\">\n    <input type=\"text\" id=\"name-input\" class=\"input\" placeholder=\"Enter your name\" autocapitalize=\"off\" autocorrect=\"off\" autocomplete=\"off\">\n    <button id=\"name-button\" class=\"button\">Join the experiment!</button>\n</form>";
  });

this["templates"]["waiting"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<header class=\"header\">\n    <h1 class=\"banner\" role=\"banner\">Gyroscopes &amp; Isotopes</h1>\n</header>\n\n<button id=\"cancel-button\" class=\"button\">Cancel</button>";
  });

return this["templates"];

});