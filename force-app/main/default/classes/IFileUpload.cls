public  interface IFileUpload {
    

    Id uploadFileInChunks(Id parentId, String fileName, String contentType, String fileContent, String fileId);

}
