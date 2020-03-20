import React from "react"

// Improved Analytics JS loader
// See https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/19/files

exports.onRenderBody = ({ setPostBodyComponents }, pluginOptions) => {
  const { pixelId, delayLoad, delayLoadTime } = pluginOptions

  if (process.env.NODE_ENV === `production` && pixelId) {

    const snippet = `
      !function(){
        var gatsbyFbPxLoad = window.gatsbyFbPxLoad = function() {
          var fbLoader = function(f,b,e,v,n,t,s){
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
            fbq('init', '${pixelId}'); // Insert your pixel ID here.
            fbq('track', 'PageView');
          };
          fbLoader(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
        };
        ${!delayLoad ? `gatsbyFbPxLoad();` : ``}
      }();
    `

    const delayedLoader = `
      window.fbPxSnippetLoaded = false;
      window.fbPxSnippetLoading = false;
      window.fbPxSnippetLoader = function (callback) {
        if (!window.fbPxSnippetLoaded && !window.fbPxSnippetLoading) {
          window.fbPxSnippetLoading = true;
          function loader() {
            window.gatsbyFbPxLoad();
            window.fbPxSnippetLoading = false;
            window.fbPxSnippetLoaded = true;
            if(callback) {callback()}
          };
          setTimeout(
            function () {
              "requestIdleCallback" in window
                ? requestIdleCallback(function () {loader()})
                : loader();
            },
            ${delayLoadTime} || 1000
          );
        }
      }
      window.addEventListener('scroll',function () {window.fbPxSnippetLoader()}, { once: true });
    `

    // if delayLoad option is true, use the delayed loader
    const snippetToUse = `
    ${delayLoad ? delayedLoader : ""}
    ${snippet}
  `

    return setPostBodyComponents([
      <script
        key={`gatsby-plugin-facebook-pixel`}
        dangerouslySetInnerHTML={{ __html: snippetToUse }}
      />,
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>,
    ])
  }
}
