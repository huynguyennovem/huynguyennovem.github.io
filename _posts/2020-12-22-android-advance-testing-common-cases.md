---
layout: post
title:  "Android Advance - Testing common cases"
date:   2020-12-22
excerpt: "This article notes some common cases on Android Testing"
categories: [tutorial, android, android-testing]
comments: true
tags: [tutorial, android, android-testing]
---


**1. View**

- Use `espresso` to test View:

```kotlin
@get: Rule()
val activity = ActivityScenarioRule(MainActivity::class.java)

@Test
fun calculate_20_percent_tip() {
    Espresso.onView(withId(R.id.cost_of_service_edit_text)).perform(typeText("50.00"))
    Espresso.onView(withId(R.id.calculate_button)).perform(click())
    Espresso.onView(withId(R.id.tip_result)).check(matches(withText(containsString("$10.00"))))

    Thread.sleep(5000)
}
```

Example: 

<video width="320" height="240" controls>
  <source src="/static/video/auto_fill_test.mp4" type="video/mp4">
</video>

**2. RecyclerView**

- Use `espresso` to test RecyclerView:

```kotlin
@get: Rule
val activity = ActivityScenarioRule(MainActivity::class.java)

@Test
fun scroll_to_item_test() {
    Espresso.onView(ViewMatchers.withId(R.id.recycler_view)).perform(
        RecyclerViewActions.scrollToPosition<RecyclerView.ViewHolder>(9)
    )
    Espresso.onView(ViewMatchers.withText(R.string.affirmation10)).check(matches(ViewMatchers.isDisplayed()))

    Thread.sleep(5000)
}
```

- Use `mockito` to mock a necessary class:

```kotlin
private val context = mock(Context::class.java)

@Test
fun adapter_size() {
    val data = listOf(
        Affirmation(R.string.affirmation1, R.drawable.image1),
        Affirmation(R.string.affirmation2, R.drawable.image2)
    )
    val adapter = ItemAdapter(context, data)
    assertEquals("ItemAdapter is the correct size", data.size, adapter.itemCount)
}
```




### **References**
- [https://developer.android.com/codelabs/android-basics-kotlin-write-instrumentation-tests](https://developer.android.com/codelabs/android-basics-kotlin-write-instrumentation-tests)
- [https://developer.android.com/codelabs/android-basics-kotlin-affirmations-test-lists-and-adapters](https://developer.android.com/codelabs/android-basics-kotlin-affirmations-test-lists-and-adapters)

### Happy testing!
