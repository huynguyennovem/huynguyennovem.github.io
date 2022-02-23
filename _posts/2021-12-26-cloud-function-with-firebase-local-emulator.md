---
layout: post
title:  "Hands-on Firebase Cloud Functions with Local Emulator"
date:   2021-12-26 18:00:00
excerpt: "Get familiar with Firebase Cloud Functions on Local Emulator"
categories: [tutorial, firebase]
comments: true
tags: [tutorial, firebase, cloud function]
---

### Overview
[Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) helps us to test cloud functions on local environment before deploying them into productions.
Currently it supports for Realtime Database, PubSub, Auth, and HTTP callable triggers.
<img src="/static/img/emulator_suite_block.png" width="60%" height="60%" />

- Setup:
    - Firebase CLI:
    
      `npm install -g firebase-tools`

    - Run emulator:
    
      `firebase init emulators`
    
      `firebase emulators:start`
    
      - Use `--only` flag to use particular service:
    
        `firebase emulators:start --only functions`

### Hands-on samples Cloud Functions with Local Emulator
- Resource: https://firebase.google.com/docs/functions/get-started

- Init a firebase project and functions:

1. `firebase login`
2. Go to your Firebase project directory.
3. `firebase init functions`
4. Select a language (I select JavaScript)

- Init firebase emulator:

1. `firebase init emulators`
2. Select `Function Emulator` option
3. Which port do you want to use for the functions emulator? (5001) `<Enter>`
4. Would you like to enable the Emulator UI? (Y/n) `<Enter>`
5.  Which port do you want to use for the Emulator UI (leave empty to use any available port)? `<Enter>`
6. Would you like to download the emulators now? (y/N) `<Enter>`
7. Start emulator with functions only: `firebase emulators:start --only functions`

The output will be like this:
```
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://localhost:4000                │
└─────────────────────────────────────────────────────────────┘

┌───────────┬────────────────┬─────────────────────────────────┐
│ Emulator  │ Host:Port      │ View in Emulator UI             │
├───────────┼────────────────┼─────────────────────────────────┤
│ Functions │ localhost:5001 │ http://localhost:4000/functions │
└───────────┴────────────────┴─────────────────────────────────┘
  Emulator Hub running at localhost:4400
  Other reserved ports: 4500
```

<img src="/static/img/firebase_local_emulator_ui.png" width="60%" height="60%" />


- Sample functions:

```javascript
exports.printRequestSample = functions.https.onRequest(async (request, response) => {
  functions.logger.info(request.body);
});
```

### Deploy functions
- Deploy all functions:
`firebase deploy --only functions`

- Deploy only a function:
`firebase deploy --only functions:<function_name>`

  Eg: `firebase deploy --only functions:printRequestSample`


### Troubleshots:
1. It looks like you're trying to access functions.config().firebase but there is no value there. You can learn more about setting up config here: https://firebase.google.com/docs/functions/local-emulator

