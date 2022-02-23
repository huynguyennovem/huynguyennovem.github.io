---
layout: post
title:  "Mac OS  M1 chip - Pros and Cons from my exp"
date:   2021-12-31 16:00:00
excerpt: "Pros and Cons of Mac M1 with Android/Flutter development experiences"
categories: [mac, m1, apple]
comments: true
tags: [mac, m1, apple]
---

### **Pros**
- Have 30-40% faster in build speed

### **Cons**
**1. iOS simulator : The list scrolls too fast/stuttering:**

<video width="330" height="720" controls>
  <source src="/static/video/scroll_too_fast.mp4" type="video/mp4">
</video>

- How to fix:

Go to Applications > XCode > Right click, choose `Show package contents` > Contents > Developer > Applications > Right click on `Simulator` > Get Info > Mark checked on `Open using Rosseta`

  <img src="/static/img/fix_mac_scroll.png" width="50%" height="50%" />

- Result:

<video width="330" height="720" controls>
  <source src="/static/video/fix_scroll_mac.mp4" type="video/mp4">
</video>



**(To be continued)**