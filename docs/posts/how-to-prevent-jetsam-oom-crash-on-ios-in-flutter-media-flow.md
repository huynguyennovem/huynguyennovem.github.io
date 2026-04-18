---
title: "How to prevent Jetsam/OOM crashes on iOS in Flutter media flows"
seoTitle: "How to prevent Jetsam/OOM crashes on iOS in Flutter media flows"
datePublished: Sat Apr 18 2026 00:00:00 GMT+0000 (Coordinated Universal Time)
slug: how-to-prevent-jetsam-oom-crash-on-ios-in-flutter-media-flow
tags: flutter, ios, crashlytics, memory, performance

---

I recently got an App Store rejection because the reviewer could reproduce a fatal crash during a camera/media flow.

The confusing part: I could not reproduce it locally in Debug or Release (from Flutter tool and from Xcode).

Then I checked Firebase Crashlytics and saw a crash report with a stack trace that looked unrelated to my app logic (mostly `UIAccessibility` frames). At first glance, it did not look like a normal Dart exception.

After correlating Crashlytics with Firebase Analytics breadcrumbs, I could reconstruct the exact reviewer flow.

Here is the truncated stacktrace in Firebase Crashlytics:

```sh
Crashed: com.apple.main-thread
0  Flutter                        0x43a13c _$LT$core..char..ToLowercase$u20$as$u20$core..iter..traits..double_ended..DoubleEndedIterator$GT$::next_back::h8e46a25d72ae0e8d + 354584
1  UIAccessibility                0x7838 -[NSObject(AXPrivCategory) _accessibilityContainingParentForOrdering] + 200
2  UIAccessibility                0x76c4 _scrollParentForComparingGeometryOfView + 148
3  UIAccessibility                0x5888 -[NSObject _accessibilityCompareGeometry:] + 852
4  UIAccessibility                0x5510 -[NSObject(AXPrivCategory) accessibilityCompareGeometry:] + 52
5  CoreFoundation                 0x24c8c __CFSimpleMergeSort + 100
6  CoreFoundation                 0x24ab4 CFSortIndexes + 260
7  CoreFoundation                 0x26900 -[NSMutableArray sortRange:options:usingComparator:] + 448
8  CoreFoundation                 0xc70d4 -[NSMutableArray sortUsingSelector:] + 176
9  UIKit                          0x16a1e4 -[UIViewAccessibility _accessibilityUserTestingSubviewsSorted:] + 332
10 UIKit                          0x16a068 -[UIViewAccessibility automationElements] + 160
11 UIAccessibility                0x31894 -[NSObject(AXPrivCategory) _iosAccessibilityAttributeValue:] + 220
12 UIAccessibility                0x5d59c -[NSObject(UIAccessibilityAutomation) _accessibilityUserTestingSnapshotDescendantsWithAttributes:maxDepth:maxChildren:maxArrayCount:honorsModalViews:] + 924
13 UIAccessibility                0x5ebb4 -[NSObject(UIAccessibilityAutomation) _accessibilityUserTestingSnapshotWithOptions:] + 940
14 UIAccessibility                0x2e6c0 -[NSObject(AXPrivCategory) _iosAccessibilityAttributeValue:forParameter:] + 1420
15 UIKit                          0x575e0 -[UIApplicationAccessibility _iosAccessibilityAttributeValue:forParameter:] + 1648
16 UIAccessibility                0xcb9c _copyParameterizedAttributeValueCallback + 364
17 AXRuntime                      0xe268 ___AXXMIGCopyParameterizedAttributeValue_block_invoke + 64
18 AXRuntime                      0xd9c0 _handleNonMainThreadCallback + 60
19 AXRuntime                      0xe09c _AXXMIGCopyParameterizedAttributeValue + 480
20 AXRuntime                      0x808c AXUIElementCopyParameterizedAttributeValueRecursive + 640
21 AXRuntime                      0x7d74 AXUIElementCopyParameterizedAttributeValue + 96
22 XCTAutomationSupport           0x7f30 (Missing UUID f4602ce4c6873048a49e7e2d5cfde760)
23 XCTAutomationSupport           0x11be4 (Missing UUID f4602ce4c6873048a49e7e2d5cfde760)
24 XCTAutomationSupport           0xf7d4 (Missing UUID f4602ce4c6873048a49e7e2d5cfde760)
25 XCTAutomationSupport           0x2b8d0 (Missing UUID f4602ce4c6873048a49e7e2d5cfde760)
26 CoreFoundation                 0x2d750 __CFRUNLOOP_IS_CALLING_OUT_TO_A_BLOCK__ + 28
27 CoreFoundation                 0x2d41c __CFRunLoopDoBlocks + 396
28 CoreFoundation                 0x2ee40 __CFRunLoopRun + 848
29 CoreFoundation                 0x2e1d0 _CFRunLoopRunSpecificWithOptions + 532
30 GraphicsServices               0x1498 GSEventRunModal + 120
31 UIKitCore                      0x1212c4 <redacted> + 796
32 UIKitCore                      0x8c158 UIApplicationMain + 332
33 UIKitCore                      0x298698 <redacted> + 528
34 Runner                         0x6d48 main + 4337397064 (AppDelegate.swift:4337397064)
35 ???                            0x181f45c1c (Missing)
```

Additonal thing is it occured on iPhone 16 Pro / iOS 26.4.1, which is a high-end model device.

## The crash flow I found

1. Open a screen with image/video picker.
2. Tap **Camera** as input source.
3. Record a video and tap **Use Video**.
4. Return to Flutter screen.
5. App is terminated due to memory pressure (Jetsam/OOM).

## Why this is easy to misread

When iOS kills your process because of memory pressure, the report can show system-level frames, and it may not look like "your code crashed".

In practice, this is still your app's memory profile problem, especially around camera/media handoff and preview decoding.

## What fixed it for me

### 1) Limit capture payload early

For camera images via `image_picker`, do not request full-size assets unless really necessary.

Before:

```dart
final XFile? image = await _picker.pickImage(source: source);
```

After:

```dart
final XFile? image = await _picker.pickImage(
  source: ImageSource.camera,
  maxWidth: 1920,
  maxHeight: 1920,
  imageQuality: 85,
  requestFullMetadata: false,
);
```

For videos, also constrain what you can (for example duration), then compress/transcode if needed before heavy processing.

### 2) Avoid full-resolution image decode in preview widgets

Before:

```dart
Image.file(
  _selectedImage!,
  height: 250,
  width: double.infinity,
  fit: BoxFit.cover,
)
```

After:

```dart
Image(
  image: ResizeImage(FileImage(_selectedImage!), width: 1080),
  height: 250,
  width: double.infinity,
  fit: BoxFit.cover,
  filterQuality: FilterQuality.low,
)
```

This significantly reduces decode memory while still looking good enough for preview.

### 3) Evict old preview image when replacing media

If users re-pick media multiple times, stale decoded images can keep memory high.

```dart
import 'dart:async';

Future<void> _evictImagePreview(File? imageFile) async {
  if (imageFile == null) {
    return;
  }
  await FileImage(imageFile).evict();
}

Future<void> _pickImage(ImageSource source) async {
  final File? previousImage = _selectedImage;

  final XFile? image = await _picker.pickImage(
    source: source,
    maxWidth: 1920,
    maxHeight: 1920,
    imageQuality: 85,
    requestFullMetadata: false,
  );

  if (image != null) {
    await _evictImagePreview(previousImage);
    setState(() {
      _selectedImage = File(image.path);
    });
  }
}

@override
void dispose() {
  unawaited(_evictImagePreview(_selectedImage));
  super.dispose();
}
```

### 4) Handle memory-pressure callback globally

Listen for memory pressure and clear caches proactively.

```dart
class AppState extends State<App> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didHaveMemoryPressure() {
    final ImageCache imageCache = PaintingBinding.instance.imageCache;
    imageCache.clear();
    imageCache.clearLiveImages();
    super.didHaveMemoryPressure();
  }
}
```

## Practical checklist before submitting to App Store

1. Test media capture with large/long assets in **Release** mode.
2. Repeat pick/retake/cancel cycles to detect memory growth.
3. Verify image/video preview widgets do not decode full-resolution files.
4. Keep Crashlytics + Analytics breadcrumbs enabled for production diagnostics.
5. Validate on at least one lower-memory iPhone model, not only high-end devices.

## Built from real experience: CompactKit

I wrote this guide from my own release workflow while building **CompactKit**.
If you want to see a real app shipped, check it out here 👉 [compactkit.cc](https://compactkit.cc/)

## Evaluative Perspective

If a crash only appears in App Store review but not locally, treat it as a real production condition, not a reviewer anomaly.

Telemetry plus memory-safe media handling usually reveals the root cause quickly.

Happy debugging!
