import { LightningElement, api, track } from 'lwc';
import { isNarrow, proto, isBase } from './fileUploadUtil';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/FileUploadController.uploadFile';
import uploadFileInChunks from '@salesforce/apex/FileUploadController.uploadFileInChunks';
//import displayUploadedFiles from '@salesforce/apex/AWSFileUploadController.displayUploadedFiles'; 

export default class FileUpload extends LightningElement {

    @api title;
    @api subTitle;
    @api recordId; //get the recordId for which files will be attached
    @api parentRecordId;
    @api iconName;
    @api controllerName;
    @api maxFileSize ; //Max file size 4.5 MB
    @api chunkSize;      //Chunk Max size 750Kb  

    dragZoneActive = false;
    @track privateVariant = 'base';

    @track selectedFilesToUpload = []; //store selected files
    @track showSpinner = false; //used for when to show spinner


    errorMessage;
    eventListenersAdded;

    constructor() {
        super();
    }

    connectedCallback() {

        if (!this.title) {
            this.title = 'Upload Files';
        }

        if(!this.subTitle){
            this.subTitle = 'Choose or drag files from your device to upload';
        }

        if(!this.maxFileSize){
            this.maxFileSize = 4500000;
        }

        if(!this.chunkSize){
            this.chunkSize = 750000;
        }

        console.log(this.parentRecordId);
        if(this.parentRecordId){
            this.recordId = this.parentRecordId;
        }

    };

    renderedCallback() {

        if (this.eventListenersAdded) {
            return;
        }

        this.eventListenersAdded = true;
        this.registerEvents();
    };

    get dropZoneContextClass() {
        return this.dragZoneActive ? 'active' : 'inactive';
    }

    get computedWrapperClassNames() {

        var config = 'slds-card';
        if (typeof config === 'string') {
            const key = config;
            config = {};
            config[key] = true;
        }
        var obj = Object.assign(Object.create(proto), config);
        obj.add({
            'slds-card_narrow': isNarrow(this.privateVariant)
        });
    };

    handleOpenDialog = (event) => {
        this.template.querySelector('[data-id="ChooseFiles"]').click();
    }

    // get the file name from the user's selection
    handleSelectedFiles = (event) => {

        let files = this.template.querySelector('[data-id="ChooseFiles"]').files;
        this.processAllFiles(files);
    };

    handleFileUpload = (event) => {

        if (this.selectedFilesToUpload.length > 0) {
            this.errorMessage = null;
            this.showSpinner = true;

            this.selectedFilesToUpload.forEach(file => {
                if( file.stateIconText == "upload" ||  file.stateIconText == "error"){
                    this.processSingleFile(file);
                }   
            });
        }
        else {
            this.errorMessage = 'Please select a file to upload!';
        }
    };

    handleCancel = (event) => {
        this.errorMessage = null;
        this.selectedFilesToUpload = [];
        this.showSpinner = false;
    }

    processSingleFile = (file) => {

        console.log( `File size cannot exceed ${this.maxFileSize} bytes. Selected file size: ${file.size}`);
        if (file.size > this.maxFileSize) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'File size exceeded',
                    message: `File size cannot exceed ${this.maxFileSize} bytes. Selected file size: ${file.size}`,
                    variant: 'error',
                })
            );
            this.updateFileStatus(file, false);
            return;
        }

        //create an intance of File
        let fileReaderObj = new FileReader();
        fileReaderObj.onloadend = (() => {

            let fileContents = fileReaderObj.result;
            let base64 = 'base64,';
            let dataStart = fileContents.indexOf(base64) + base64.length;

            fileContents = fileContents.substring(dataStart);
            this.fileUpload(file, fileContents);

        });
        fileReaderObj.readAsDataURL(file);

    };

    //this method calls Apex's controller to upload file in AWS
    fileUpload = (file, fileContents) => {

        // set a default size or startpostiton as 0 
        let startPosition = 0;
        // calculate the end size or endPostion using Math.min() function which is return the min. value   
        let endPosition = Math.min(fileContents.length, startPosition + this.chunkSize);

        let isFinalChunk = fileContents.length == endPosition ? true: false;

        // start with the initial chunk, and set the attachId(last parameter)is null in begin
        this.fileUploadInChunks(file, fileContents, startPosition, endPosition, '',isFinalChunk);
    };

    fileUploadInChunks = (file, fileContent, startPosition, endPosition, salesforceFileId, finalChunk) => {

        let getchunk = fileContent.substring(startPosition, endPosition);
        //implicit call to apex
        uploadFileInChunks({
            parentId: this.recordId,
            controllerName: this.controllerName,
            fileName: file.name,
            contentType: file.type,
            fileContent: encodeURIComponent(getchunk),
            fileId: salesforceFileId,
            finalChunk: finalChunk
        }).then(result => {
            console.log(result);
            salesforceFileId = result;
            startPosition = endPosition;
            endPosition = Math.min(fileContent.length, startPosition + this.chunkSize);
            let isFinalChunk = fileContent.length == endPosition ? true: false;
            if (startPosition < endPosition) {
                this.fileUploadInChunks(file, fileContent, startPosition, endPosition, salesforceFileId, isFinalChunk);
            } else {
                this.updateFileStatus(file, true);
                // Showing Success message after uploading
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!!',
                        message: file.name + ' - Uploaded Successfully!!!',
                        variant: 'success',
                    }),
                );
            }
        }).catch(error => {
            // Error to show during upload
            window.console.log(error);
            console.log(error.message);
            this.updateFileStatus(file, false);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error in uploading File',
                    message: error.message,
                    variant: 'error',
                })
            );
        });
    }


    fileUploadInChunksOld = (file, base64FileData, startPosition, endPosition, salesforceFileId) => {

        //implicit call to apex
        uploadFile({
            parentId: this.recordId,
            strfileName: file.name,
            fileType: file.type,
            fileContent: encodeURIComponent(base64FileData)
        }).then(result => {
            console.log('Upload result = ' + result);
            this.updateFileStatus(file, true);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: file.name + ' - Uploaded Successfully!!!',
                    variant: 'success',
                }),
            );
        }).catch(error => {
            window.console.log(error);
            this.updateFileStatus(file, false);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error in uploading File',
                    message: error.message,
                    variant: 'error',
                })
            );
        });
    }

    updateFileStatus = (file, completed) => {

        let workInProgress = false;
        this.selectedFilesToUpload.forEach(item => {

            if (item.name == file.name) {
                item.stateIconClass = completed ? "utility:success" : "utility:error";
                item.stateIconText = completed ? 'success' : 'error';
            }

            if(item.stateIconText == 'upload'){
                workInProgress = true;
            }

        });

        this.showSpinner = workInProgress ? true: false;

        //lwc track needs array push or reset to track property changes
        let temp = this.selectedFilesToUpload;
        this.selectedFilesToUpload = [];
        this.selectedFilesToUpload = temp;
    }

    registerEvents = () => {

        const dropArea = this.template.querySelector('[data-id="droparea"]');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.preventDefaults)
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.highlight);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, this.unhighlight);
        });

        dropArea.addEventListener('drop', this.handleDrop);

    };

    highlight = (e) => {
        this.dragZoneActive = true;
    };

    unhighlight = (e) => {
        this.dragZoneActive = false;
    };

    handleDrop = (e) => {
        let dt = e.dataTransfer;
        this.processAllFiles(dt.files);
    };

    preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    processAllFiles = (files) => {

        let fileBuffer = [];
        Array.prototype.push.apply(fileBuffer, files);
        console.log(fileBuffer);
        fileBuffer.forEach(item => {

            let file = item;
            file.stateIconClass = 'utility:upload';
            file.stateIconText = 'upload';
            this.selectedFilesToUpload.push(file);
        });

    };

}