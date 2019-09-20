---
layout: post
title:  "Create a custom notification number view in Android with Kotlin"
date:   2019-09-17 10:30:00
excerpt: "This tutorial will show you how to create a custom notification number view in Android with Kotlin"
categories: [tutorial, android, kotlin, customview]
comments: true
tags: [tutorial, android, kotlin, customview]
image:
    feature: https://huynguyennovem.github.io/static/img/notify_number.png
---
This tutorial will show you how to create a custom notification number view in Android with Kotlin

1. Create a styleable:
```xml
<declare-styleable name="CustomNotificationTextView">
    <attr name="limitEnd" format="integer"/>
</declare-styleable>
```

2. Create custom view `CustomNotificationTextView`:
```kotlin
class CustomSquareTextView : TextView {

    var initTextStr: String? = null
    var outputTextStr: String? = null


    constructor(context: Context, attrs: AttributeSet) : super(context, attrs) {
        init(attrs)
    }

    constructor (context: Context, attrs: AttributeSet, defStyle: Int) : super(context, attrs, defStyle) {
        init(attrs)
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, widthMeasureSpec)
        val width = this.measuredWidth
        val height = this.measuredHeight
        val size = Math.max(width, height)
        val widthSpec = MeasureSpec.makeMeasureSpec(size, MeasureSpec.EXACTLY)
        val heightSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
        super.onMeasure(widthSpec, heightSpec)
    }

    private fun init(attrs: AttributeSet) {
        if (text!!.isEmpty())
            return
        initTextStr = text!!.toString()
        outputTextStr = initTextStr
        val attributeArray = context.obtainStyledAttributes(
                attrs,
                R.styleable.CustomSquareTextView)
        val limitEnd = attributeArray.getInteger(R.styleable.CustomSquareTextView_limitEnd, 0)
        attributeArray.recycle()
        val castText = OtherUtil.isNumber(initTextStr!!)
        if (castText.first) {
            if (castText.second >= limitEnd) {
                outputTextStr = "$limitEnd+"
            }
        }
        this.text = outputTextStr
    }

}
```
In here, when the value number is larger than `limitEnd`, it will be display with `+` icon.

3. Apply to layout
```xml
<com.sample.widget.CustomNotificationTextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_gravity="end|top"
    android:background="@drawable/notify_bg"
    android:gravity="center"
    android:padding="2dp"
    android:text="999999"
    app:limitEnd="100"
    android:textColor="@android:color/white"
    android:textSize="8sp" />
```

4. The result:

<img src="/static/img/notify_number.png" width="20%" height="20%" />


Happy Coding!
