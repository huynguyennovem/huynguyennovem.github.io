---
layout: post
title:  "Handle single livedata event on Android"
date:   2019-12-01 16:00:00
excerpt: "How to handle livedata for single event case on Android?"
categories: [tutorial, android]
comments: true
tags: [tutorial, android, kotlin]
---
There is a problem with LiveData when we invoke some single event, such as: showing a toast/snackbar, show/hide view or navigate to another fragment/activity. The problem is the observer always consume the changes from LiveData and the LiveData keeps holding latest values without auto-reset.
Below is list of solutions to handle this case, with Advantage/Disadvantage:

### 1. Reset data manually

- Sample:

```kotlin
val processStatus = MutableLiveData(false)

fun startProcess() {
    processStatus.value = true
}

fun resetProcessStatus() {
    processStatus.value = false
}
```

- Disadvantage:
    - Redundant boilerplate code with new function

### 2. Use [SingleLiveEvent](https://github.com/android/architecture-samples/blob/dev-todo-mvvm-live/todoapp/app/src/main/java/com/example/android/architecture/blueprints/todoapp/SingleLiveEvent.java)


- Sample:

```kotlin
val processStatus = SingleLiveEvent<Boolean>()

fun startProcess() {
    processStatus.value = true
}
```

- Disadvantage:
    - SingleLiveEvent is restricted to only [one obseverver](https://github.com/android/architecture-samples/blob/6419d4c523b67d020120fc400ed5a7372e5615f2/todoapp/app/src/main/java/com/example/android/architecture/blueprints/todoapp/SingleLiveEvent.java#L48), so if there is many obversers to it, it's not work at all.

### 3. Use [Event wrapper](https://gist.github.com/JoseAlcerreca/5b661f1800e1e654f07cc54fe87441af/raw/d1d9ad561c16f4d04367424ac5f5b305ba691852/Event.kt)

```kotlin
/**
 * Used as a wrapper for data that is exposed via a LiveData that represents an event.
 */
open class Event<out T>(private val content: T) {

    var hasBeenHandled = false
        private set // Allow external read but not write

    /**
     * Returns the content and prevents its use again.
     */
    fun getContentIfNotHandled(): T? {
        return if (hasBeenHandled) {
            null
        } else {
            hasBeenHandled = true
            content
        }
    }

    /**
     * Returns the content, even if it's already been handled.
     */
    fun peekContent(): T = content
}
```

```kotlin

// In ViewModel class

private val _extractStatus = MutableLiveData<Event<Boolean>>()
val extractStatus: LiveData<Event<Boolean>>
    get() = _extractStatus



fun startProcess() {
    _extractStatus.value = Event(true)
}

// In Fragment/Activity class
viewModel.extractStatus.observe(viewLifecycleOwner, EventObserver {
    if(it) {
        view.showSnackBar(getString(R.string.extract_success))
    }
})

```



### References
1. https://medium.com/androiddevelopers/livedata-with-snackbar-navigation-and-other-events-the-singleliveevent-case-ac2622673150
2. https://developer.android.com/jetpack/guide/ui-layer/events
3. https://elizarov.medium.com/shared-flows-broadcast-channels-899b675e805c

    
Happy coding!
