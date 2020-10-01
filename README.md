# gatsby-plugin-facebook-pixel

Easily add Facebook Pixel to your Gatsby site. At this time, 'ViewContent' event is triggered via onRouteUpdate.

## Install

`npm install --save gatsby-plugin-facebook-pixel`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-plugin-facebook-pixel`,
    options: {
      pixelId: "pixel id here",
    },
  },
];
```
