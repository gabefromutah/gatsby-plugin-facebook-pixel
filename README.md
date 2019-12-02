# gatsby-plugin-facebook-pixel

Easily add Facebook Pixel to your Gatsby site. At this time, 'ViewContent' event is triggered via onRouteUpdate.

FORK dif:
* Uses `setPostBodyComponents` instead of `setHeadComponents`
* Added missing `<noscript>` tag

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
      trackViewContent: false, // skip track ViewContent on route update
    },
  },
]
```
