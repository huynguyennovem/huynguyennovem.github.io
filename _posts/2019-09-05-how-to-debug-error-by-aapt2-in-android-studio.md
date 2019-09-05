---
layout: post
title:  "How to debug error by AAPT2 in Android Studio"
date:   2019-09-05 09:30:00
categories: [tutorial, android, debug]
comments: true
---
[AAPT2](https://developer.android.com/studio/command-line/aapt2) (Android Asset Packaging Tool)  is a build tool that Android Studio and Android Gradle Plugin use to compile and package your app’s resources.
Sometime, you may got some errors like this:
```
com.android.build.gradle.tasks.ResourceException: Error: java.util.concurrent.ExecutionException: com.android.builder.internal.aapt.v2.Aapt2Exception: AAPT2 error: check logs for details
```
The simple solution:
- Step 1: Open **Gradle** tab, select `app > build > assembleDebug` (double click to assembleDebug for executing)

![Debug AAPT2](/static/img/debug_aapt2_android_studio.png)


- Step 2: Resolve all errors which appeared in **Run** tab until I see the `BUILD SUCCESSFUL` status.
Then try step 1 again.

Happy debugging!
