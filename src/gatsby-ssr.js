import React from "react"

// Improved Analytics JS loader
// See https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/19/files

exports.onRenderBody = ({ setPostBodyComponents }, pluginOptions) => {
  const { pixelId, delayLoad, delayLoadTime } = pluginOptions

  if (process.env.NODE_ENV === `production` && pixelId) {

    const snippet = `
      !function(){
        var gatsby_fb_px_load = window.gatsby_fb_px_load = function() {
          var fb_loader = function(f,b,e,v,n,t,s){
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
          };
          fb_loader(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
        };
        ${!delayLoad ? `gatsby_fb_px_load();` : ``}
      }();
    `

    const delayedLoader = `
      window.segmentSnippetLoaded = false;
      window.segmentSnippetLoading = false;
      window.segmentSnippetLoader = function (callback) {
        if (!window.segmentSnippetLoaded && !window.segmentSnippetLoading) {
          window.segmentSnippetLoading = true;
          function loader() {
            window.gatsby_fb_px_load();
            window.segmentSnippetLoading = false;
            window.segmentSnippetLoaded = true;
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
      window.addEventListener('scroll',function () {window.segmentSnippetLoader()}, { once: true });
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
