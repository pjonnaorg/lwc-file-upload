public with sharing class SalesforceFileUpload   {
    
    
    @AuraEnabled
    public static Boolean uploadFile(Id parentId,String strfileName, String fileType, String fileContent){

        Attachment att = new Attachment();
        att.ParentId = parentId;
        att.Name = strfileName;
        att.ContentType = fileType;
        att.Body=  EncodingUtil.base64Decode(EncodingUtil.urlDecode(fileContent, 'UTF-8'));
        Insert att;

        return true;
    }
}
