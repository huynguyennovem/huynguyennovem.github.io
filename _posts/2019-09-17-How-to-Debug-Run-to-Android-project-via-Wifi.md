---
layout: post
title:  "How to Debug/Run Android project via Wifi"
date:   2019-09-17 10:30:00
excerpt: "This tutorial will show you how to Debug/Run Android Project via Wifi (without usb cable)"
categories: [tutorial, android, debugging]
comments: true
tags: [tutorial, android, debugging]
---
This tutorial will show you how to Debug/Run Android Project via Wifi (without usb cable)

1. _Solution 1 (create bashshell script by manual):_ 

    Follow these steps: 
    - Step 1: Find device IP address: On your phone, go to Settings > About phone > Status > IP address
        - For eg: 192.168.86.20 
        
    - Step 2: Make sure two things:
        - Your device and your computer are both connected to same wifi router.
        - Connect your device to computer by cable (just use as a bait)
    - Step 3: Create new file "debug_android_script.sh" with content:
        ```shell script
        adb shell setprop service.adb.tcp.port 5555
        adb tcpip 5555
        adb connect 192.168.86.20:5555
        ``` 
        This script will open new port as `5555` and connect to your device with that port.
    
    - Step 4: Run the bash script and check by run a project:
    <img src="/static/img/connect_adb_wifi.png" width="20%" height="20%" />
    
    Now you can reject the cable from computer and Run/Debug application as normal.

2. _Solution 2 (use Android Studio plugin):_

    Android Studio supports a plugin for this. It helps you to open a port (you don't need to create a bashshell)
    - Step 1: In the Android Studio, go to File > Settings > Plugins
    - Step 2: Find `Android Wifi ADB` in search box. Install then Restart IDE.
    - Step 3: After restarted, open tab `Android Wifi ADB`, make sure your device connect to your computer by cable (just use as a bait)
    - Step 4: Press **Connect**. Check by run a project.

#### Troubleshooting:
Sometime, the device will be `OFFLINE`. This is the trick to re-active device:
```shell script
adb kill-server
adb start-server
```
Besides, you can use `adb devices` to check list device while doing these steps.
Because of **adb** process may be need a time to start/stop, you can try above command several times.


Happy Debugging!
