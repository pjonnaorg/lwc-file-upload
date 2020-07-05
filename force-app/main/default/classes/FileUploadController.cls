public with sharing  class FileUploadController {


    @AuraEnabled
    public static Id uploadFileInChunks(Id parentId, String controllerName, String fileName, String contentType, String fileContent, String fileId, Boolean finalChunk) {
        
        System.debug('fileName:'+ fileName);
        System.debug('parentId:'+ parentId);
        System.debug('controllerName:'+ controllerName);
        System.debug('contentType:'+ contentType);
        System.debug('fileContent:'+ fileContent);
        System.debug('fileId:'+ fileId);
        System.debug('finalChunk:'+ finalChunk);
	
		string debugLog = '';
        
        try{

            String interfaceName = 'fupload.IFileUpload';
			ApexClass[] classes = (ApexClass[])[FIND :interfaceName 
										IN ALL FIELDS
										RETURNING ApexClass(Id, Name)][0];

			for (ApexClass fileUploadClass : classes) {
								
				debugLog += String.format('file name: {0} {1}', new String[]{fileUploadClass.Name, '\n'}) ;
				
				if(fileUploadClass.Name != 'fupload.SalesforceFileUpload' && fileUploadClass.Name != 'fupload.IFileUpload' && fileUploadClass.Name != 'fupload.FileUploadController'){
					
					debugLog += String.format('selected file name: {0} {1}', new String[]{fileUploadClass.Name, '\n'}) ;
					
					Type t = Type.forName(fileUploadClass.Name);
					
					if(t != null && Type.forName(fileUploadClass.Name).newInstance() instanceOf fupload.IFileUpload){
						debugLog += String.format('final file name: {0} {1}', new String[]{fileUploadClass.Name, '\n'}) ;
						controllerName = fileUploadClass.Name;
						break;
					}               
				}
			}
										
			if(controllerName != null){
				debugLog += String.format('Inside controller init: {0} {1}', new String[]{controllerName, '\n'}) ;
				fupload.IFileUpload uploader = (fupload.IFileUpload)Type.forName(controllerName).newInstance();
				//createNote(parentId, debugLog);
				return uploader.uploadFileInChunks(parentId, fileName, contentType, fileContent, fileId, finalChunk);
			}
			else {     
				debugLog += String.format('default controller init: {0} {1}', new String[]{'SalesforceFileUpload', '\n'}) ;       
				fupload.IFileUpload uploader = (fupload.IFileUpload)Type.forName('SalesforceFileUpload').newInstance();
				//createNote(parentId, debugLog);
				return uploader.uploadFileInChunks(parentId, fileName, contentType, fileContent, fileId, finalChunk);
			}
        
        } catch (Exception e){
			debugLog += String.format('exception message: {0} {1}', new String[]{e.getMessage(), '\n'}) ;
			debugLog += String.format('exception stacktrace: {0} {1}', new String[]{e.getStackTraceString(), '\n'}) ;
        }

		//createNote(parentId, debugLog);

		return null;

	}
	
	// private static void createNote(string parentId, string content){

	// 	Note note = new Note();
	// 	note.ParentId = parentId;
	// 	note.Body = content;
	// 	note.Title = 'Debug Log';

	// 	Insert note;
	// }
}
