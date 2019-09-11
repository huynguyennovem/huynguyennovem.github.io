---
layout: post
title:  "Create Date Time picker in ViewPager"
date:   2019-09-10 10:30:00
excerpt: "This tutorial will show you how to create a custom Date & Time dialog inside a ViewPager. The source code is implemented with Java."
categories: [tutorial, android, java, customview]
comments: true
image:
    feature: https://huynguyennovem.github.io/static/img/date_picker_crop.png
tags: [tutorial, android, java, customview]
---
This tutorial will show you how to create a custom Date & Time dialog inside a ViewPager. The source code is implemented with Java.
The idea will be: <br/>
<img src="/static/img/picker_dialog_idea.png" width="40%" height="40%" />


1. The `caller`:
    - MainActivity.java:
    
    ```java
    package com.template.dialogpicker;
    
    import androidx.appcompat.app.AppCompatActivity;
    import androidx.fragment.app.DialogFragment;
    
    import android.os.Bundle;
    import android.view.View;
    import android.widget.Button;
    
    public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
    
            Button btnShow = findViewById(R.id.btnShow);
            btnShow.setOnClickListener(this);
    
        }
    
        @Override
        public void onClick(View view) {
            if (view.getId() == R.id.btnShow) {
                DialogFragment newFragment = DateTimePickerFragment.newInstance();
                newFragment.show(getSupportFragmentManager(),"Date Time Picker");
            }
        }
    }
    ```
    - activity_main.xml:
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".MainActivity">
    
        <Button
            android:id="@+id/btnShow"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerHorizontal="true"
            android:layout_centerInParent="true"
            android:text="show dialog" />
    
        <TextView
            android:id="@+id/tv"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_below="@id/btnShow"
            android:layout_centerHorizontal="true" />
    
    
    </RelativeLayout>
    ```

2. Implement a DialogFragment:
    
    - DateTimePickerFragment.java:
    
    ```java
    package com.template.dialogpicker;
    
    import android.os.Bundle;
    import android.util.Log;
    import android.view.LayoutInflater;
    import android.view.View;
    import android.view.ViewGroup;
    import android.widget.Button;
    
    import androidx.annotation.NonNull;
    import androidx.annotation.Nullable;
    import androidx.fragment.app.DialogFragment;
    import androidx.fragment.app.FragmentStatePagerAdapter;
    import androidx.viewpager.widget.ViewPager;
    
    import com.google.android.material.tabs.TabLayout;
    
    
    public class DateTimePickerFragment extends DialogFragment {
    
        public static DateTimePickerFragment newInstance() {
            return new DateTimePickerFragment();
        }
    
        @Nullable
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
            View v = inflater.inflate(R.layout.dialog, container, false);
            getDialog().setCancelable(false);
            getDialog().setCanceledOnTouchOutside(false);
            return v;
        }
    
        @Override
        public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
            super.onViewCreated(view, savedInstanceState);
    
            ViewPager viewPager = view.findViewById(R.id.viewPager);
            TabLayout tabLayout = view.findViewById(R.id.tabLayout);
            final DateFragment dateFragment = DateFragment.newInstance();
            final TimeFragment timeFragment = TimeFragment.newInstance();
            ViewPagerAdapter adapter = new ViewPagerAdapter(getChildFragmentManager(), FragmentStatePagerAdapter.BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
            adapter.addFragment(0, dateFragment, "Date");
            adapter.addFragment(1, timeFragment, "Time");
            viewPager.setAdapter(adapter);
            tabLayout.setupWithViewPager(viewPager);
    
            Button btnOK = view.findViewById(R.id.btnOK);
            btnOK.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Log.d("xxx", "onClick: " + dateFragment.getSelectedDate() + "\t" + timeFragment.getSelectedDate());
                    dismiss();
                }
            });
        }
    
    }
    ```
    - dialog.xml:
    
    ```xml
        <?xml version="1.0" encoding="utf-8"?>
        <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical">
        
            <com.google.android.material.tabs.TabLayout
                android:id="@+id/tabLayout"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:minHeight="?actionBarSize" />
        
        
            <com.template.dialogpicker.MyViewPager
                android:id="@+id/viewPager"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"/>
        
            <Button
                android:id="@+id/btnOK"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="OK" />
        </LinearLayout>
    ```

    - Note: In this layout, I used a custom ViewPager as `MyViewPager`. This ViewPager will help to make dialog do not full all screen height, only wrap dialog content.
    
    ```java
    package com.template.dialogpicker;
    
    import android.content.Context;
    import android.util.AttributeSet;
    import android.view.View;
    
    import androidx.annotation.NonNull;
    import androidx.annotation.Nullable;
    import androidx.viewpager.widget.ViewPager;
    
    public class MyViewPager extends ViewPager {
        public MyViewPager(@NonNull Context context) {
            super(context);
        }
    
        public MyViewPager(@NonNull Context context, @Nullable AttributeSet attrs) {
            super(context, attrs);
        }
    
        @Override
        protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
            int height = 0;
            for(int i = 0; i < getChildCount(); i++) {
                View child = getChildAt(i);
                child.measure(widthMeasureSpec, MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));
                int h = child.getMeasuredHeight();
                if(h > height) height = h;
            }
    
            if (height != 0) {
                heightMeasureSpec = MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY);
            }
    
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        }
    }
    ```
3. Other component (ViewPager, Fragments):
    - ViewPagerAdapter.java:
    
    ```java
    package com.template.dialogpicker;
    
    import android.util.SparseArray;
    import android.view.ViewGroup;
    
    import androidx.annotation.NonNull;
    import androidx.annotation.Nullable;
    import androidx.fragment.app.Fragment;
    import androidx.fragment.app.FragmentManager;
    import androidx.fragment.app.FragmentStatePagerAdapter;
    
    import java.util.ArrayList;
    import java.util.List;
    
    public class ViewPagerAdapter extends FragmentStatePagerAdapter {
    
        private SparseArray<Fragment> mFragmentList = new SparseArray<>();
        List<String> listTitle = new ArrayList<>();
    
        public ViewPagerAdapter(@NonNull FragmentManager fm, int behavior) {
            super(fm, behavior);
        }
    
        @NonNull
        @Override
        public Fragment getItem(int position) {
            return mFragmentList.get(position);
        }
    
        @Override
        public int getCount() {
            return mFragmentList.size();
        }
    
        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {
            return listTitle.get(position);
        }
    
        @NonNull
        @Override
        public Object instantiateItem(@NonNull ViewGroup container, int position) {
            Fragment fragment = ((Fragment) super.instantiateItem(container, position));
            mFragmentList.put(position, fragment);
            return fragment;
        }
    
        @Override
        public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
            mFragmentList.remove(position);
            super.destroyItem(container, position, object);
        }
    
        public void addFragment(int pos, Fragment frg, String title) {
            mFragmentList.put(pos, frg);
            listTitle.add(title);
        }
    
    }
    
    ```
   
    - DateFragment.java:
    
    ```java
    package com.template.dialogpicker;
    
    
    import android.os.Bundle;
    
    
    import android.util.Log;
    import android.view.LayoutInflater;
    import android.view.View;
    import android.view.ViewGroup;
    import android.widget.CalendarView;
    import android.widget.DatePicker;
    
    import androidx.annotation.NonNull;
    import androidx.annotation.Nullable;
    import androidx.fragment.app.Fragment;
    
    import java.text.SimpleDateFormat;
    import java.util.Calendar;
    import java.util.Date;
    import java.util.Locale;
    
    
    public class DateFragment extends Fragment {
    
        StringBuilder mDate;
    
        public DateFragment() {
            // Required empty public constructor
        }
    
        public static DateFragment newInstance() {
            DateFragment fragment = new DateFragment();
            return fragment;
        }
    
        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            mDate = new StringBuilder();
        }
    
        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            // Inflate the layout for this fragment
            return inflater.inflate(R.layout.fragment_date, container, false);
        }
    
        @Override
        public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
            super.onViewCreated(view, savedInstanceState);
            final DatePicker datePicker = view.findViewById(R.id.datePicker);
    
            final Calendar c = Calendar.getInstance();
            int year = c.get(Calendar.YEAR);
            int month = c.get(Calendar.MONTH);
            int day = c.get(Calendar.DAY_OF_MONTH);
            Date date = new Date();
            String format = "dd/MM/yyyy";
            final SimpleDateFormat formatter = new SimpleDateFormat(format, Locale.getDefault());
            mDate.append(formatter.format(date));
    
            datePicker.init(year, month, day, new DatePicker.OnDateChangedListener() {
                @Override
                public void onDateChanged(DatePicker datePicker, int y, int m, int dayOfMonth) {
                    c.set(y, m, dayOfMonth);
                    mDate = new StringBuilder();
                    mDate.append(formatter.format(c.getTime()));
                }
            });
        }
    
        public String getSelectedDate() {
            return mDate.toString();
        }
    }
    ```
    
    - fragment_date.xml:
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
      xmlns:tools="http://schemas.android.com/tools"
      android:layout_width="match_parent"
      android:layout_height="wrap_content"
      tools:context=".DateFragment">
    
      <DatePicker
          android:id="@+id/datePicker"
          android:datePickerMode="spinner"
          android:calendarViewShown="false"
          android:layout_width="match_parent"
          android:layout_height="wrap_content"/>
    
    </FrameLayout>
    ```
   
    - TimeFragment.java:
    
    ```java
    package com.template.dialogpicker;
    
    
    import android.os.Bundle;
    
    import androidx.annotation.NonNull;
    import androidx.annotation.Nullable;
    import androidx.fragment.app.Fragment;
    
    import android.util.Log;
    import android.view.LayoutInflater;
    import android.view.View;
    import android.view.ViewGroup;
    import android.widget.TimePicker;
    
    import java.text.SimpleDateFormat;
    import java.util.Calendar;
    import java.util.Locale;
    
    
    public class TimeFragment extends Fragment {
    
        StringBuilder mTime;
        TimePicker timePicker;
    
        public TimeFragment() {
            // Required empty public constructor
        }
    
        public static TimeFragment newInstance() {
            TimeFragment fragment = new TimeFragment();
            return fragment;
        }
    
        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            mTime = new StringBuilder();
        }
    
        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            // Inflate the layout for this fragment
            return inflater.inflate(R.layout.fragment_time, container, false);
        }
    
        @Override
        public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
            super.onViewCreated(view, savedInstanceState);
    
            timePicker = view.findViewById(R.id.timePicker);
    
            final Calendar c = Calendar.getInstance();
            timePicker.setCurrentHour(c.get(Calendar.HOUR_OF_DAY));
            timePicker.setCurrentMinute(c.get(Calendar.MINUTE));
            mTime.append(timePicker.getCurrentHour()).append(":").append(timePicker.getCurrentMinute());
            timePicker.setOnTimeChangedListener(new TimePicker.OnTimeChangedListener() {
                @Override
                public void onTimeChanged(TimePicker view, int selectedHour, int selectedMinute) {
                    mTime = new StringBuilder();
                    mTime.append(selectedHour).append(":").append(selectedMinute);
                }
            });
        }
    
        public String getSelectedDate() {
            return mTime.toString();
        }
    }
    
    ```
   
    - fragment_time.xml:
    
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        tools:context=".TimeFragment">
    
        <TimePicker
            android:id="@+id/timePicker"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:timePickerMode="spinner" />
    
    </FrameLayout>
    ```


End the result is:
<img src="/static/img/date_picker.png" width="20%" height="20%" />
<img src="/static/img/time_picker.png" width="20%" height="20%" />

You can checkout the full sample project from [here](https://github.com/huynguyennovem/Android-DialogPickerViewPager)

Happy Coding!
