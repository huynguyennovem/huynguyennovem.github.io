---
layout: post
title:  "Wrap-up of Flows vs Channel in Kotlin"
date:   2019-12-10 16:00:00
excerpt: "Wrap-up of Flows vs Channel in Kotlin by Roman Elizarov"
categories: [tutorial, android]
comments: true
tags: [tutorial, android, kotlin]
---

### 1. Flows
- Single producer and a single consumer
- Values are emitted, transformed, and collected in the same coroutine
- There is no state, due to data will be changed when activity be re-created (configuration change) _(2)_

<img src="/static/img/flows-kotlin.png" width="60%" height="60%" />

```kotlin
val ints: Flow<Int> = flow {
    for (i in 1..10) {
        delay(100)
        emit(i)
    }
}

coroutineScope {
    ints.map {
        it*2
    }.collect {
        println(it)
    }
}
```

-> How to support concurrent communicating coroutines and a data transfer between them needs synchronization? -> Should support multiple observers inside the application

### 2. Shared Flows
- A shared flow exists regardless of whether it is being collected or not
- It effectively works like a broadcast channel. It is a lightweight broadcast event bus.
- Events are broadcast to an unknown number (zero or more) of subscribers. In the absence of a subscriber, any posted event is immediately dropped -> `This is a design pattern to use for events that must be processed immediately or not at all.`

<img src="/static/img/shared-flow-kotlin.png" width="60%" height="60%" />

```kotlin
class BroadcastEventBus {
    private val _events = MutableSharedFlow<Event>()
    val events = _events.asSharedFlow() // read-only public view

    suspend fun postEvent(event: Event) {
        _events.emit(event) // suspends until subscribers receive it
    }
}
```

-> Buffer may be full to keep old events, due to Emission may be suspended

### 3. State Flows
- To drop the oldest events and retain only the most recent, newest events
- State flow is a hot flow
- Two kind of flow:
    - Hot flow: emit values even if there is no collectors
    - Cold flow: it would not emit any value if there is no collector

```kotlin
class StateModel {
    private val _state = MutableStateFlow(initial)
    val state = _state.asStateFlow() // read-only public view

    fun update(newValue: Value) {
        _state.value = newValue // NOT suspending
    }
}
```

### 4. Channel
- Channels are used to handle events that must be processed exactly once
- Design with a type of event that usually has a single subscriber, but intermittently (at startup or during some kind of reconfiguration)

```kotlin
class SingleShotEventBus {
    private val _events = Channel<Event>()
    val events = _events.receiveAsFlow() // expose as flow

    suspend fun postEvent(event: Event) {
        _events.send(event) // suspends on buffer overflow
    }
}
```


### References
1. https://elizarov.medium.com/shared-flows-broadcast-channels-899b675e805c
2. https://www.youtube.com/watch?v=6Jc6-INantQ
    
Happy coding!
