import { LightningElement, track, api } from 'lwc';
import { file } from './file';

export default class FileList extends LightningElement {

    @api files = [{ name: 'test1.jpeg', id: 123, url: 'test1.com', contentType: 'jpeg' },
    { name: 'test2.jpeg', id: 223, url: 'test2.com', contentType: 'jpeg' }];

    activeFileName;

    isModalOpen = false;

    get filesCount(){

        return this.files.length;
    };

    constructor() {
        super();
    }

    openFile = (event) => {

        console.log(event.target);
        console.log(event.target.name);
        this.isModalOpen = true;
        let file = this.files.filter(function(item) {

            if(item.name == event.target.name){
                return item;
            }

        });

        let fileReaderObj = new FileReader();
        fileReaderObj.onloadend = (() => {

            let fileContents = fileReaderObj.result;
            this.template.querySelector('[data-id="img-file-output"]').src =  fileContents;

        });
        fileReaderObj.readAsDataURL(file[0]);
        this.activeFileName = file[0].name;
        
    }

    closeModal = () => {
        this.isModalOpen = false;
    }
}