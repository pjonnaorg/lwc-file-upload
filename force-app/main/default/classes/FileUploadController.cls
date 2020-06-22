public with sharing  class FileUploadController {
    
    @AuraEnabled
    public static  Boolean uploadFile(Id parentId,String strfileName, String fileType, String fileContent){

   
        return SalesforceFileUpload.uploadFile(parentId, strfileName, fileType, fileContent);
    }

    @AuraEnabled
    public static Id uploadFileInChunk(Id parentId, String fileName, String contentType, String fileContent, String fileId) {
        
        System.debug('fileName:'+ fileName);
        System.debug('contentType:'+ contentType);
        System.debug('fileContent:'+ fileContent);
        System.debug('fileId:'+ fileId);
        // check if fileId id ''(Always blank in first chunk), then call the saveTheFile method,
        //  which is save the check data and return the attachemnt Id after insert, 
        //  next time (in else) we are call the appentTOFile() method
        //   for update the attachment with reamins chunks   
        if (fileId == '' || fileId == null) {
            fileId = saveTheFile(parentId, fileName, fileContent, contentType);
        } else {
            appendToFile(fileId, fileContent);
        }
 
        return Id.valueOf(fileId);
    }

    public static Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
 
        Attachment oAttachment = new Attachment();
        oAttachment.parentId = parentId;
 
        oAttachment.Body = EncodingUtil.base64Decode(base64Data);
        oAttachment.Name = fileName;
        oAttachment.ContentType = contentType;
 
        insert oAttachment;
 
        return oAttachment.Id;
    }

    private static void appendToFile(Id fileId, String base64Data) {
        
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
 
        Attachment a = [
            SELECT Id, Body
            FROM Attachment
            WHERE Id =: fileId
        ];
 
        String existingBody = EncodingUtil.base64Encode(a.Body);
 
        a.Body = EncodingUtil.base64Decode(existingBody + base64Data);
 
        update a;
    }
}
