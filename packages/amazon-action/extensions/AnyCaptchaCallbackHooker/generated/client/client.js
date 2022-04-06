
  if (typeof isReactApp === "undefined") {
    var isReactApp = typeof require !== "undefined";
  }

  const configs = {
  "browser": "chrome",
  "storageType": "sync",
  "contextMenuContexts": [
    "browser_action"
  ],
  "collectExtUsageStats": true,
  "env": "prod",
  "WEB_URL": "https://app.requestly.io",
  "firebaseConfig": {
    "apiKey": "AIzaSyC2WOxTtgKH554wCezEJ4plxnMNXaUSFXY",
    "authDomain": "app.requestly.io",
    "databaseURL": "https://requestly.firebaseio.com",
    "projectId": "project-7820168409702389920",
    "storageBucket": "project-7820168409702389920.appspot.com",
    "messagingSenderId": "911299702852"
  },
  "logLevel": "info",
  "stripeConfig": {
    "publishableKey": "pk_live_FgVCiLBLJBaVSLulhPWptlDg",
    "productIds": {
      "enterprisePlan": {
        "INR": {
          "monthly": "price_1Hs62NIVcpOtHqujisdpsA53",
          "quarterly": "price_1Hs62NIVcpOtHqujbIhUiCNO",
          "half-yearly": "price_1Hs62NIVcpOtHqujk2TCvkba",
          "annual": "price_1Hs62OIVcpOtHqujuSmvQ0LR"
        },
        "USD": {
          "monthly": "price_1Hs62NIVcpOtHqujNdJXy1U2",
          "quarterly": "price_1Hs62NIVcpOtHqujA6BhjyBc",
          "half-yearly": "price_1Hs62NIVcpOtHqujrfFCxb4I",
          "annual": "price_1Hs62NIVcpOtHqujafhBiwBk"
        },
        "default": "price_1Hs62NIVcpOtHqujNdJXy1U2"
      }
    }
  },
  "version": "21.7.22",
  "UI_DOMAINS": [
    "requestly.io",
    "requestly.in",
    "localhost"
  ]
};
  if (isReactApp) {
    /** For React App */
    module.exports = configs;
  } else {
    /** 
     * For legacy apps- browser extension 
     * Added if-check because desktop app breaks on compilation
     */
    if (window) {
      window.RQ = window.RQ || {};
      window.RQ.configs = configs;  
    }
  }  

/**
 * This module is define as CommonJS Module. We should move it to ES6 Module later on and fix the imports.
 * Right now the imports are defined using require, once changed to ES6 module we can move to import module
 * @TODO: Remove dependency of configs from constants.
 */
if (typeof isReactApp === "undefined") {
  var isReactApp = typeof require !== "undefined";
}
const CONSTANTS = {};
let CONFIGS;

if (isReactApp) {
  CONFIGS = require("../../config");
} else {
  CONFIGS = window.RQ.configs;
}

CONSTANTS.APP_MODES = {
  DESKTOP: "DESKTOP",
  EXTENSION: "EXTENSION",
  WORDPRESS: "WORDPRESS",
  CLOUDFLARE: "CLOUDFLARE",
};

CONSTANTS.COMPANY_INFO = {
  SUPPORT_EMAIL: "contact@requestly.io",
};

CONSTANTS.VERSION = 3;

CONSTANTS.FILE_PICKER_URL = "/library/filepicker";

CONSTANTS.VERSIONS = {
  REPLACE_RULE: 2,
};

CONSTANTS.ENV = CONFIGS.env;

CONSTANTS.PUBLIC_NAMESPACE = "__REQUESTLY__";

// Url which gets opened when User clicks on browserAction (requestly icon) in toolbar
CONSTANTS.RULES_PAGE_URL = CONFIGS.WEB_URL + "/rules/";

CONSTANTS.RULES_PAGE_URL_PATTERN = CONSTANTS.RULES_PAGE_URL + "*";

CONSTANTS.PRICING_PAGE_URL = CONFIGS.WEB_URL + "/pricing/";

CONSTANTS.GOODBYE_PAGE_URL = CONFIGS.WEB_URL + "/goodbye/";

// URL For Delay Request API
CONSTANTS.DELAY_API_URL = CONFIGS.WEB_URL + "/delay/";

/**
 * We are calling them as BLACK_LIST_DOMAINS
 * however the usage is code is as the URL containing these substrings, We don't touch those requests
 */
CONSTANTS.BLACK_LIST_DOMAINS = [
  "requestly.in",
  "requestly.io",
  "rq.in",
  "rq.io",
  "__rq",
];

CONSTANTS.STRING_CONSTANTS = {
  SLASH: "/",
};

CONSTANTS.LIMITS = {
  NUMBER_SHARED_LISTS: 10,
};

CONSTANTS.DEFAULTS = {
  APP_INIT_TIMEOUT: 5000,
};

CONSTANTS.OBJECT_TYPES = {
  GROUP: "group",
  RULE: "rule",
};

CONSTANTS.RULE_TYPES = {
  REDIRECT: "Redirect",
  CANCEL: "Cancel",
  REPLACE: "Replace",
  HEADERS: "Headers",
  USERAGENT: "UserAgent",
  SCRIPT: "Script",
  QUERYPARAM: "QueryParam",
  RESPONSE: "Response",
  DELAY: "Delay",
};

CONSTANTS.DELAY_REQUEST_CONSTANTS = {
  DELAY_PARAM_NAME: "delay", // string to add as query paramName
  DELAY_PARAM_VALUE: "true", // string to add as query paramValue
  MIN_DELAY_VALUE: 1,
  MAX_DELAY_VALUE_NON_XHR: 10000,
  MAX_DELAY_VALUE_XHR: 5000,
  DELAY_TYPE: {
    CLIENT_SIDE: "clientSideDelay",
    SERVER_SIDE: "serverSideDelay",
  },
  REQUEST_TYPE: {
    XHR: "xmlhttprequest",
  },
  METHOD_TYPE: {
    GET: "GET",
  },
};

CONSTANTS.OBJECT_FORMAT_KEYS = {
  CREATION_DATE: "creationDate",
  NAME: "name",
  ID: "id",
  RULE_TYPE: "ruleType",
  STATUS: "status",
  OBJECT_TYPE: "objectType",
  GROUP_ID: "groupId",
  IS_FAVOURITE: "isFavourite",
};

CONSTANTS.HEADER_NAMES = {
  USER_AGENT: "User-Agent",
};

CONSTANTS.GROUP_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

CONSTANTS.RULE_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

CONSTANTS.RULE_KEYS = {
  URL: "Url",
  HOST: "host",
  PATH: "path",
  HEADER: "Header",
  OVERWRITE: "Overwrite",
  IGNORE: "Ignore",
  PARAM: "param",
  VALUE: "value",
};

CONSTANTS.PATH_FROM_PAIR = {
  RULE_KEYS: "source.key",
  RULE_OPERATORS: "source.operator",
  SCRIPT_LIBRARIES: "libraries",
  SOURCE_PAGE_URL_OPERATOR: "source.filters.pageUrl.operator",
  SOURCE_PAGE_URL_VALUE: "source.filters.pageUrl.value",
  SOURCE_RESOURCE_TYPE: "source.filters.resourceType",
  SOURCE_REQUEST_METHOD: "source.filters.requestMethod",
};

CONSTANTS.URL_COMPONENTS = {
  PROTOCOL: "Protocol",
  URL: "Url",
  HOST: "host",
  PATH: "path",
  QUERY: "query",
  HASH: "hash",
};

CONSTANTS.RULE_OPERATORS = {
  EQUALS: "Equals",
  CONTAINS: "Contains",
  MATCHES: "Matches",
  WILDCARD_MATCHES: "Wildcard_Matches",
};

CONSTANTS.RULE_SOURCE_FILTER_TYPES = {
  PAGE_URL: "pageUrl",
  RESOURCE_TYPE: "resourceType",
  REQUEST_METHOD: "requestMethod",
};

CONSTANTS.MODIFICATION_TYPES = {
  ADD: "Add",
  REMOVE: "Remove",
  REMOVE_ALL: "Remove All",
  MODIFY: "Modify",
  REPLACE: "Replace",
};

CONSTANTS.NEED_HELP_QUERY_TYPES = {
  FEEDBACK: "Feedback",
  BUG: "Bug",
  QUESTION: "Question",
  FEATURE_REQUEST: "FeatureRequest",
};

CONSTANTS.CLIENT_MESSAGES = {
  GET_SCRIPT_RULES: "getScriptRules",
  GET_USER_AGENT_RULE_PAIRS: "getUserAgentRulePairs",
  OVERRIDE_RESPONSE: "overrideResponse",
  NOTIFY_RULES_APPLIED: "notifyRulesApplied",
};

CONSTANTS.EXTENSION_MESSAGES = {
  FOCUS_TAB: "focusTab",
  GET_FULL_LOGS: "getFullLogs",
  CLEAR_LOGS_FOR_TAB: "clearLogsForTab",
  CLEAR_LOGS_FOR_DOMAIN: "clearLogsForDomain",
  GET_FAVOURITE_RULES: "getFavouriteRules",
  GET_FLAGS: "getFlags",
};

CONSTANTS.HEADERS_TARGET = {
  REQUEST: "Request",
  RESPONSE: "Response",
};

CONSTANTS.REQUEST_TYPES = {
  MAIN_FRAME: "mainFrame",
  PAGE_REQUEST: "pageRequest",
};

CONSTANTS.SCRIPT_TYPES = {
  URL: "url",
  CODE: "code",
};

CONSTANTS.SCRIPT_CODE_TYPES = {
  JS: "js",
  CSS: "css",
};

CONSTANTS.SCRIPT_LOAD_TIME = {
  BEFORE_PAGE_LOAD: "beforePageLoad",
  AFTER_PAGE_LOAD: "afterPageLoad",
};

CONSTANTS.SCRIPT_LIBRARIES = {
  JQUERY: { name: "jQuery", src: "https://code.jquery.com/jquery-2.2.4.js" },
  UNDERSCORE: {
    name: "Underscore",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js",
  },
};

CONSTANTS.RESPONSE_BODY_TYPES = {
  STATIC: "static",
  CODE: "code",
};

CONSTANTS.RESPONSE_CODES = {
  NOT_FOUND: 404,
};

CONSTANTS.STORAGE_KEYS = {
  REQUESTLY_SETTINGS: "rq_settings",
  USER_INFO: "user_info",
  LATEST_NOTIFICATION_READ_BY_USER: "latestNotificationReadId",
};

CONSTANTS.MESSAGES = {
  DELETE_ITEMS_NO_SELECTION_WARNING:
    "Please select one or more rules to delete.",
  DELETE_ITEMS: "Are you sure you want to delete the selected items?",
  DELETE_GROUP_WITH_RULES_WARNING:
    "There are some rules contained in this group. Please delete or ungroup them before deleting the group.",
  DELETE_GROUP: "Are you sure you want to delete the group?",
  UNGROUP_ITEMS_NO_SELECTION_WARNING:
    "Please select one or more rules to ungroup.",
  UNGROUP_ITEMS: "Are you sure you want to ungroup the selected items?",
  SIGN_IN_TO_VIEW_SHARED_LISTS: "Please login to view your Shared Lists.",
  SIGN_IN_TO_CREATE_SHARED_LISTS: "Please login to share the selected rules",
  SIGN_IN_TO_SUBMIT_QUERY: "Please login to contact our support team.",
  ERROR_AUTHENTICATION:
    "Received some error in authentication. Please try again later!!",
  SHARED_LISTS_LIMIT_REACHED:
    "You can not create more than" +
    CONSTANTS.LIMITS.NUMBER_SHARED_LISTS +
    "shared lists",
  ERROR_TAB_FOCUS: "The tab cannot be focused, as it might have been closed.",
  DEACTIVATE_REQUESTLY_MENU_OPTION: "Deactivate Requestly",
};

CONSTANTS.RESOURCES = {
  EXTENSION_ICON: "/resources/images/48x48.png",
  EXTENSION_ICON_GREYSCALE: "/resources/images/48x48_greyscale.png",
  EXTENSION_ICON_GREEN: "/resources/images/48x48_green.png",
};

CONSTANTS.GA_EVENTS = {
  CATEGORIES: {
    RULES: "rules",
    RULE: "rule",
    GROUP: "group",
    USER: "user",
    SHARED_LIST: "shared list",
    RULE_LOGS: "rule logs",
    EXTENSION: "extension",
    IN_APP_NOTIFICATION: "InAppNotification",
    NEED_HELP_FEATURE: "need help feature",
    PRICING: "pricing",
    LICENSE: "license",
    LIBRARY: "library",
    UNLOCK: "unlock",
    REMOTE_RULES: "remoteRules",
    SPONSOR_SIDERAIL: "sponsor_siderail",
    LOGIN: "login",
    SIGNUP: "signup",
    REFERRAL: "referral",
    PAGE_VISITS: "page visits",
    REQUEST_UPGRADE: "request upgrade",
    MARKETPLACE: "marketplace",
    CHECKOUT: "checkout page",
    TEAMS: "teams page",
    ONBOARDING: "onboarding page",
    RULE_PAIRS: "rule pairs",
  },
  ACTIONS: {
    MODIFIED: "modified",
    CREATED: "created",
    DELETED: "deleted",
    ACTIVATED: "activated",
    DEACTIVATED: "deactivated",
    IMPORTED: "imported",
    EXPORTED: "exported",
    LIMIT_REACHED: "limit reached",
    AUTHENTICATED: "authenticated",
    VIEWED: "viewed",
    CLICKED: "clicked",
    COPIED: "copied",
    MARKED_FAVOURITE: "marked favourite",
    UNMARKED_FAVOURITE: "unmarked favourite",
    WORKFLOW_STARTED: "workflow started",
    ALREADY_LOGIN: "already login",
    LOGIN_REQUESTED: "login requested",
    LOGIN_DONE: "login done",
    LOGIN_REJECTED: "login rejected",
    FORM_SUBMITTED: "form submitted",
    FORM_REJECTED: "form rejected",
    INVALID_SUBMIT: "invalid submit",
    GROUPED: "grouped",
    UNGROUPED: "ungrouped",
    SHARED: "shared",
    ERROR: "error occured",
    TASK_COMPLETED: "task completed",

    CARD_ERROR: "card error",
    CARD_ACCEPTED: "card accepted",
    CARD_ENTERED: "card num and cv entered",

    CURRENCY_CHANGE: "currency_changed",
    DURATION_CHANGE: "duration_changed",
    APPLIED_SUCCESSFULLY: "applied_successfully",
    APPLIED_UNSUCCESSFULLY: "applied_unsuccessfully",

    REVOKED: "revoked",
    BOUGHT: "bought",
    UPDATED: "updated",
    REQUEST_ADMIN: "enterprise_plan_requested",

    UNINSTALLED: "uninstalled",
    UNINSTALL_RESPONSE: "uninstall_response",

    ROUTE_VIEWED: "route_viewed",
    EMAIL_LOGIN_PERFORMED: "email_login_performed",
    EMAIL_SIGNUP_PERFORMED: "email_signup_performed",
    GMAIL_LOGIN_PERFORMED: "gmail_login_performed",
    GMAIL_SIGNUP_PERFORMED: "gmail_signup_performed",
    MICROSOFT_LOGIN_PERFORMED: "microsoft_login_performed",
    APPLE_LOGIN_PERFORMED: "apple_login_performed",

    REFERRAL_APPLIED: "referral_applied",
    REFERRAL_FAILED: "referral_failed",

    EMAIL_VERIFICATION_RESEND: "resend_email_verification",
    EMAIL_VERIFICATION_SUCCESSFUL: "email_verification_successful",
    EMAIL_VERIFICATION_FAILED: "email_verification_failed",
  },
  ATTR: {
    PAYMENT_MODE: "payment_mode",
    PLANNAME: "planname",
    PLAN_DURATION: "plan_duration",
    PLAN_ID: "plan_id",
    PLAN_START_DATE: "plan_startDate",
    PLAN_END_DATE: "plan_endDate",
    COUPON: "coupon",
    COUPON_VALUE: "coupon_value",
    LICENSE: "licensekey",
    COMPANY: "company",

    PROFILE: "profile",

    REMOTE_RULES_ENDPOINT: "remoteRulesEndpoint",
    REMOTE_RULES_FREQUENCY: "remoteRulesFrequency",

    NUM_RULES: "NUM_RULES",
    NUM_ACTIVE_RULES: "NUM_ACTIVE_RULES",
    NUM_GROUPS: "NUM_GROUPS",
    NUM_ACTIVE_GROUPS: "NUM_ACTIVE_GROUPS",
    NUM_SHARED_LISTS: "NUM_SHARED_LISTS",
  },
  VALUES: {
    PAYPAL: "paypal",
  },
  GA_CUSTOM_DIMENSIONS: {
    USER_ID: "dimension1",
  },
  GA_CUSTOM_METRICS: {
    num_rules: "metric1",
  },
};

CONSTANTS.USER = {
  AUTHORIZED: "authorized-user",
  UNAUTHORIZED: "unauthorized-user",
};

CONSTANTS.FIREBASE_NODES = {
  USERS: "users",
  PUBLIC: "public",
  SHARED_LISTS: "sharedLists",
  FEEDBACK: "feedback",
  FILES: "files",
};

CONSTANTS.DATASTORE = {
  ACTIONS: {
    CHECK_USER_AUTH: "check:userAuthenticated",
    AUTHENTICATE: "authenticate",
    FETCH_USER_DETAILS: "fetchUserDetails",
    GETVALUE: "getValue",
    SETVALUE: "setValue",
  },
};

CONSTANTS.MESSAGE_HANDLER = {
  ACTIONS: {
    SUBMIT_EVENT: "submitEvent",
    SUBMIT_ATTR: "submitAttr",
  },
  MESSAGE_TYPES: {
    EVENT: "event",
    ATTRIBUTE: "attribute",
  },
  SINKS: {
    CUSTOMERLY: "customerly",
  },
};

CONSTANTS.getSharedListURL = function (shareId, sharedListName) {
  const formattedSharedListName = sharedListName
    .replace(new RegExp(" +|/+", "g"), "-")
    .replace(/-+/g, "-");
  return (
    CONSTANTS.RULES_PAGE_URL +
    "#sharedList/" +
    shareId +
    "-" +
    formattedSharedListName
  );
};

CONSTANTS.getSharedListTimestamp = function (sharedListId) {
  return sharedListId.split("-")[0];
};

CONSTANTS.fireAjax = function (requestURL, async) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", requestURL, async);
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject();
        }
      }
    };
    request.send();
  });
};

if (isReactApp) {
  module.exports = CONSTANTS;
} else {
  /** For legacy apps- browser extension */
  Object.assign(window.RQ, CONSTANTS);
}

RQ.Utils = RQ.Utils || {};

RQ.Utils.executeJS = function (code, shouldRemove) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.className = RQ.Utils.getScriptClassAttribute();

  script.appendChild(document.createTextNode(code));
  const parent = document.head || document.documentElement;
  parent.appendChild(script);

  if (shouldRemove) {
    parent.removeChild(script);
  }
};

RQ.Utils.addRemoteJS = function (src, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  script.className = RQ.Utils.getScriptClassAttribute();

  if (typeof callback === "function") {
    script.onload = callback;
  }

  (document.head || document.documentElement).appendChild(script);
  return script;
};

RQ.Utils.embedCSS = function (css) {
  var style = document.createElement("style");
  style.type = "text/css";
  style.appendChild(document.createTextNode(css));
  style.className = RQ.Utils.getScriptClassAttribute();

  (document.head || document.documentElement).appendChild(style);
  return style;
};

RQ.Utils.addRemoteCSS = function (src) {
  var link = document.createElement("link");
  link.href = src;
  link.type = "text/css";
  link.rel = "stylesheet";
  link.className = RQ.Utils.getScriptClassAttribute();

  (document.head || document.documentElement).appendChild(link);
  return link;
};

RQ.Utils.onPageLoad = function () {
  return new Promise(function (resolve) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", resolve);
    } else {
      resolve();
    }
  });
};

RQ.Utils.getScriptClassAttribute = function () {
  return RQ.PUBLIC_NAMESPACE + "SCRIPT";
};

RQ.Utils.isHTMLDocument = function () {
  const docType = document.doctype;
  return docType && docType.name === "html";
};

RQ.ScriptRuleHandler = {};

RQ.ScriptRuleHandler.setup = function () {
  const message = {
    action: RQ.CLIENT_MESSAGES.GET_SCRIPT_RULES,
    url: window.location.href,
  };
  chrome.runtime.sendMessage(message, function (rules) {
    if (rules && rules.constructor === Array) {
      RQ.ScriptRuleHandler.handleRules(rules);

      chrome.runtime.sendMessage({
        action: RQ.CLIENT_MESSAGES.NOTIFY_RULES_APPLIED,
        url: window.location.href,
        rules: rules,
        modification: "executed script",
      });
    }
  });
};

RQ.ScriptRuleHandler.handleRules = function (rules) {
  return new Promise(function (resolve) {
    var libraries = [],
      scripts = [];

    rules.forEach(function (rule) {
      var pair = rule.pairs[0];

      pair.libraries &&
        pair.libraries.forEach(function (library) {
          if (!libraries.includes(library)) {
            libraries.push(library);
          }
        });

      scripts = scripts.concat(pair.scripts || []);
    });

    var cssScripts = scripts.filter(function (script) {
      return script.codeType === RQ.SCRIPT_CODE_TYPES.CSS;
    });

    var jsScripts = scripts.filter(function (script) {
      return !script.codeType || script.codeType === RQ.SCRIPT_CODE_TYPES.JS;
    });

    RQ.ScriptRuleHandler.handleCSSScripts(cssScripts)
      .then(function () {
        return RQ.ScriptRuleHandler.handleJSLibraries(libraries);
      })
      .then(function () {
        return RQ.ScriptRuleHandler.handleJSScripts(jsScripts);
      })
      .then(resolve);
  });
};

RQ.ScriptRuleHandler.handleCSSScripts = function (cssScripts) {
  return new Promise(function (resolve) {
    cssScripts.forEach(RQ.ScriptRuleHandler.includeCSS);
    resolve();
  });
};

RQ.ScriptRuleHandler.handleJSLibraries = function (libraries) {
  return new Promise(function (resolve) {
    RQ.ScriptRuleHandler.addLibraries(libraries, resolve);
  });
};

RQ.ScriptRuleHandler.handleJSScripts = function (jsScripts) {
  return new Promise(function (resolve) {
    var prePageLoadScripts = [],
      postPageLoadScripts = [];

    jsScripts.forEach(function (script) {
      if (script.loadTime === RQ.SCRIPT_LOAD_TIME.BEFORE_PAGE_LOAD) {
        prePageLoadScripts.push(script);
      } else {
        postPageLoadScripts.push(script);
      }
    });

    RQ.ScriptRuleHandler.includeJSScriptsInOrder(
      prePageLoadScripts,
      function () {
        RQ.Utils.onPageLoad().then(function () {
          RQ.ScriptRuleHandler.includeJSScriptsInOrder(
            postPageLoadScripts,
            resolve
          );
        });
      }
    );
  });
};

RQ.ScriptRuleHandler.addLibraries = function (libraries, callback, index) {
  index = index || 0;

  if (index >= libraries.length) {
    typeof callback === "function" && callback();
    return;
  }

  var libraryKey = libraries[index],
    library = RQ.SCRIPT_LIBRARIES[libraryKey],
    addNextLibraries = function () {
      RQ.ScriptRuleHandler.addLibraries(libraries, callback, index + 1);
    };

  if (library) {
    RQ.Utils.addRemoteJS(library.src, addNextLibraries);
  } else {
    addNextLibraries();
  }
};

RQ.ScriptRuleHandler.includeJSScriptsInOrder = function (
  scripts,
  callback,
  index
) {
  index = index || 0;

  if (index >= scripts.length) {
    typeof callback === "function" && callback();
    return;
  }

  RQ.ScriptRuleHandler.includeJS(scripts[index], function () {
    RQ.ScriptRuleHandler.includeJSScriptsInOrder(scripts, callback, index + 1);
  });
};

RQ.ScriptRuleHandler.includeJS = function (script, callback) {
  if (script.type === RQ.SCRIPT_TYPES.URL) {
    RQ.Utils.addRemoteJS(script.value, callback);
    return;
  }

  if (script.type === RQ.SCRIPT_TYPES.CODE) {
    RQ.Utils.executeJS(script.value);
  }

  typeof callback === "function" && callback();
};

RQ.ScriptRuleHandler.includeCSS = function (script, callback) {
  if (script.type === RQ.SCRIPT_TYPES.URL) {
    RQ.Utils.addRemoteCSS(script.value);
  } else if (script.type === RQ.SCRIPT_TYPES.CODE) {
    RQ.Utils.embedCSS(script.value);
  }

  typeof callback === "function" && callback();
};

RQ.UserAgentRuleHandler = {};

RQ.UserAgentRuleHandler.setup = function () {
  const message = {
    action: RQ.CLIENT_MESSAGES.GET_USER_AGENT_RULE_PAIRS,
    url: window.location.href,
  };
  chrome.runtime.sendMessage(message, function (rulePairs) {
    if (rulePairs && rulePairs.constructor === Array && rulePairs.length > 0) {
      RQ.UserAgentRuleHandler.handleRulePairs(rulePairs);
    }
  });
};

RQ.UserAgentRuleHandler.handleRulePairs = function (rulePairs) {
  var finalUserAgentRulePair = rulePairs[rulePairs.length - 1], // only last user agent will finally be applied
    userAgent = finalUserAgentRulePair.userAgent,
    platform = RQ.UserAgentRuleHandler.getPlatformFromUserAgent(userAgent),
    vendor = RQ.UserAgentRuleHandler.getVendorFromUserAgent(userAgent);

  RQ.Utils.executeJS(
    `Object.defineProperty(window.navigator, 'userAgent', { get: function() { return '${userAgent}'; } });`
  );
  RQ.Utils.executeJS(
    `Object.defineProperty(window.navigator, 'vendor', { get: function() { return '${vendor}'; } });`
  );

  if (platform) {
    // override platform only if it could be derived from userAgent
    RQ.Utils.executeJS(
      `Object.defineProperty(window.navigator, 'platform', { get: function() { return '${platform}'; } });`
    );
  }
};

RQ.UserAgentRuleHandler.getPlatformFromUserAgent = function (userAgent) {
  var PLATFORMS = {
    Macintosh: "MacIntel",
    Android: "Android",
    Linux: "Linux",
    iPhone: "iPhone",
    iPad: "iPad",
    Windows: "Win32",
  };

  for (var key in PLATFORMS) {
    if (userAgent.includes(key)) {
      return PLATFORMS[key];
    }
  }
};

RQ.UserAgentRuleHandler.getVendorFromUserAgent = function (userAgent) {
  var VENDORS = {
    iPhone: "Apple Computer, Inc.",
    iPad: "Apple Computer, Inc.",
    Chrome: "Google Inc.",
  };

  for (var key in VENDORS) {
    if (userAgent.includes(key)) {
      return VENDORS[key];
    }
  }

  return ""; // vendor is empty string for others
};

RQ.ResponseRuleHandler = {};

RQ.ResponseRuleHandler.setup = function () {
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.action === RQ.CLIENT_MESSAGES.OVERRIDE_RESPONSE) {
      RQ.ResponseRuleHandler.handleOverrideResponseMessage(message);
      sendResponse();
      return true;
    }
  });

  window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source !== window || event.data.from !== "requestly") {
      return;
    }

    if (event.data.type === "response_rule_applied") {
      chrome.runtime.sendMessage({
        action: RQ.CLIENT_MESSAGES.NOTIFY_RULES_APPLIED,
        url: window.location.href,
        ruleIds: [event.data.id],
        modification: "modified response",
      });
    }
  });

  RQ.Utils.executeJS(
    `(${this.interceptAJAXRequests.toString()})('${RQ.PUBLIC_NAMESPACE}')`
  );
};

RQ.ResponseRuleHandler.handleOverrideResponseMessage = function (message) {
  RQ.Utils.executeJS(
    `window.${RQ.PUBLIC_NAMESPACE}.responseRules['${
      message.url
    }'] = ${JSON.stringify(message.rule)};`,
    true
  );

  // Set evaluator function in global scope when user selects code(or function)
  // We don't need this in case when user selects JSON response directly
  if (message.rule.response.type === "code") {
    RQ.Utils.executeJS(
      `window.${RQ.PUBLIC_NAMESPACE}.responseRules['${message.url}'].evaluator = ${message.rule.response.value};`
    );
  }
};

/* Do not refer other function/variables from below function, as it will be injected in website and will run in
 different JS context */
RQ.ResponseRuleHandler.interceptAJAXRequests = function (namespace) {
  window[namespace] = window[namespace] || {};
  window[namespace].responseRules = {};

  const isApplicableOnUrl = (url) =>
    window[namespace].responseRules.hasOwnProperty(url);
  const getResponseRule = (url) => window[namespace].responseRules[url];
  const notifyRuleApplied = (rule) => {
    window.postMessage(
      {
        from: "requestly",
        type: "response_rule_applied",
        id: rule.id,
      },
      window.location.href
    );
  };

  // Intercept XMLHttpRequest
  const onReadyStateChange = function () {
    if (this.readyState === 4 && isApplicableOnUrl(this.responseURL)) {
      const responseRule = getResponseRule(this.responseURL);
      const { response } = responseRule;
      const responseType = this.responseType;
      const customResponse =
        response.type === "code"
          ? responseRule.evaluator({
              method: this.method,
              url: this.responseURL,
              requestHeaders: this.requestHeaders,
              requestData: this.requestData,
              responseType: this.responseType,
              response: this.response,
            })
          : response.value;

      Object.defineProperty(this, "response", {
        get: function () {
          if (response.type === "static" && responseType === "json") {
            return JSON.parse(customResponse);
          }
          return customResponse;
        },
      });

      if (responseType === "" || responseType === "text") {
        Object.defineProperty(this, "responseText", {
          get: function () {
            return customResponse;
          },
        });
      }

      notifyRuleApplied(responseRule);
    }
  };

  const XHR = XMLHttpRequest;
  XMLHttpRequest = function () {
    const xhr = new XHR();
    xhr.addEventListener(
      "readystatechange",
      onReadyStateChange.bind(xhr),
      false
    );
    return xhr;
  };
  XMLHttpRequest.prototype = XHR.prototype;
  Object.entries(XHR).map(([key, val]) => {
    XMLHttpRequest[key] = val;
  });

  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method) {
    this.method = method;
    open.apply(this, arguments);
  };

  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (data) {
    this.requestData = data;
    send.apply(this, arguments);
  };

  let setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    this.requestHeaders = this.requestHeaders || {};
    this.requestHeaders[header] = value;
    setRequestHeader.apply(this, arguments);
  };

  // Intercept fetch API
  const _fetch = fetch;
  fetch = async (resource, initOptions) => {
    const url =
      resource instanceof Request ? resource.url : resource.toString();
    const fetchedResponse = await _fetch(resource, initOptions);

    if (!isApplicableOnUrl(url)) {
      return fetchedResponse;
    }

    let method, requestHeaders, requestData;

    if (resource instanceof Request) {
      const request = resource.clone();
      method = request.method || "GET";
      requestHeaders =
        request.headers &&
        Array.from(request.headers).reduce((obj, [key, val]) => {
          obj[key] = val;
          return obj;
        }, {});
      requestData = await request.text();
    } else {
      method = initOptions.method || "GET";
      if (initOptions.headers instanceof Headers) {
        requestHeaders = Array.from(initOptions.headers).reduce(
          (obj, [key, val]) => {
            obj[key] = val;
            return obj;
          },
          {}
        );
      } else {
        requestHeaders = initOptions.headers;
      }
      requestData = initOptions.body;
    }

    const responseRule = getResponseRule(url);
    const customResponseText =
      responseRule.response.type === "code"
        ? responseRule.evaluator({
            method,
            url,
            requestHeaders,
            requestData,
            response: await fetchedResponse.text(),
          })
        : responseRule.response.value;

    notifyRuleApplied(responseRule);

    return new Response(new Blob([customResponseText]), {
      status: fetchedResponse.status,
      statusText: fetchedResponse.statusText,
      headers: fetchedResponse.headers,
    });
  };
};

(function () {
  if (!RQ.Utils.isHTMLDocument()) {
    return;
  }

  RQ.ScriptRuleHandler.setup();
  RQ.UserAgentRuleHandler.setup();
  RQ.ResponseRuleHandler.setup();
})();
