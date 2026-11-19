---
title: "Setting up RevenueCat in-app purchases for iOS and Android"
seoTitle: "Setting up RevenueCat in-app purchases for iOS and Android"
datePublished: Thu Nov 19 2026 00:00:00 GMT+0000 (Coordinated Universal Time)
slug: setting-up-revenuecat-in-app-purchases-for-ios-and-android
tags: revenuecat, in-app-purchase, ios, android, monetization

---

Adding in-app purchases to an app sounds like a coding task, but most of the work happens outside the codebase. You have to connect RevenueCat to Google Play and App Store Connect, create the products in each store, map them to entitlements and offerings, and get a sandbox account working on a real device.

This post is the checklist I follow every time I add RevenueCat to one of my apps. The most common case for me is a single **"Remove ads"** purchase, but the same steps work for subscriptions.

## 1. Create the project and apps in RevenueCat

In the RevenueCat dashboard, create a new project. Then go to **Apps** and add the **Android** and **iOS** apps **separately**. Each platform has its own store credentials and its own public SDK API key.

## 2. Connect Google Play

Go to **Apps & providers** > **New Play Store configuration**. RevenueCat needs a service account JSON key, which you create on Google Cloud.

### Create the service account on GCP

- In your GCP project, enable these APIs:
    - `Google Play Android Developer API`
    - `Google Play Developer Reporting API`
- Create a service account and grant it these roles:
    - `Pub/Sub Admin` (the docs list `Pub/Sub Editor`; Admin is the fallback if creating the Pub/Sub topic fails)
    - `Monitoring Viewer`
    - I also added `Service Account Token Creator`
- In the service account's **Principals with access**, add the Google account you use for Google Play Console.
- Open the **Keys** tab > **Add key** > **Create new key** > JSON. Download the file and copy the `client_email` value from it.

### Invite the service account in Play Console

Open Google Play Console > **Users and permissions** > **Invite new user**, paste the `client_email`, and grant these permissions:

- `View app information and download bulk reports (read-only)`
- `View financial data, orders, and cancellation survey responses`
- `Manage orders and subscriptions`
- `Manage store presence`

`Manage store presence` is what lets RevenueCat import your products from Play Console later, so don't skip it.

### Upload the JSON key to RevenueCat

Back in the RevenueCat dashboard, upload the JSON file to the Play Store configuration.

**Don't panic if RevenueCat shows "Invalid Play Store credentials" right away.** New Google credentials can take up to 36 hours to become valid. Usually it is less than a day.

Reference: [Creating Play Service Credentials](https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials)

## 3. Connect the App Store

Go to App Store Connect > [Users and Access > Integrations](https://appstoreconnect.apple.com/access/integrations/api) and create two keys:

- **In-App Purchase key** (file name `SubscriptionKey_XXXXXXXXXX.p8`)
- **App Store Connect API key** with at least the **App Manager** role (file name `AuthKey_XXXXXXXXXX.p8`)

Both `.p8` files can only be downloaded **once**, so keep them somewhere safe.

Back in RevenueCat, open your iOS app and upload each key into its own field:

- The In-App Purchase key goes into the **In-App Purchase Key** field.
- The App Store Connect API key goes into the **App Store Connect API** tab, together with the **Issuer ID** (shown above the keys table) and your **Vendor number** (under *Payments and Financial Reports*).

Keep Apple's original file names. RevenueCat reads the Key ID from the file name.

Reference: [App Store Connect API Key Configuration](https://www.revenuecat.com/docs/service-credentials/itunesconnect-app-specific-shared-secret/app-store-connect-api-key-configuration)

## 4. Create the IAP products in each store

Create the products in **Google Play Console** and in **App Store Connect**. Pick the product type based on what you sell:

- **Remove ads** or any one-time unlock: a **non-consumable** product.
- Monthly or yearly access: **auto-renewable subscriptions**.

Use the **same product identifier** on both stores. It keeps things clean when they land in RevenueCat.

Then in RevenueCat, go to **Product catalog** > **Products** and **Import** the products from each store. They should sync with the same names you just created.

## 5. Wire up entitlements and offerings

An **entitlement** is what the user unlocks (for example `remove_ads` or `pro`). An **offering** is what you show on the paywall.

- Go to **Entitlements**, open your entitlement, and attach the products from both stores.
- Go to **Offerings** > `default` and edit its packages:
    - For a non-consumable product, attach it to the **Lifetime** package.
    - For subscriptions, attach them to the matching **Monthly** / **Yearly** packages.

In the app, you only check whether the entitlement is active. You never hard-code product IDs per platform.

## 6. Test on real devices

### iOS

1. Go to [App Store Connect > Sandbox](https://appstoreconnect.apple.com/access/users/sandbox) and add a sandbox tester email.
2. On the test device, enable **Developer Mode**. Then open the **Settings** app, search for "Sandbox", and sign in with the sandbox account from step 1.
3. Install the build with IAP integrated and buy the product. You won't be charged.

### Android

1. In Google Play Console, go to **Testers** and create a tester group. Add the Google account that is signed in to the Play Store app on your test device.
2. Build a version with IAP integrated and upload it to **Internal testing**.
3. Copy the internal testing link and open it on the test device to opt in and install the app.

## Troubleshooting

### App Store product shows "Missing Metadata" in RevenueCat

In the RevenueCat **Products** page, the App Store product status shows **"Missing Metadata"**.

Fix: in App Store Connect, open the in-app purchase and fill out the **Review Information** section (screenshot and review notes). While you're there, make sure the price, localization, and availability are set too.

### "Invalid Play Store credentials"

See the note in step 2. If it still fails after 36 hours, check that the four Play Console permissions are granted and that both GCP APIs are enabled.

That's all! Happy monetizing!
