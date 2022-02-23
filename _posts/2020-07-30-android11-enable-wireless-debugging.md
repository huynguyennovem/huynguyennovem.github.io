---
layout: post
title:  "Android 11 - Enable wireless debugging"
date:   2020-07-30 14:30:00
excerpt: "This tutorial will guide you how to enable wireless debugging on Android 11"
categories: [tutorial, android]
comments: true
image:
    feature: https://huynguyennovem.github.io/static/img/wireless-debugging.png
tags: [android 11, tutorial, android, debugging, wireless, tool]
---
Debugging is simpler with wireless debugging over ADB with Android 11 devices. Follow below steps to enable this interesting feature:

- Step 1: Update the SDK Platform-Tools version (at least v30.0.0)

    <img src="https://huynguyennovem.github.io/static/img/platform-tools-v30.png" style="width:550px;height:200px;" />
    
    - Go to [Platform-tools](https://developer.android.com/studio/releases/platform-tools)
    - Select the SDK Platform-Tools corresponding to your OS

- Step 2: Connect your device/phone Wifi to the same Wifi with your PC/Laptop

- Step 3: Enable Wireless debugging on the device

    <img src="https://huynguyennovem.github.io/static/img/device-2020-07-30-141931.png" width="200" height="400" />
    
    - Open Settings, do search with "Wireless debugging"
    - Enable Wireless debugging
- Step 4: Select "Pair device with pairing code"

    <img src="https://huynguyennovem.github.io/static/img/device-2020-07-30-143116.png" width="200" height="400" />
    
    For eg your IP:PORT is: `192.168.10.1:12345` and Pairing code is: `701434`
- Step 5: Pair device
    - Open your terminal/bash shell
    - Cd to Platform-Tools Folder (in Android SDK directory) (Note: This step can be ignore if you have already configured **adb** environment)
    ```
        C:\Users\huynq>cd E:\AndroidSDK\platform-tools
    ```
    - Enter pair command:
    ```
        adb pair 192.168.10.1:12345
    ```
    - Enter pairing code: 
    ```
        701434
    ```
    It should show "Successfully paired to..."

- Step 6: Connect to the paired device
    
    After paired device, **the port has been changed**:
    
    For eg: `192.168.10.1:54321`
    
    <img src="https://huynguyennovem.github.io/static/img/device-2020-07-30-144600.png" width="200" height="400" />

    - Enter connect command:
    ```
        adb connect 192.168.10.1:54321
    ```
    
    You would see "Connected to..."

- Step 7: Return to your Android Studio to check connected device in toolbar

- (Optional) Step 8: To keep alive adb connection (sometime it may be disconnect):

    From terminal:

    ```
    adb shell ping -i 2 127.0.0.1
    ```

#### That's all steps for this. Happy debugging!
