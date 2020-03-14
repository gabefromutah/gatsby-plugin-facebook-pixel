# gatsby-plugin-facebook-pixel

Easily add Facebook Pixel to your Gatsby site. At this time, 'ViewContent' event is triggered via onRouteUpdate.

FORK dif:
* Uses `setPostBodyComponents` instead of `setHeadComponents`
* Added missing `<noscript>` tag
* Improve TTI by loading after scroll: https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/19

## Install
`npm install --save bre7/gatsby-plugin-facebook-pixel`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-plugin-facebook-pixel`,
    options: {
      pixelId: 'pixel id here',
      
      // skip track ViewContent on route update
      trackViewContent: false,
      
      // whether JS should be loaded after user scroll  
      delayLoad: false,

      // time to wait after scroll action in ms. Defaults to 1000ms
      delayLoadTime: 1000
    },
  },
]
```
