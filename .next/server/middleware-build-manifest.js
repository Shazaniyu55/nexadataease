self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/training": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/training.js"
    ],
    "/training/courses": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/training/courses.js"
    ],
    "/training/courses/[id]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/training/courses/[id].js"
    ],
    "/training/instructor/dashboard": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/training/instructor/dashboard.js"
    ],
    "/training/login": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/training/login.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];