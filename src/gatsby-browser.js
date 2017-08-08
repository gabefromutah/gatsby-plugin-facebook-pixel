exports.onRouteUpdate = function({ location }, pluginOptions) {
  // Don't track while developing.
  if (process.env.NODE_ENV === `production` && typeof fbq === `function` && pluginOptions.trackViewContent !== false) {
    fbq('track', 'ViewContent');
  }
};
