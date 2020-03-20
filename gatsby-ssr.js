"use strict";

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Improved Analytics JS loader
// See https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/19/files
exports.onRenderBody = function (_ref, pluginOptions) {
  var setPostBodyComponents = _ref.setPostBodyComponents;
  var pixelId = pluginOptions.pixelId,
      delayLoad = pluginOptions.delayLoad,
      delayLoadTime = pluginOptions.delayLoadTime;

  if (process.env.NODE_ENV === "production" && pixelId) {
    var snippet = "\n      !function(){\n        var gatsbyFbPxLoad = window.gatsbyFbPxLoad = function() {\n          var fbLoader = function(f,b,e,v,n,t,s){\n            if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n            n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n            n.queue=[];t=b.createElement(e);t.async=!0;\n            t.src=v;s=b.getElementsByTagName(e)[0];\n            s.parentNode.insertBefore(t,s)\n            fbq('init', '".concat(pixelId, "'); // Insert your pixel ID here.\n            fbq('track', 'PageView');\n          };\n          fbLoader(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')\n        };\n        ").concat(!delayLoad ? "gatsbyFbPxLoad();" : "", "\n      }();\n    ");
    var delayedLoader = "\n      window.fbPxSnippetLoaded = false;\n      window.fbPxSnippetLoading = false;\n      window.fbPxSnippetLoader = function (callback) {\n        if (!window.fbPxSnippetLoaded && !window.fbPxSnippetLoading) {\n          window.fbPxSnippetLoading = true;\n          function loader() {\n            window.gatsbyFbPxLoad();\n            window.fbPxSnippetLoading = false;\n            window.fbPxSnippetLoaded = true;\n            if(callback) {callback()}\n          };\n          setTimeout(\n            function () {\n              \"requestIdleCallback\" in window\n                ? requestIdleCallback(function () {loader()})\n                : loader();\n            },\n            ".concat(delayLoadTime, " || 1000\n          );\n        }\n      }\n      window.addEventListener('scroll',function () {window.fbPxSnippetLoader()}, { once: true });\n    "); // if delayLoad option is true, use the delayed loader

    var snippetToUse = "\n    ".concat(delayLoad ? delayedLoader : "", "\n    ").concat(snippet, "\n  ");
    return setPostBodyComponents([_react.default.createElement("script", {
      key: "gatsby-plugin-facebook-pixel",
      dangerouslySetInnerHTML: {
        __html: snippetToUse
      }
    }), _react.default.createElement("noscript", null, _react.default.createElement("img", {
      height: "1",
      width: "1",
      style: {
        display: "none"
      },
      src: "https://www.facebook.com/tr?id=".concat(pixelId, "&ev=PageView&noscript=1")
    }))]);
  }
};
