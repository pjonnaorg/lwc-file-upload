public with sharing  class FileUploadController {
    
    @AuraEnabled
    public static  Boolean uploadFile(Id parentId,String strfileName, String fileType, String fileContent){

        return true;
    }
}
