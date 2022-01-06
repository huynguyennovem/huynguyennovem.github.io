---
layout: post
title:  "How to test dynamic links on iOS simulator"
date:   2022-01-06 22:00:00
excerpt: "3 easy solutions to test dynamic links on iOS simulator from hands-on experience"
categories: [mac, ios, dynamic links, ios silumator]
comments: true
tags: [mac, ios, dynamic links, ios silumator]
---

**1. Use openurl command**

```
/usr/bin/xcrun simctl openurl booted "<your_url_here>"
```

**2. Use Share extension on Mac**

- Send url to `Mail` app on Mac
- Right click on url > Share > Simulator

**3. Use clickable editor app**

In my case, I used `Contact` app:

- Choose a contact to edit > Edit > Add Url
- Insert link > Done
- Click on url to open it

**Demo video**

<a href="http://www.youtube.com/watch?feature=player_embedded&v=rwAUS0oTbOs" target="_blank">
 <img src="http://img.youtube.com/vi/rwAUS0oTbOs/mqdefault.jpg" alt="Watch the video" width="1080" height="720" />
</a>

Thanks!