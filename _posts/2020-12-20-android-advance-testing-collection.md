---
layout: post
title:  "Android Advance - Testing"
date:   2020-12-20
excerpt: "This artical is short summary of Testing on Android Advance topics from Google Codelabs"
categories: [tutorial, android, android-testing, android-advance]
comments: true
tags: [tutorial, android, android-testing, android-advance]
---

1. Testing basic and concepts
- Source: https://developer.android.com/codelabs/advanced-android-kotlin-training-testing-basics

- Local tests (test source set):
These tests are run locally on your development machine's JVM and do not require an emulator or physical device. Because of this, they run fast, but their fidelity is lower, meaning they act less like they would in the real world.

<img src="/static/img/test.png" width="20%" height="20%" />

- Instrumented tests (androidTest source set):
These tests run on real or emulated Android devices, so they reflect what will happen in the real world, but are also much slower.

<img src="/static/img/instrumented_test.png" width="20%" height="20%" />

For eg:

<img src="/static/img/two_test_type.png" width="20%" height="20%" />

- **Hamcrest** dependency:
    - Support for `human readable` testing code
    - Example:
        ```kotlin
        assertEquals(result.completedTasksPercent, 0f)

        // versus

        assertThat(result.completedTasksPercent, `is`(0f))
        ```
    - Import:
        ```
        dependencies {
            // Other dependencies
            testImplementation "org.hamcrest:hamcrest-all:$hamcrestVersion"
        }
        ```

- Gradle test depedency:
    - `implementation`—The dependency is available in all source sets, including the test source sets.
    - `testImplementation`—The dependency is only available in the **test** source set.
    - `androidTestImplementation`—The dependency is only available in the **androidTest** source set.

- Strategies:
    - Given(input), When(action on the object you're testing), Then(result/output)
    - Test Names: _getActiveAndCompletedStats_noCompleted_returnsHundredZero_

- TDD (Test Driven Development) steps:

    <img src="/static/img/TDD.png" width="20%" height="20%" />

- ViewModel test:
    - Use `AndroidX Test`: is used for both **local test** and **instrumented test**
    
    - Use `Robolectric Testing`: simulated Android environment that AndroidX Test uses for local tests

    - Annotate the class with the `AndroidJunit4` test runner:
        
        <img src="/static/img/junit4.png" width="20%" height="20%" />
    
    - Write AndroidX Test code

    1. Dependencies:
        ```
        // AndroidX Test - JVM testing
        testImplementation "androidx.test.ext:junit-ktx:$androidXTestExtKotlinRunnerVersion"

            testImplementation "androidx.test:core-ktx:$androidXTestCoreVersion"

        testImplementation "org.robolectric:robolectric:$robolectricVersion"
        ```

    2. Add JUnit Test Runner:
        ```kotlin
        @RunWith(AndroidJUnit4::class)
        class TasksViewModelTest {
            // Test code
        }
        ```
    
    3. Use AndroidX Test
        ```kotlin
        @Test
        fun addNewTask_setsNewTaskEvent() {

            // Given a fresh ViewModel
            val tasksViewModel = TasksViewModel(ApplicationProvider.getApplicationContext())

            // When adding a new task
            tasksViewModel.addNewTask()

            // Then the new task event is triggered
            // TODO test LiveData
        }
        ```

- LiveData test:
    - Use InstantTaskExecutorRule:
        - Add dependency:
            ```
            testImplementation "androidx.arch.core:core-testing:$archTestingVersion"
            ```

    - Ensure LiveData observation:
        - Add the `LiveDataTestUtil.kt` Class (to remove boilerplate code to observe a single LiveData):
            ```kotlin
            import androidx.annotation.VisibleForTesting
            import androidx.lifecycle.LiveData
            import androidx.lifecycle.Observer
            import java.util.concurrent.CountDownLatch
            import java.util.concurrent.TimeUnit
            import java.util.concurrent.TimeoutException


            @VisibleForTesting(otherwise = VisibleForTesting.NONE)
            fun <T> LiveData<T>.getOrAwaitValue(
                time: Long = 2,
                timeUnit: TimeUnit = TimeUnit.SECONDS,
                afterObserve: () -> Unit = {}
            ): T {
                var data: T? = null
                val latch = CountDownLatch(1)
                val observer = object : Observer<T> {
                    override fun onChanged(o: T?) {
                        data = o
                        latch.countDown()
                        this@getOrAwaitValue.removeObserver(this)
                    }
                }
                this.observeForever(observer)

                try {
                    afterObserve.invoke()

                    // Don't wait indefinitely if the LiveData is not set.
                    if (!latch.await(time, timeUnit)) {
                        throw TimeoutException("LiveData value was never set.")
                    }

                } finally {
                    this.removeObserver(observer)
                }

                @Suppress("UNCHECKED_CAST")
                return data as T
            }
            ```
        - Then just use getOrAwaitValue to write the assertion:
            ```kotlin
            val value = tasksViewModel.newTaskEvent.getOrAwaitValue()
            assertThat(value.getContentIfNotHandled(), (not(nullValue())))  // getContentIfNotHandled provides the "one-time" capability
            ```


- Tips & Notes:
    - `testImplementation` and `androidTestImplementation` will not come to size of your APK.
    - To quick generate Test for class/function:
        > Right click on the class/function > Generate... > Test...

        <img src="/static/img/generate_test.png" width="20%" height="20%" />


2. Test Doubles and Dependency Injection
- Source: https://developer.android.com/codelabs/advanced-android-kotlin-training-testing-test-doubles

- Testing Strategy:

    <img src="/static/img/test_strategy.png" width="20%" height="20%" />

    - `Unit tests`—Tests that run on a single class, usually a single method in that class
    - `Integration tests`—These test the interaction of several classes to make sure they behave as expected when used together. **Example**: Testing all the functionality of a single fragment and view model pair.
    - `End to end tests (E2e)`—Test a combination of features working together. **Example**: Starting up the entire app and testing a few features together.

- Test Doubles: 
    - Don't use the real networking or database code.
    - Some types of test doubles: **Fake/Mock (most common), Stub, Summy, Spy**

- _runBlockingTest_: for functions that launch a coroutine to call it.
    ```
    testImplementation "org.jetbrains.kotlinx:kotlinx-coroutines-test:$coroutinesVersion"
    ```
- Fragment test:
    ```
    implementation "androidx.fragment:fragment-testing:$fragmentVersion"
    ```

    ```kotlin
    @ExperimentalCoroutinesApi
    @MediumTest
    @RunWith(AndroidJUnit4::class)
    class TaskDetailFragmentTest {

        private lateinit var repository: TasksRepository

        @Before
        fun initRepository() {
            repository = FakeAndroidTestRepository()
            ServiceLocator.tasksRepository = repository
        }

        @After
        fun cleanupDb() = runBlockingTest {
            ServiceLocator.resetRepository()
        }

        @Test
        fun activeTaskDetails_DisplayedInUi() = runBlockingTest {
            // GIVEN - Add active (incomplete) task to the DB
            val activeTask = Task("Active Task", "AndroidX Rocks", false)
            repository.saveTask(activeTask)

            // WHEN - Details fragment launched to display task
            val bundle = TaskDetailFragmentArgs(activeTask.id).toBundle()
            launchFragmentInContainer<TaskDetailFragment>(bundle, R.style.AppTheme)
            Thread.sleep(2000)
        }

    }
    ```

- `Espresso`:
    - Interact with views, like clicking buttons, sliding a bar, or scrolling down a screen.
    - Assert that certain views are on screen or are in a certain state (such as containing particular text, or that a checkbox is checked, etc.).

    ```
    androidTestImplementation "androidx.test.espresso:espresso-core:$espressoVersion"
    ```

    <img src="/static/img/espresso_explain.png" width="20%" height="20%" />

    ```kotlin
    // make sure that the title/description are both shown and correct
    onView(withId(R.id.task_detail_title_text)).check(matches(isDisplayed()))
    onView(withId(R.id.task_detail_title_text)).check(matches(withText("Active Task")))
    onView(withId(R.id.task_detail_description_text)).check(matches(isDisplayed()))
    onView(withId(R.id.task_detail_description_text)).check(matches(withText("AndroidX Rocks")))
    // and make sure the "active" checkbox is shown unchecked
    onView(withId(R.id.task_detail_complete_checkbox)).check(matches(isDisplayed()))
    onView(withId(R.id.task_detail_complete_checkbox)).check(matches(not(isChecked())))
    ```

- Using `Mockito` to write **Navigation tests**:

    ```
    // Dependencies for Android instrumented unit tests
    androidTestImplementation "org.mockito:mockito-core:$mockitoVersion"

    androidTestImplementation "com.linkedin.dexmaker:dexmaker-mockito:$dexMakerVersion" 

    androidTestImplementation "androidx.test.espresso:espresso-contrib:$espressoVersion"
    ```

    ```kotlin
    @Test
    fun clickTask_navigateToDetailFragmentOne() = runBlockingTest {
        repository.saveTask(Task("TITLE1", "DESCRIPTION1", false, "id1"))
        repository.saveTask(Task("TITLE2", "DESCRIPTION2", true, "id2"))

        // GIVEN - On the home screen
        val scenario = launchFragmentInContainer<TasksFragment>(Bundle(), R.style.AppTheme)
        val navController = mock(NavController::class.java)
        scenario.onFragment {
            Navigation.setViewNavController(it.view!!, navController)
        }
        // WHEN - Click on the first list item
        onView(withId(R.id.tasks_list))
                .perform(RecyclerViewActions.actionOnItem<RecyclerView.ViewHolder>(
                        hasDescendant(withText("TITLE1")), click()))


        // THEN - Verify that we navigate to the first detail screen
        verify(navController).navigate(
                TasksFragmentDirections.actionTasksFragmentToTaskDetailFragment( "id1")
        )

        Thread.sleep(2000)

    }
    ```


#### Happy testing!
