---
layout: post
title:  "Hands-on Firebase Cloud Functions with Local Emulator"
date:   2021-12-26 18:00:00
excerpt: "Get familiar with Firebase Cloud Functions on Local Emulator"
categories: [tutorial, firebase, cloud function]
comments: true
tags: [tutorial, firebase, cloud function]
---

### Overview
[Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) helps us to test cloud functions on local environment before deploying them into productions.
Currently it supports for Realtime Database, PubSub, Auth, and HTTP callable triggers.
<img src="/static/img/emulator_suite_block.png" width="60%" height="60%" />

- Setup:
    - Firebase CLI:
    > npm install -g firebase-tools

    Dependencies:
        - firebase-admin version 8.0.0 or higher.
        - firebase-functions version 3.0.0 or higher.

    - Run emulator:
    > firebase emulators:start
    
    Use `--only` flag to use particular service:
    > firebase emulators:start --only functions

### Hands-on samples
- Resource: https://firebase.google.com/docs/functions/get-started

- Init a project:

1. `firebase login`
2. Go to your Firebase project directory.
3. `firebase init functions`
4. Select JavaScript


- Add data:
    - From root of project: 
    > cd functions
    
    - Insert data:
    > firebase functions:config:set animal.foot="dog" 

    or json format:
    
    > firebase functions:config:set foo='{"bar":"something","faz":"other"}'

    - Update:
    > firebase functions:config:get > .runtimeconfig.json
    
    - Result:
    {
      "animal": {
        "foot": "dog"
      },
      "foo": {
        "dog": "abjcnkasmds",
        "bar2": "abcdef",
        "bar": "something",
        "faz": "other"
      }
    }



### Troubleshots:
1. It looks like you're trying to access functions.config().firebase but there is no value there. You can learn more about setting up config here: https://firebase.google.com/docs/functions/local-emulator


**(To be continued)**