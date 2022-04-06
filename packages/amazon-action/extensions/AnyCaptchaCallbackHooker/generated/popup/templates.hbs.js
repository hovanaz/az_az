this["RQ"] = this["RQ"] || {};
this["RQ"]["Templates"] = this["RQ"]["Templates"] || {};

Handlebars.registerPartial("PremiumBadge", this["RQ"]["Templates"]["PremiumBadge"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<a class=\"premium-badge\"\n   href=\"https://www.requestly.io/blog/2019/02/18/introducing-premium-plans-free-plan-limits\" target=\"_blank\">\n  <span class=\"badge badge-success\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.title : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n    <i class=\"fa fa-star\"></i>\n    <span>Premium</span>\n  </span>\n</a>\n";
},"useData":true}));

Handlebars.registerPartial("StatusToggle", this["RQ"]["Templates"]["StatusToggle"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<a class=\"switch square\">\n  <label>\n    Off\n    <input type=\"checkbox\" class=\"status-toggle\" "
    + ((stack1 = (helpers.equals || (depth0 && depth0.equals) || helpers.helperMissing).call(depth0,(depth0 != null ? depth0.status : depth0),"Active",{"name":"equals","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " />\n    <span class=\"lever\"></span>\n    On\n  </label>\n</a>\n";
},"useData":true}));

this["RQ"]["Templates"]["Favourites"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "  <div class=\"secondary-text\">Favourite rules:</div>\n  <div id=\"favourites-rules-list\" class=\"list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.rules : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression, alias3="function";

  return "      <div class=\"list-item favourite-rule rule-theme-"
    + alias2((helpers.toLowerCase || (depth0 && depth0.toLowerCase) || alias1).call(depth0,(depth0 != null ? depth0.ruleType : depth0),{"name":"toLowerCase","hash":{},"data":data}))
    + "\" data-index=\""
    + alias2(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n        <span class=\"fav-icon-holder "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isFavourite : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n          <i class=\"fa fa-heart fav-icon fav-icon-favourite\" title=\"Remove from favourites\"></i>\n          <i class=\"fa fa-heart-o fav-icon fav-icon-not-favourite\" title=\"Add to favourites\"></i>\n        </span>\n        <span class=\"rule-type badge\">\n          <i class=\""
    + alias2((helpers.getRuleIconClass || (depth0 && depth0.getRuleIconClass) || alias1).call(depth0,(depth0 != null ? depth0.ruleType : depth0),{"name":"getRuleIconClass","hash":{},"data":data}))
    + "\" title=\""
    + alias2(((helper = (helper = helpers.ruleType || (depth0 != null ? depth0.ruleType : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"ruleType","hash":{},"data":data}) : helper)))
    + " Rule\"></i>\n        </span>\n        <a class=\"rule-name\" href=\""
    + alias2((helpers.readGlobalVar || (depth0 && depth0.readGlobalVar) || alias1).call(depth0,"RQ.RULES_PAGE_URL",{"name":"readGlobalVar","hash":{},"data":data}))
    + "#edit/"
    + alias2(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n"
    + ((stack1 = this.invokePartial(partials.StatusToggle,depth0,{"name":"StatusToggle","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "      </div>\n";
},"3":function(depth0,helpers,partials,data) {
    return "is-favourite";
},"5":function(depth0,helpers,partials,data) {
    return "  <div class=\"no-rules-message\">\n    <p>Your favourite rules appear here, so you can quickly toggle them.</p>\n    <p>\n      <a class=\"manage-favourites-link\" href=\""
    + this.escapeExpression((helpers.readGlobalVar || (depth0 && depth0.readGlobalVar) || helpers.helperMissing).call(depth0,"RQ.RULES_PAGE_URL",{"name":"readGlobalVar","hash":{},"data":data}))
    + "\" target=\"_blank\">Go to app</a>\n      <span>to mark rules as favourite</span>\n      <i class=\"fa fa-heart fav-icon fav-icon-favourite\"></i>\n    </p>\n  </div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.rules : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true});

this["RQ"]["Templates"]["PopupContainer"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div id=\"popup-header\">\n  <div class=\"product-logo\">\n    <img src=\"/resources/images/extended_logo-96.png\" class=\"product-image\" />\n  </div>\n  <a id=\"app-link\" class=\"btn btn-sm btn-primary\" href=\""
    + this.escapeExpression((helpers.readGlobalVar || (depth0 && depth0.readGlobalVar) || helpers.helperMissing).call(depth0,"RQ.RULES_PAGE_URL",{"name":"readGlobalVar","hash":{},"data":data}))
    + "\" target=\"_blank\">\n    <span>Open app</span>\n    <i class=\"fa fa-external-link\"></i>\n  </a>\n</div>\n<div id=\"popup-content\">\n  <div id=\"favourites\"></div>\n</div>\n<div class=\"popup-footer\">\n  <p class=\"secondary-text\">To see logs for all rules applied on this page, Right click on page &gt; Inspect &gt; Requestly tab.</p>\n</div>";
},"useData":true});