exports.onRouteUpdate = function({ prevLocation }, { trackViewContent }) {

  function trackSegmentPage() {
    // Don't track while developing.
    if (process.env.NODE_ENV === `production` && typeof fbq === `function` && trackViewContent !== false) {
      fbq('track', 'ViewContent');
    }
  }

  // If this is a second page loaded via Gatsby routing, and the delayed loader has
  // not been loaded yet, we want to load it and then track the page.
  if (prevLocation && window.segmentSnippetLoaded === false) {
    window.segmentSnippetLoader(() => {
      trackSegmentPage();
    });
  } else {
    trackSegmentPage();
  }
};
