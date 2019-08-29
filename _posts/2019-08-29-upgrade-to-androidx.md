---
layout: post
title:  "Upgrade your Android project to AndroidX"
date:   2015-08-18 15:07:19
categories: [tutorial]
comments: true
---
Recently, Google has released [AndroidX](https://developer.android.com/jetpack/androidx) (in Jetpack libraries). Many of component in Android project has changed. So, below is steps by steps to help you convert your old project to AndroidX.
The tutorial is following by this [offical guide](https://developer.android.com/jetpack/androidx/migrate) and add some my experiences.

1. In `gradle.properties` file, set `true` for these variables:
```
android.useAndroidX=true
android.enableJetifier=true
```

2. Clean and Rebuild project
Build > Clean Project
Build > Rebuild Project

3. Check Build result in Build tab
If there are some error by wrong import Class, go to files then re-import Class

---

Note: If your project use some views as: DrawerLayout, Toolbar, fix that by replace these component:
- androidx.core.widget.DrawerLayout -> androidx.drawerlayout.widget.DrawerLayout
- android.support.v7.widget.Toolbar -> androidx.appcompat.widget.Toolbar


<!--more-->

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll’s dedicated Help repository][jekyll-help].

[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
