---
layout: post
title:  "Migrate your Android project to AndroidX"
date:   2019-08-18 15:07:19
excerpt: "Recently, Google has released AndroidX (in Jetpack libraries). Many of component in Android project has changed. So, below is steps by steps to help you convert your old project to AndroidX.
          The tutorial is following by this offical guide and add some my experiences."
categories: [tutorial, android]
comments: true
---
Recently, Google has released [AndroidX](https://developer.android.com/jetpack/androidx) (in Jetpack libraries). Many of component in Android project has changed. So, below is steps by steps to help you convert your old project to AndroidX.
The tutorial is following by this [offical guide](https://developer.android.com/jetpack/androidx/migrate) and add some my experiences.

1. From Android Studio 3.2 and above, you can select **Refactor > Migrate to AndroidX**. This will make some flags become true. You can check it from `gradle.properties` file:
    ```
    android.useAndroidX=true
    android.enableJetifier=true
    ```

2. Clean and Rebuild project
Build > Clean Project
Build > Rebuild Project

3. Check Build result in Build tab
If there are some error by wrong import Class, go to files then re-import Class

* Note: In some cases, if your project use some views as: DrawerLayout, Toolbar, there will occured some errors.
 I have tried to fix these errors by replacing like this:
    - androidx.core.widget.DrawerLayout -> androidx.drawerlayout.widget.DrawerLayout
    - android.support.v7.widget.Toolbar -> androidx.appcompat.widget.Toolbar
    
Happy coding!
