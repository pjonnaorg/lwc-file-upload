# LWC Drag & drop File Uploader

Simple & easy to use drag and drog lightning web component 

## Features

1. Supports file size up to 4.5 MB
2. Uploads in chunks 
3. Supports overrides for basic UI text, custom apex controller, chunk size and maximum file size
4. Support file upload into custom stores other then salesforce  

## How to use it

Put this in any LWC html file
`<c-file-upload parent-record-id={recordId}></c-file-upload>`

#### required parameters

1. `parent-record-id` record id of the object where file has to uploaded into

#### Optional parameters
1. `title` default is 'Upload' 
2. `controller-name` name  of Custom Apex Controller that implements IFileUpload. If not this component will be uploaded as attachments into salesforce
3. `chunk-size` default chunk size 750000 (750 kb)



#### Example `Custom Apex Controller` looks like this 



```java
public with sharing  class CustomFileUpload implements IFileUpload {
    
    /***
    @parentId - id of the sobject,
    @fileName - name of the file,
    @contentType - type of the file,
    @fileContent - content of the file,
    @fileId - if the upload is done in chunks, second request will contain the id of the first request response. first request will be always be '' or null
    @finalChunk - indicator of the last or final request if the upload is happening in batch/chunks
    @Id - output - file id of the source system that is unique to the file
    ***/
    public Id uploadFileInChunks(Id parentId, String fileName, String contentType, String fileContent, String fileId, Boolean finalChunk) {
        
        \\TODO 
        
    }

}
```

