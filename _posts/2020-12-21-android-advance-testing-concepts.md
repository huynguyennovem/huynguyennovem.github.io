---
layout: post
title:  "Android Advance - Testing concepts"
date:   2020-12-21
excerpt: "This artical notes some concepts on Android Testing"
categories: [tutorial, android, android-testing]
comments: true
tags: [tutorial, android, android-testing
---

**1. @RunWith(AndroidJUnit4::class)**
- Use this when you wanna perform Instrumentation Testing, to execute a test on device/emulator
- AndroidJUnit4: a test runner

    Example:
    ```kotlin
    @RunWith(AndroidJUnit4::class)
    class CalculatorTests {
    }
    ```

**2. @get:Rule()**
- Specify a rule which will execute before any tests in the class.

    Example:
    ```kotlin
    @get:Rule()
    val activity = ActivityScenarioRule(MainActivity::class.java)
    ```

    `ActivityScenarioRule` here is an example rule that tells the device to launch an activity.

**3. @Test**
- An annotation to specify a test function

    Example:
    ```kotlin
    @Test
        fun calculate_20_percent_tip() {
    }
    ```

**4. mock()**
- Comes from `mockito` lib that helps to get some class instance.

    Example:
    ```kotlin
    val navController = mock(NavController::class.java)

    val context = mock(Context::class.java)
    ```

    Note: _remember that unit tests run on the JVM and not on an actual device, so there is no Context. The `mock` method allows us to create a **fake** or **mocked** instance of a Context._


**5. Android JUnit Runner**

It looks as follows:

`app/build.gradle`

```groovy
android {
    ...
    defaultConfig {
        ...testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
}
```

It's automatic added on a new project.


**6. Test Orchestrator**
- is a tool provided by Android JUnit Runner
- allows you to run tests with Instrumentation that clears the app state between each test (stateless test)
- Make for each test will run in their own instance of Instrumentation.


`app/build.gradle`

```groovy
android {
    ...
    testOptions {
        execution = "ANDROIDX_TEST_ORCHESTRATOR"
    }
    ...
    defaultConfig {
        ...testInstrumentationRunnerArguments clearPackageData: "true"
}
```


### **References**
- https://developer.android.com/codelabs/android-basics-kotlin-write-instrumentation-tests
- https://developer.android.com/codelabs/android-basics-kotlin-affirmations-test-lists-and-adapters

### Happy testing!
