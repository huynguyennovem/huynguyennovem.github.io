---
layout: post
title:  "Configure and Run Ktlin on Android"
date:   2020-09-08
excerpt: "This tutorial will guide you how to configure and run Ktlin on Android"
categories: [tutorial, android, ktlin]
comments: true
tags: [tutorial, android, ktlin]
---
In this guideline, I used [JLLeitschuh/ktlint-gradle](https://github.com/jlleitschuh/ktlint-gradle).
- In the top-level `build.gradle` file:
```
buildscript {
    repositories {
        google()
        jcenter()
        maven {
            url "https://plugins.gradle.org/m2/"
        }
    }
    dependencies {
        ...
        classpath "org.jlleitschuh.gradle:ktlint-gradle:9.2.1"
    }
}

allprojects {
    apply plugin: "org.jlleitschuh.gradle.ktlint"
    repositories {
        ...
        maven {
            url "https://plugins.gradle.org/m2/"
        }
    }
}
```
- Open Terminal and run commands:
```
./gradlew ktlintFormat
or
./gradlew ktlintFormat --stacktrace

./gradlew ktlintCheck
or
./gradlew ktlintCheck --stacktrace

```

#### Happy coding!
