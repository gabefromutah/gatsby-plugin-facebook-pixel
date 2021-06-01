exports.onRouteUpdate = function ({ location }, pluginOptions) {
  const { enable } = pluginOptions || {};
  // Don't track while developing.
  if (enable && typeof fbq === `function`) {
    fbq("track", "ViewContent");
  }
};
