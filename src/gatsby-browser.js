exports.onRouteUpdate = () => {
  // Don't track while developing.
  if (process.env.NODE_ENV === `production` && typeof fbq === `function`) {
    fbq('track', 'ViewContent');
  }
};
