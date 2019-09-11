---
layout: post
title:  "Custom TextView contains URL with Kotlin"
date:   2019-09-09 11:20:00
excerpt: "This tutorial will show you how to custom a TextView which contains a url. The source code is implemented with Kotlin."
categories: [tutorial, android, kotlin, customview]
comments: true
image:
    feature: https://huynguyennovem.github.io/static/img/customtextviewurl_crop.png
tags: [tutorial, android, kotlin, customview]
---
This tutorial will show you how to custom a TextView which contains a url. The source code is implemented with Kotlin.
1. Create a class **`CustomUrlTextView`**:
    ```kotlin
    package com.template.customurltextview
    
    import android.content.Context
    import android.text.SpannableStringBuilder
    import android.text.Spanned
    import android.text.method.LinkMovementMethod
    import android.text.style.ClickableSpan
    import android.util.AttributeSet
    import android.view.View
    import androidx.appcompat.widget.AppCompatTextView
    
    class CustomUrlTextView : AppCompatTextView {
    
        var mListener: OnClickLinkListener? = null
    
        constructor(context: Context, attrs: AttributeSet) : super(context, attrs) {
            applyTextUrl(context, attrs)
        }
    
        constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr) {
            applyTextUrl(context, attrs)
        }
    
        private fun applyTextUrl(context: Context, attrs: AttributeSet) {
            val attributeArray = context.obtainStyledAttributes(
                attrs,
                R.styleable.CustomUrlTextView)
            val separateCharStart = attributeArray.getString(R.styleable.CustomUrlTextView_separateCharStart)
            val separateCharEnd = attributeArray.getString(R.styleable.CustomUrlTextView_separateCharEnd)
    
            val term = this.text
            val spannableStringBuilder = SpannableStringBuilder(term)
            val click = object : ClickableSpan() {
                override fun onClick(widget: View) {
                    mListener!!.onClick()
                }
            }
            spannableStringBuilder.setSpan(click, term.indexOf(separateCharStart!!) + 1, term.indexOf(separateCharEnd!!), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
            spannableStringBuilder.replace(term.indexOf(separateCharStart), term.indexOf(separateCharStart) + 1, "")
            spannableStringBuilder.replace(term.indexOf(separateCharEnd) - 1, term.indexOf(separateCharEnd), "")
            this.text = spannableStringBuilder
            this.movementMethod = LinkMovementMethod.getInstance()
    
            attributeArray.recycle()
        }
    
        fun setListener(listener: OnClickLinkListener) {
            mListener = listener
        }
    
        interface OnClickLinkListener {
            fun onClick()
        }
    }
    ```
    - In this class, I have get all attributes in a styleable `CustomUrlTextView`. 
    - The click event was handled with `SpannableStringBuilder`. I used a interface (`OnClickLinkListener`) as a callback for passing event into a View (activity/fragment) which implemented the interface.

2. Create a styleable **`CustomUrlTextView`**:
    - Step 1: Create `attrs.xml` in **res** folder
    - Step 2: Edit `attrs.xml` like below:
    ```kotlin
    <?xml version="1.0" encoding="utf-8"?>
        <resources>
            <declare-styleable name="CustomUrlTextView">
                <attr name="separateCharStart" format="string"/>
                <attr name="separateCharEnd" format="string"/>
            </declare-styleable>
        </resources>      
    ```

3.  Add custom TextView into your layout:
    ```kotlin
    <?xml version="1.0" encoding="utf-8"?>
    <RelativeLayout
            xmlns:android="http://schemas.android.com/apk/res/android"
            xmlns:tools="http://schemas.android.com/tools"
            xmlns:app="http://schemas.android.com/apk/res-auto"
            android:layout_width="match_parent"
            android:layout_marginLeft="16dp"
            android:layout_marginRight="16dp"
            android:layout_height="match_parent"
            tools:context=".MainActivity">
    
        <com.template.customurltextview.CustomUrlTextView
                android:id="@+id/signInTextView"
                android:layout_width="match_parent"
                android:layout_centerInParent="true"
                android:layout_height="wrap_content"
                android:gravity="center|start"
                android:text="@string/signin_text"
                android:textSize="18sp"
                app:separateCharEnd="]"
                app:separateCharStart="["/>
    
        <com.template.customurltextview.CustomUrlTextView
                android:id="@+id/signUpTextView"
                android:layout_width="match_parent"
                android:layout_below="@id/signInTextView"
                android:layout_centerInParent="true"
                android:layout_height="wrap_content"
                android:layout_marginTop="16dp"
                android:gravity="center|start"
                android:text="@string/signup_text"
                android:textSize="18sp"
                app:separateCharEnd="]"
                app:separateCharStart="["/>
    
    </RelativeLayout>
    ```
4.  Add the code into the view (activity/fragment):
    ```kotlin
    package com.template.customurltextview
    
    import android.content.Intent
    import android.net.Uri
    import androidx.appcompat.app.AppCompatActivity
    import android.os.Bundle
    import androidx.core.content.ContextCompat
    import kotlinx.android.synthetic.main.activity_main.*
    
    class MainActivity : AppCompatActivity() {
    
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_main)
    
            signInTextView.setListener(object : CustomUrlTextView.OnClickLinkListener{
                override fun onClick() {
                    ContextCompat.startActivity(this@MainActivity, Intent(this@MainActivity, LoginActivity::class.java), null)
                }
            })
    
            val urlDestination = "https://google.com"
            signUpTextView.setListener(object : CustomUrlTextView.OnClickLinkListener{
                override fun onClick() {
                    ContextCompat.startActivity(this@MainActivity, Intent(Intent.ACTION_VIEW, Uri.parse(urlDestination)), null)
                }
            })
        }
    }
    ```

End the result is:
<img src="/static/img/customtextviewurl.png" width="20%" height="20%" />

You can checkout the full sample project from [here](https://github.com/huynguyennovem/android-template-kotlin/tree/master/CustomUrlTextView)

Happy Coding!
