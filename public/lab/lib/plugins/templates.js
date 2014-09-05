ig.module(
    'plugins.templates'
).requires(
    'plugins.handlebars-runtime'
)
.defines(function () {
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
  


  return "<header class=\"header\">\n    <h1 class=\"banner\" role=\"banner\">Gyroscopes &amp; Isotopes</h1>\n</header>\n\n<section class=\"main\" role=\"main\">\n    <div class=\"warning\">\n        <canvas id=\"canvas\"></canvas>\n    </div>\n</section>";
  });

this["templates"]["gameover"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header class=\"header\">\n    <h1 class=\"banner\" role=\"banner\">Gyroscopes &amp; Isotopes</h1>\n</header>\n\n<section class=\"main\" role=\"main\">\n    <p class=\"player\" style=\"background: rgb("
    + escapeExpression(((stack1 = ((stack1 = depth0.winner),stack1 == null || stack1 === false ? stack1 : stack1.colour)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ");\"><span class=\"player-name\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.winner),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " survived!</span></p>\n    <p><strong>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.consumed)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong> particles were consumed by the black hole.</p>\n    <p><strong>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.positrons)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong> positrons were absorbed by participants' neutrons.</p>\n    <p><strong>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.negatrons)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong> negatrons caused neutron decay.</p>\n    <p><strong>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.electrons)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong> electrons were blasted into raw energy.</p>\n    <p>This experiment lasted <strong>"
    + escapeExpression(((stack1 = ((stack1 = depth0.stats),stack1 == null || stack1 === false ? stack1 : stack1.duration)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</strong> seconds.</p>\n    <a href=\"/gyroscopes-and-isotopes/lab/"
    + escapeExpression(((stack1 = ((stack1 = depth0.winner),stack1 == null || stack1 === false ? stack1 : stack1.labId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" title=\"Click to play again\" class=\"link-button rerun\">Rerun the experiment</a>\n</section>";
  return buffer;
  });

this["templates"]["lobby"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <li id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"player\" style=\"background: rgb(";
  if (stack1 = helpers.colour) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.colour; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ");\"><span class=\"player-name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></li>\n        ";
  return buffer;
  }

  buffer += "<header class=\"header\">\n    <h1 class=\"banner\" role=\"banner\">Gyroscopes &amp; Isotopes</h1>\n</header>\n\n<section class=\"main\" role=\"main\">\n    <p class=\"instructions\">Scan the QR code or navigate to the URL below on a mobile device to join the experiment:-</p>\n    <p><span id=\"qrcode\" data-href=\"";
  if (stack1 = helpers.controllerUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.controllerUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></span><span id=\"or\" class=\"or\">Or</span><span id=\"countdown\" class=\"or hidden\"><span class=\"seconds\">5</span></span><span class=\"shortUrl\">";
  if (stack1 = helpers.shortControllerUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.shortControllerUrl; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></p>\n    <ul id=\"players\">\n        <li class=\"player-slot\">1</li>\n        <li class=\"player-slot\">2</li>\n        <li class=\"player-slot\">3</li>\n        <li class=\"player-slot\">4</li>\n        ";
  stack1 = helpers.each.call(depth0, depth0.players, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n    <button id=\"start-experiment\" data-icon=\"&#x3e;\"></button>\n</section>";
  return buffer;
  });

this["templates"]["lobby.player"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return " ready";
  }

  buffer += "<li id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"player";
  stack1 = helpers['if'].call(depth0, depth0.ready, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" style=\"background: rgb(";
  if (stack1 = helpers.colour) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.colour; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ");\"><span class=\"player-name\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></li>";
  return buffer;
  });
    Handlebars.templates = this["templates"];

});