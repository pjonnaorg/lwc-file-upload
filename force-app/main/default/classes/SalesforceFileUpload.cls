public with sharing  class SalesforceFileUpload  implements IFileUpload {
    
    
    public Boolean uploadFile(Id parentId,String strfileName, String fileType, String fileContent){

        Attachment att = new Attachment();
        att.ParentId = parentId;
        att.Name = strfileName;
        att.ContentType = fileType;
        att.Body=  EncodingUtil.base64Decode(EncodingUtil.urlDecode(fileContent, 'UTF-8'));
        Insert att;

        return true;
    }

    public Id uploadFileInChunks(Id parentId, String fileName, String contentType, String fileContent, String fileId) {

        if (fileId == '' || fileId == null) {
            fileId = saveTheFile(parentId, fileName, fileContent, contentType);
        } else {
            appendToFile(fileId, fileContent);
        }
 
        return Id.valueOf(fileId);
    }

    public  Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
 
        Attachment oAttachment = new Attachment();
        oAttachment.parentId = parentId;
 
        oAttachment.Body = EncodingUtil.base64Decode(base64Data);
        oAttachment.Name = fileName;
        oAttachment.ContentType = contentType;
 
        insert oAttachment;
 
        return oAttachment.Id;
    }

    private  void appendToFile(Id fileId, String base64Data) {
        
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
