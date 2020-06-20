import { LightningElement, api, track } from 'lwc';
import { isNarrow, proto, isBase } from './fileUploadUtil';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/FileUploadController.uploadFile';
//import displayUploadedFiles from '@salesforce/apex/AWSFileUploadController.displayUploadedFiles'; 

export default class FileUpload extends LightningElement {

    @api title;
    @api recordId; //get the recordId for which files will be attached
    @api iconName;

    @track isActive = false;
    @track privateVariant = 'base';

    selectedFilesToUpload = []; //store selected files
    @track showSpinner = false; //used for when to show spinner
    @track fileName; //to display the selected file name
    @track tableData; //to display the uploaded file and link to AWS
    
    file; //holding file instance
    myFile;
    fileType;//holding file type
    fileReaderObj;
    base64FileData;
    files;

    constructor() {
        super();
        console.log('constructor');
    }

    connectedCallback() {

        if (!this.title) {
            this.title = 'Upload Files';
        }

    };

    renderedCallback() {
        this.registerEvents();
    };

    get dropZoneContextClass() {
        console.log(this.isActive);
        return this.isActive ? 'active': 'inactive';
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

    // get the file name from the user's selection
    handleSelectedFiles = (event) => {
        

        if (event.target.files.length > 0) {
            this.selectedFilesToUpload = event.target.files;
            this.fileName = this.selectedFilesToUpload[0].name;
            this.fileType = this.selectedFilesToUpload[0].type;
            console.log('fileName=' + this.fileName);
            console.log('fileType=' + this.fileType);
        }
    };

    handleFileUpload = (event) => {
        this.isActive = true;
        if (this.selectedFilesToUpload.length > 0) {
            this.showSpinner = true;

            this.file = this.selectedFilesToUpload[0];
            //create an intance of File
            this.fileReaderObj = new FileReader();

            //this callback function in for fileReaderObj.readAsDataURL
            this.fileReaderObj.onloadend = (() => {
                //get the uploaded file in base64 format
                let fileContents = this.fileReaderObj.result;
                fileContents = fileContents.substr(fileContents.indexOf(',') + 1)

                //read the file chunkwise
                let sliceSize = 1024;
                let byteCharacters = atob(fileContents);
                let bytesLength = byteCharacters.length;
                let slicesCount = Math.ceil(bytesLength / sliceSize);
                let byteArrays = new Array(slicesCount);
                for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                    let begin = sliceIndex * sliceSize;
                    let end = Math.min(begin + sliceSize, bytesLength);
                    let bytes = new Array(end - begin);
                    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                        bytes[i] = byteCharacters[offset].charCodeAt(0);
                    }
                    byteArrays[sliceIndex] = new Uint8Array(bytes);
                }

                //from arraybuffer create a File instance
                this.myFile = new File(byteArrays, this.fileName, { type: this.fileType });

                //callback for final base64 String format
                let reader = new FileReader();
                reader.onloadend = (() => {
                    let base64data = reader.result;
                    this.base64FileData = base64data.substr(base64data.indexOf(',') + 1);
                    this.fileUpload();
                });
                reader.readAsDataURL(this.myFile);
            });
            this.fileReaderObj.readAsDataURL(this.file);
        }
        else {
            this.fileName = 'Please select a file to upload!';
        }
    };

    //this method calls Apex's controller to upload file in AWS
    fileUpload = () => {

        //implicit call to apex
        uploadFile({
            parentId: this.recordId,
            strfileName: this.file.name,
            fileType: this.file.type,
            fileContent: encodeURIComponent(this.base64FileData)
        }).then(result => {
                console.log('Upload result = ' + result);
                this.fileName = this.fileName + ' - Uploaded Successfully';
                //call to show uploaded files
                //this.getUploadedFiles(); 
                this.showSpinner = false;
                // Showing Success message after uploading
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!!',
                        message: this.file.name + ' - Uploaded Successfully!!!',
                        variant: 'success',
                    }),
                );
            }).catch(error => {
                // Error to show during upload
                window.console.log(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error in uploading File',
                        message: error.message,
                        variant: 'error',
                    })
                );
                this.showSpinner = false;
            });
    };

    registerEvents2 = () => {

        //let dropArea = this.template.querySelector('[data-id="droparea"]').innerHTML;
        console.log(this.template);
        //console.log(dropArea);

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.template.addEventListener(eventName, this.preventDefaults)
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.template.addEventListener(eventName, this.highlight)
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.template.addEventListener(eventName, this.unhighlight)
        });

        this.template.addEventListener('drop', this.handleDrop);

    };

    registerEvents = () => {

        const dropArea = this.template.querySelector('[data-id="droparea"]');
        console.log(dropArea);

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

    highlight(e) {
        this.isActive = true;
        console.log("inside hightlight");
    };

    unhighlight(e) {
        //this.isActive = false;
        //console.log("inside unhighlight");
    };

    handleDrop = (e) => {
        this.isActive = true;
        console.log(this.dropZoneContextClass());
        //this.template.querySelector('[data-id="dropZoneContextId"]').className='active';
        console.log("inside hightlight");
        let dt = e.dataTransfer;
        this.files = dt.files;
        this.processAllFiles();
    };

    preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    processAllFiles = () => {

        console.log(this.files);
        this.selectedFilesToUpload = this.files;
        this.fileName = this.selectedFilesToUpload[0].name;
        this.fileType = this.selectedFilesToUpload[0].type;
        
    };

}