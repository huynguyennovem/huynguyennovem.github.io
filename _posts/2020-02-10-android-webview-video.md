---
layout: post
title:  "Android Webview Video"
date:   2020-02-10 12:16:00
excerpt: "BottomNavigationView with material support."
categories: [tutorial, android]
comments: true
tags: [tutorial, android, view]
---
### Introduction
- Play html5 video webview
- Handle fullscreen button in video


### Demo
[Android Webview Video](https://youtu.be/LCoYWBr2pV8)

### Contribution
Contributions are welcome. Feel free to submit a pull request to contribute to this project.

### Implementation

1. Add permission to Manifest

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```
<br/>
2. Update MainActivity

```java
public class MainActivity extends AppCompatActivity {

    private FrameLayout mWebFullTargetView;
    private FrameLayout mContentWebView;
    private WebChromeClient.CustomViewCallback mCustomViewCallback;
    private View mCustomView;
    private MyChromeClient mClient;

    private WebView webview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initWebview();
    }

    private void initWebview() {
        webview = findViewById(R.id.webview_media);
        mWebFullTargetView = findViewById(R.id.web_full_target_view);
        mContentWebView = findViewById(R.id.main_content_webview);
        String url = "https://s3.eu-central-1.amazonaws.com/pipe.public.content/short.mp4";
        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setAppCacheEnabled(true);
        webview.getSettings().setAllowFileAccess(true);

        mClient = new MyChromeClient();
        webview.setWebChromeClient(mClient);
        webview.loadUrl(url);
    }


    class MyChromeClient extends WebChromeClient {

        @Override
        public void onShowCustomView(View view, CustomViewCallback callback) {
            mCustomViewCallback = callback;
            mWebFullTargetView.addView(view);
            mCustomView = view;
            mContentWebView.setVisibility(View.GONE);
            mWebFullTargetView.setVisibility(View.VISIBLE);
            mWebFullTargetView.bringToFront();
        }

        @Override
        public void onHideCustomView() {
            if (mCustomView == null)
                return;
            mCustomView.setVisibility(View.GONE);
            mWebFullTargetView.removeView(mCustomView);
            mCustomView = null;
            mWebFullTargetView.setVisibility(View.GONE);
            mCustomViewCallback.onCustomViewHidden();
            mContentWebView.setVisibility(View.VISIBLE);

        }
    }

}
```
<br/>

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <!--Webview-->
    <FrameLayout
        android:id="@+id/main_content_webview"
        android:layout_width="match_parent"
        android:layout_height="300dp" >

        <WebView
            android:id="@+id/webview_media"
            android:layout_width="match_parent"
            android:layout_height="match_parent"/>

    </FrameLayout>

    <FrameLayout
        android:id="@+id/web_full_target_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:visibility="gone"
        android:background="#121212"/>

</FrameLayout>
```
<br/>
3. Optional

In case you want landscape video when click on fullscreen button:
```java
class MyChromeClient extends WebChromeClient {

        @Override
        public void onShowCustomView(View view, CustomViewCallback callback) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            //...
        }

        @Override
        public void onHideCustomView() {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            //...

        }
    }
```

Update AndroidManifest.xml's configChanges:
```xml
<activity android:name=".MainActivity"
    android:hardwareAccelerated="true"
    android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|uiMode|screenSize|smallestScreenSize">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

You can checkout full code from [here](https://github.com/huynguyennovem/Android-Webview-Video-Play)


Happy coding!
