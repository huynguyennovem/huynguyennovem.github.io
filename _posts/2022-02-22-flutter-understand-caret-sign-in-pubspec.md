---
layout: post
title:  "Understand caret syntax (^) in pubspec.yaml"
date:   2022-02-22 10:00:00
excerpt: "Understand caret syntax (^) in pubspec.yaml"
categories: [flutter]
comments: true
tags: [flutter]
---

Usually, you may define dependences in `pubspace.yaml` like this: `share_plus: ^2.1.0`. It contains a [caret syntax (^)](https://dart.dev/tools/pub/dependencies#caret-syntax). 
It indicates a range of version numbers are allowed.
> ^2.1.0 is the same as '>=2.1.0 <3.0.0'

So once upgrading with `flutter pub upgrade` command, all dependences will fetch the latest version:

```flutter pub upgrade
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
  boolean_selector 2.1.0
  bubble 1.2.1
> build 2.2.1 (was 2.1.0)
  build_config 1.0.0
> build_daemon 3.0.1 (was 3.0.0)
  build_resolvers 2.0.4 (2.0.6 available)
> build_runner 2.1.7 (was 2.1.2)
> build_runner_core 7.2.2 (was 7.1.0) (7.2.3 available)
  built_collection 5.1.1
> built_value 8.1.4 (was 8.1.2)
```
To prevent this, you should use the concrete version (**_without caret syntax_**). 

For eg: `share_plus: 2.1.0`.

But this solution has disadvantage by it will not up-to-date newer dependences patch fixes/feature. And then you have to update version manually.

I prefer this by I can manage version by myself. Anyway, it's up to you :)

**Happy coding!**