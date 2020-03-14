"use strict";

exports.onRouteUpdate = function (_ref, _ref2) {
  var prevLocation = _ref.prevLocation;
  var trackViewContent = _ref2.trackViewContent;

  function trackSegmentPage() {
    // Don't track while developing.
    if (process.env.NODE_ENV === "production" && typeof fbq === "function" && trackViewContent !== false) {
      fbq('track', 'ViewContent');
    }
  } // If this is a second page loaded via Gatsby routing, and the delayed loader has
  // not been loaded yet, we want to load it and then track the page.


  if (prevLocation && window.segmentSnippetLoaded === false) {
    window.segmentSnippetLoader(function () {
      trackSegmentPage();
    });
  } else {
    trackSegmentPage();
  }
};