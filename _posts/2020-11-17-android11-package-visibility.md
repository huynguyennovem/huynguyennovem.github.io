---
layout: post
title:  "Android 11 package visibility"
date:   2020-11-17
excerpt: "This tutorial will guide you how to adapt changes with package visibility in Android 11"
categories: [tutorial, android, android-11]
comments: true
tags: [tutorial, android, android-11]
---

- Scenario: Your app is targeting to Android 11, you want to query/interact with other apps (for eg: get data return, bind a service..). By default your app will return `NameNotFoundException` - regardless of whether the target app is installed. 

- How to configure:
Add the <queries> element in your app's manifest file. Within the <queries> element, you can specify packages by name, by intent signature, or by provider authority.

+ Step 1: Set `targetSdkVersion` to 30

+ Step 2: Add `<queries>` tag to `AndroidManifest.xml`

    In this example, I will open Google Map app:
    ```xml
    <queries>
        <package android:name="com.google.android.apps.maps" />
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:mimeType="text/plain" />
        </intent>
    </queries>
    ```

    You may build fail after adding this due to your Gradle version does not support new tag `queries` (`Manifest merger failed with multiple errors, see logs`). 
    So, make sure already upgraded `Android Gradle plugin` to 4.1+:

    ```
    dependencies {
        ...
        classpath 'com.android.tools.build:gradle:4.1.1'
        ...
    }
    ```

    Let's try to build again.


+ Step 3: Handle open app in the code:

    ```java
    Uri gmmIntentUri = Uri.parse("google.navigation:q=Taronga+Zoo,+Sydney+Australia&mode=b");
    Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
    mapIntent.setPackage("com.google.android.apps.maps");
    if (intent.resolveActivity(Objects.requireNonNull(getActivity()).getPackageManager()) != null) {
        startActivity(intent);
    }
    ```

#### Happy coding!
