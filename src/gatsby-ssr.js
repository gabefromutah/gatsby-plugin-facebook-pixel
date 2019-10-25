import React from 'react';

const isDefined = val => {
  return typeof val !== 'undefined' && val !== null;
};

exports.onRenderBody = ({ reporter, setHeadComponents }, pluginOptions = {}) => {
  if (process.env.NODE_ENV === `production`) {
    if(!isDefined(pluginOptions.pixelId)) {
      reporter.warn(`No pixelId provided to gatsby-plugin-facebook-pixel`);
      return null
    }

    setHeadComponents([
      <script
        key={`gatsby-plugin-facebook-pixel`}
        dangerouslySetInnerHTML={{
          __html: `
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${pluginOptions.pixelId}');
  fbq('track', 'PageView');
      `,
        }}
      />,
    ]);
  }
};
