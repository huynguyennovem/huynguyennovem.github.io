---
layout: post
title:  "Things you should to when upgrading to new Flutter SDK"
date:   2022-02-21 10:00:00
excerpt: "Things you should to when upgrading to new Flutter SDK"
categories: [flutter]
comments: true
tags: [flutter]
---

- Scenario: Upgrading from Flutter 2.8 into 2.10
- Environment: Macbook M1 Big Sur

- Step by step:

**1. Flutter Upgrade**
  - Do command `flutter upgrade` from your terminal
  - After the process is finished, check version with `flutter --version`:
    ```
    Flutter 2.10.2 • channel stable • https://github.com/flutter/flutter.git
    Framework • revision 097d3313d8 (3 days ago) • 2022-02-18 19:33:08 -0600
    Engine • revision a83ed0e5e3
    Tools • Dart 2.16.1 • DevTools 2.9.2
    ```
**2. Upgrade dependences**

  Some dependences may need to upgrade in order to be compatible with new SDK

  - Do command `flutter pub upgrade` from your terminal:
  ```
  Resolving dependencies...
    _fe_analyzer_shared 22.0.0 (34.0.0 available)
    analyzer 1.7.2 (3.2.0 available)
  > archive 3.2.1 (was 3.1.6)
    args 2.3.0
    async 2.8.2
    auto_size_text 3.0.0
  > badges 2.0.2 (was 2.0.1)
    bloc 7.2.1 (8.0.2 available)
  > bloc_test 8.5.0 (was 8.3.0) (9.0.2 available)
  ...
  ```

  Note: After did this step, you may not run the app because some dependences version may not supported yet. This tutorial may help you: [Understand caret syntax (^) in pubspec.yaml](https://huynguyennovem.github.io/articles/2022-02/2022-02-22-flutter-understand-caret-sign-in-pubspec)


**3. Clean and pub get**

  Clean the cache and re-fetch all things again
  - Do command `flutter clean` and `flutter pub get` from your terminal

**4. Handle error on iOS**
  
  Android may fine (It depends on your project), but iOS does not. 

  - Firebase Messaging:
  ```
    [!] CocoaPods could not find compatible versions for pod "Firebase/Messaging":
    In snapshot (Podfile.lock):
      Firebase/Messaging (= 8.8.0)

    In Podfile:
      firebase_messaging (from `.symlinks/plugins/firebase_messaging/ios`) was resolved to 10.0.9, which depends on
        Firebase/Messaging (= 8.11.0)

    Specs satisfying the `Firebase/Messaging (= 8.8.0), Firebase/Messaging (= 8.11.0)` dependency were found, but they required a higher minimum deployment target.
  ```

  You may try with `pod install` or `pod repo update` inside `ios` directory. 
  If it's succeed, congrat you. If not, try this:
    
  - Delete ios/Podfile.lock
  - In Termial:
      ```
      cd ios
      pod install
      ```
  
  In my case, with Mac M1 chip, these commands did not work. So, this is what I tried to:
    
  - Open Terminal in Rosetta (Guideline: https://www.courier.com/blog/tips-and-tricks-to-setup-your-apple-m1-for-development/)
  - In Rosetta Termial:
      ```
      cd ios
      pod install
      ```



**Happy coding!**