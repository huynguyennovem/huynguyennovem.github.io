---
layout: post
title:  "Android Kotlin - Handle Delete permission in MediaStore"
date:   2020-10-16
excerpt: "How to handle Delete permission in MediaStore for single and multiple media on Android versions"
categories: [tutorial, android]
comments: true
tags: [tutorial, android, MediaStore]
---

**1. Handle delete single item in MediaStore**
- MediaStore supported `delete` method like this:

```kotlin

// In ViewModel class

private var _pendingDeleteImage: ImageEntity? = null
private val permissionForDelete = MutableLiveData<IntentSender?>()

fun deleteImage(imageEntity: ImageEntity) {
    viewModelScope.launch {
        imageEntity.contentUri?.let { uri ->
            try {
                val result = getApplication<Application>().contentResolver.delete(
                    uri,
                    "${MediaStore.Files.FileColumns._ID} == ?",
                    arrayOf(imageEntity.id.toString())
                )
            } catch (securityException: SecurityException) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val recoverableSecurityException = securityException as? RecoverableSecurityException ?: throw securityException
                    _pendingDeleteImage = imageEntity
                    permissionForDelete.postValue(recoverableSecurityException.userAction.actionIntent.intentSender)
                } else {
                    throw securityException
                }
            }
        }
    }
}

fun deletePendingItem() {
    _pendingDeleteImage?.let { image ->
        _pendingDeleteImage = null
        deleteImage(image)
    }
}

// In Fragment class

private val deleteIntentSender = registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
    if(result.resultCode == Activity.RESULT_OK) {
        viewModel.deletePendingItem()
    }
}

viewModel.permissionForDelete.observe(this, { intentSender ->
    intentSender?.let {
        deleteIntentSender.launch(IntentSenderRequest.Builder(it).build())
    }
})

```

- We will take a `SecurityException` and send it into Fragment for handling. 
- In the Fragment, a prompt may be shown for asking to grant permission:

    <img src="/static/img/delete_prompt_1_item.png" width="50%" height="50%" />

**2. Handle delete multiple items in MediaStore**

- For multipls items, there is a little change for Android R and above by create a `Delete request` for multiple uris:
> MediaStore.createDeleteRequest(getApplication<Application>().contentResolver, uris)


```kotlin

// In ViewModel class

private var _pendingDeleteItems: MutableList<ImageEntity>? = null
private val permissionForDelete = MutableLiveData<IntentSender?>()

fun deleteImages(imageEntities: MutableList<ImageEntity>) {
    viewModelScope.launch {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                val uris = imageEntities
                    .map { it.contentUri }
                    .toList()
                _pendingDeleteItems = imageEntities
                if (uris.isNotEmpty()) {
                    val pendingIntent = MediaStore.createDeleteRequest(getApplication<Application>().contentResolver, uris)
                    permissionForDelete.postValue(pendingIntent.intentSender)
                }
            } else {
                val listIds = imageEntities
                    .map { it.id.toString() }
                    .toTypedArray()
                val joinedIdsString = listIds.joinToString(",")
                val selection = "${MediaStore.Files.FileColumns._ID} IN ($joinedIdsString)"
                getApplication<Application>().contentResolver.delete(
                    uri,
                    selection,
                    null
                )
            }
        } catch (securityException: SecurityException) {
            securityException.printStackTrace()
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val recoverableSecurityException =
                    securityException as? RecoverableSecurityException
                        ?: throw securityException
                _pendingDeleteItems = imageEntities
                permissionForDelete.postValue(
                    recoverableSecurityException.userAction.actionIntent.intentSender
                )
            } else {
                throw securityException
            }
        }
    }
}

fun deletePendingItems() {
    _pendingDeleteItems?.let {
        _pendingDeleteItems = null
    }
}


// In Fragment class

private val deleteIntentSender = registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
    if(result.resultCode == Activity.RESULT_OK) {
        viewModel.deletePendingItems()
    }
}

viewModel.permissionForDelete.observe(this, { intentSender ->
    intentSender?.let {
        deleteIntentSender.launch(IntentSenderRequest.Builder(it).build())
    }
})
```

The result:
    <img src="/static/img/delete_prompt_many_item.png" width="50%" height="50%" />

=> Check the gist if you're more familiar: [https://gist.github.com/huynguyennovem/42278c4ab3427783446518351547d93a](https://gist.github.com/huynguyennovem/42278c4ab3427783446518351547d93a)

### Happy coding!
