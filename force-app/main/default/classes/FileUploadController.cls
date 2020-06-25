public with sharing  class FileUploadController {


    @AuraEnabled
    public static Id uploadFileInChunks(Id parentId, String controllerName, String fileName, String contentType, String fileContent, String fileId, Boolean finalChunk) {
        
        System.debug('fileName:'+ fileName);
        System.debug('parentId:'+ parentId);
        System.debug('controllerName:'+ controllerName);
        System.debug('contentType:'+ contentType);
        System.debug('fileContent:'+ fileContent);
        System.debug('fileId:'+ fileId);
        System.debug('IFileUpload:'+ (IFileUpload)Type.forName('Salesforce'));
        System.debug('finalChunk:'+ finalChunk);
    
        if(controllerName != null){
            IFileUpload uploader = (IFileUpload)Type.forName(controllerName).newInstance();
            return uploader.uploadFileInChunks(parentId, fileName, contentType, fileContent, fileId, finalChunk);
        }
        else {            
            IFileUpload uploader = (IFileUpload)Type.forName('SalesforceFileUpload').newInstance();
            return uploader.uploadFileInChunks(parentId, fileName, contentType, fileContent, fileId, finalChunk);
        }

    }
}
