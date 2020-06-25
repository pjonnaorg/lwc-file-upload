public with sharing  class SalesforceFileUpload  implements IFileUpload {
    


    public Id uploadFileInChunks(Id parentId, String fileName, String contentType, String fileContent, String fileId, Boolean finalChunk) {

        if (fileId == '' || fileId == null) {
            fileId = saveTheFile(parentId, fileName, fileContent, contentType);
        } else {
            appendToFile(fileId, fileContent);
        }
 
        return Id.valueOf(fileId);
    }

    @testvisible
    private  Id saveTheFile(Id parentId, String fileName, String base64Data, String contentType) {
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');
 
        Attachment oAttachment = new Attachment();
        oAttachment.parentId = parentId;
 
        oAttachment.Body = EncodingUtil.base64Decode(base64Data);
        oAttachment.Name = fileName;
        oAttachment.ContentType = contentType;
 
        insert oAttachment;
 
        return oAttachment.Id;
    }

    @testvisible
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
