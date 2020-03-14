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
    var snippet = "\n      !function(){\n        var gatsby_fb_px_load = window.gatsby_fb_px_load = function() {\n          var fb_loader = function(f,b,e,v,n,t,s){\n            if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n            n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n            n.queue=[];t=b.createElement(e);t.async=!0;\n            t.src=v;s=b.getElementsByTagName(e)[0];\n            s.parentNode.insertBefore(t,s)\n          };\n          fb_loader(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')\n        };\n        ".concat(!delayLoad ? "gatsby_fb_px_load();" : "", "\n      }();\n    ");
    var delayedLoader = "\n      window.segmentSnippetLoaded = false;\n      window.segmentSnippetLoading = false;\n      window.segmentSnippetLoader = function (callback) {\n        if (!window.segmentSnippetLoaded && !window.segmentSnippetLoading) {\n          window.segmentSnippetLoading = true;\n          function loader() {\n            window.gatsby_fb_px_load();\n            window.segmentSnippetLoading = false;\n            window.segmentSnippetLoaded = true;\n            if(callback) {callback()}\n          };\n          setTimeout(\n            function () {\n              \"requestIdleCallback\" in window\n                ? requestIdleCallback(function () {loader()})\n                : loader();\n            },\n            ".concat(delayLoadTime, " || 1000\n          );\n        }\n      }\n      window.addEventListener('scroll',function () {window.segmentSnippetLoader()}, { once: true });\n    "); // if delayLoad option is true, use the delayed loader

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