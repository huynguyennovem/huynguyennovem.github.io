---
title: "Publishing your Flutter iOS app to the App Store with ASC CLI"
seoTitle: "Publishing your Flutter iOS app to the App Store with ASC CLI"
datePublished: Thu Apr 16 2026 00:00:00 GMT+0000 (Coordinated Universal Time)
slug: publishing-your-flutter-ios-app-to-the-app-store-with-asc-cli
tags: flutter, ios, appstore, cli, publishing

---

Publishing an iOS build from Flutter can be quick when you use ASC CLI.

This short tutorial shows the flow I usually follow to upload a new iOS build to App Store Connect.
I have been using this flow while building and shipping [**CompactKit**](https://compactkit.cc/).

## 1. Build the IPA from your Flutter project

```sh
flutter build ipa
```

After the build finishes, your IPA should be at:

`build/ios/ipa/<app-name>.ipa`

## 2. Install ASC CLI

Go to the GH page: [App-Store-Connect-CLI](https://github.com/rudrankriyam/App-Store-Connect-CLI), then follow the **Install** section.

Once ASC is installed and authenticated on your machine, you can publish directly from terminal.

## 3. Get your app ID

```sh
asc apps
```

Find your app in the list and copy its app ID.

## 4. Publish to App Store Connect

```sh
asc publish appstore --app <app-id> --ipa <path-to-ipa-file>
```

![ASC CLI upload finished](../img/posts/asc%20cli%20finish.png)

When the upload completes, open [App Store Connect](https://appstoreconnect.apple.com/) and navigate to your app.

You should see a new version created automatically and attached to the uploaded build:

![New version in App Store Connect](../img/posts/appstore%20new%20version.png)

Then fill in **What's New** and submit for review:

![Fill in What's New before submitting](../img/posts/what%20news.png)

## Built from real experience: CompactKit

I wrote this guide from my own release workflow while building **CompactKit**.
If you want to see a real app shipped, check it out here 👉 [compactkit.cc](https://compactkit.cc/)

That's all! Happy publishing!
