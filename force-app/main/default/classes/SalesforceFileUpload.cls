public with sharing class SalesforceFileUpload implements FileUploadController  {
    
    
    @AuraEnabled
    public static Boolean uploadFile(Id parentId,String strfileName, String fileType, String fileContent){

        Attachment att = new Attachment();
        att.ParentId = parentId;
        att.Name = strfileName;
        att.Body=Blob.valueOf(fileContent);
        Insert att;

        return true;
    }
}
