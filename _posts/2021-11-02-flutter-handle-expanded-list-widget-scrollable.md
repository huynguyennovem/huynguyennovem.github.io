---
layout: post
title:  "Handle expanded list widgets that is scrollable"
date:   2021-11-02 12:00:00
excerpt: "How to handle typical overflow error for expanded list widgets"
categories: [flutter]
comments: true
tags: [flutter]
---

Normally, you may get trouble when handling list of widgets that can be expandable and scrollable also (once keyboard shows up). Let's see some quickly solutions here.

For example, I have a chat screen here. In case there is a list of messages wrapped by listview, it's fine because listview will take all spaces and scrollable when the keyboard shows up.

<img src="/static/img/chat_screen.png" width="50%" height="50%" />

But when there are widgets represent for empty chat (a column contains some widgets as example), the typical overflow error is occured, like this:

<img src="/static/img/chat_screen_bugmentionlayout.png" width="50%" height="50%" />

So, what's going wrong here? Sorry I can not paste detail source code here because it's quite complicated widget tree. But in general, the empty message is an independence widget and it looks like this:

```dart
Expanded(
  child: Column(
    children: [
      Container(
        width: 50.0,
        height: 50.0,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Theme.of(context).colorScheme.primary,
        ),
        alignment: Alignment.center,
        child: SizedBox(
          height: 32,
          width: 32,
          child: Image.asset(
            imageTwake,
            color: Theme.of(context).colorScheme.surface,
          ),
        ),
      ),
      AutoSizeText(
        AppLocalizations.of(context)!.messageLoadError,
        minFontSize: 12.0,
        maxFontSize: 15.0,
        maxLines: 15,
        textAlign: TextAlign.center,
        softWrap: true,
        style: Theme.of(context)
            .textTheme
            .headline1!
            .copyWith(fontWeight: FontWeight.w600),
      ),
      Spacer(),
    ],
  ),
)
```

But what I can do now is update to empty message section so that it is most expandable in height and scrollable when the keyboard shows up.

- Solution one: Use `Listview`:

```dart
Flexible(
  child: ListView(
    padding: const EdgeInsets.symmetric(horizontal: 20.0),
    children: [
      Container(
        width: 50.0,
        height: 50.0,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Theme.of(context).colorScheme.primary,
        ),
        alignment: Alignment.center,
        child: SizedBox(
          height: 32,
          width: 32,
          child: Image.asset(
            imageTwake,
            color: Theme.of(context).colorScheme.surface,
          ),
        ),
      ),
      AutoSizeText(
        AppLocalizations.of(context)!.messageLoadError,
        minFontSize: 12.0,
        maxFontSize: 15.0,
        maxLines: 15,
        textAlign: TextAlign.center,
        softWrap: true,
        style: Theme.of(context)
            .textTheme
            .headline1!
            .copyWith(fontWeight: FontWeight.w600),
      ),
    ],
  ),
);
```

- Solution two: Use `SingleChildScrollView` combines with `BoxConstraints`:

```dart
Flexible(
  child: LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        return SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight),
            child: Column(
                children: [
                  Container(
                    width: 50.0,
                    height: 50.0,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    alignment: Alignment.center,
                    child: SizedBox(
                      height: 32,
                      width: 32,
                      child: Image.asset(
                        imageTwake,
                        color: Theme.of(context).colorScheme.surface,
                      ),
                    ),
                  ),
                  AutoSizeText(
                    AppLocalizations.of(context)!.messageLoadError,
                    minFontSize: 12.0,
                    maxFontSize: 15.0,
                    maxLines: 15,
                    textAlign: TextAlign.center,
                    softWrap: true,
                    style: Theme.of(context)
                        .textTheme
                        .headline1!
                        .copyWith(fontWeight: FontWeight.w600),
                  ),
                ],
              ),
          ),
        );
      },
    ),
);
```

And now when the keyboard shows up, no overflow anymore :)

  <img src="/static/img/chat_screen_fixed.png" width="50%" height="50%" />

Note: Even though may be we have a better solution for this kind of layout (using Stack instead for eg). But in this tutorial, I only focus on `Expanded list widgets scrollable`. So, just forget other things!

**Happy coding!**