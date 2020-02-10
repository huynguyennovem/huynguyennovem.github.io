---
layout: post
title:  "Android Bottom Navigation Material"
date:   2020-02-10 10:16:00
excerpt: "BottomNavigationView with material support."
categories: [tutorial, android]
comments: true
tags: [tutorial, android]
---
### Introduction
[BottomNavigationView](https://material.io/develop/android/components/bottom-navigation-view/) with material support.
- This project helps to make compatible BottomNavigationView for Android SDK >= 25.
- Support AndroidX.
- Support back to primary Fragment.

### Demo
![Android Bottom Navigation Material](https://media.giphy.com/media/lMC4b9HtUpcDiml7Fc/giphy.gif)

[Android Bottom Navigation Material](https://www.youtube.com/watch?v=yu3wM-9z1XM)

### Contribution
Contributions are welcome. Feel free to submit a pull request to contribute to this project.

### Implementation

1. Add material to app gradle
```
implementation 'com.google.android.material:material:1.0.0'
```

2. Update MainActivity
```java
public class MainActivity extends AppCompatActivity {

    private static final String SELECTED_NAV = "SELECTED_NAV";
    private BottomNavigationView mBottomNav;
    private int mSelectedNav;
    private BottomNavigationView.OnNavigationItemSelectedListener mNavigationBottomListener = new BottomNavigationView.OnNavigationItemSelectedListener() {
        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
            selectFragment(menuItem.getItemId());
            return true;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mBottomNav = findViewById(R.id.nav_view);
        mBottomNav.setOnNavigationItemSelectedListener(mNavigationBottomListener);
        mBottomNav.setOnNavigationItemReselectedListener(new BottomNavigationView.OnNavigationItemReselectedListener() {
            @Override
            public void onNavigationItemReselected(@NonNull MenuItem menuItem) {
            }
        });

        if (savedInstanceState != null) {
            mSelectedNav = savedInstanceState.getInt(SELECTED_NAV, 0);
        } else {
            mSelectedNav = R.id.navigation_home;
        }
        selectFragment(mSelectedNav);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putInt(SELECTED_NAV, mSelectedNav);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (mSelectedNav != R.id.navigation_home) {
            selectFragment(R.id.navigation_home);
        } else {
            super.onBackPressed();
        }
    }

    private void selectFragment(int menuId) {
        Fragment frag = null;
        String tag = null;
        switch (menuId) {
            case R.id.navigation_home:
                frag = HomeFragment.newInstance();
                tag = "HomeFragment";
                break;
            case R.id.navigation_search:
                frag = SearchFragment.newInstance();
                tag = "SearchFragment";
                break;
            case R.id.navigation_setting:
                frag = SettingFragment.newInstance();
                tag = "SettingFragment";
                break;
        }

        // update selected item
        mSelectedNav = menuId;

        FragmentManager fragmentManager = getSupportFragmentManager();
        Fragment currentFragment = fragmentManager.getPrimaryNavigationFragment();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

        // hide current active tab fragment
        if (currentFragment != null) {
            fragmentTransaction.hide(currentFragment);
        }
        // check request fragment to show or add new it
        Fragment fragmentTemp = fragmentManager.findFragmentByTag(tag);
        if (fragmentTemp == null) {
            fragmentTemp = frag;
            if (fragmentTemp != null) {
                fragmentTransaction.add(R.id.container, fragmentTemp, tag);
            }
        } else {
            fragmentTransaction.show(fragmentTemp);
        }
        fragmentTransaction.setPrimaryNavigationFragment(fragmentTemp);
        fragmentTransaction.setReorderingAllowed(true);
        fragmentTransaction.commitAllowingStateLoss();

        mBottomNav.setOnNavigationItemSelectedListener(null);
        mBottomNav.setSelectedItemId(menuId);
        mBottomNav.setOnNavigationItemSelectedListener(mNavigationBottomListener);
    }
}
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".act.MainActivity">

    <FrameLayout
        android:id="@+id/container"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:background="#f1f1f1"
        app:layout_constraintBottom_toTopOf="@id/nav_view"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />


    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/nav_view"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginStart="0dp"
        android:layout_marginEnd="0dp"
        android:background="?android:attr/windowBackground"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@id/container"
        app:menu="@menu/bottom_nav_menu" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

3. Add some fragments
```java
public class HomeFragment extends BaseFragment {


    public HomeFragment() {
        // Required empty public constructor
    }

    public static HomeFragment newInstance() {
        return new HomeFragment();
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

}
```

```java
public class SearchFragment extends BaseFragment {


    public SearchFragment() {
        // Required empty public constructor
    }

    public static SearchFragment newInstance() {
        return new SearchFragment();
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

}
```

```java
public class SettingFragment extends BaseFragment {


    public SettingFragment() {
        // Required empty public constructor
    }

    public static SettingFragment newInstance() {
        return new SettingFragment();
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_setting, container, false);
    }

}
```

You can checkout full code from [here](https://github.com/huynguyennovem/Android-Bottom-Navigation-Material)


Happy coding!
