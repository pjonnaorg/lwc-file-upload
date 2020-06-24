import { createElement } from 'lwc';
import fileUpload from 'c/fileUpload';

describe('file-upload', () => {

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('verify the override title', () => {
        // Create element
        const element = createElement('c-file-upload', {
            is: fileUpload
        });
        element.title = "My Upload";
        document.body.appendChild(element);

        // Verify displayed greeting
        const headerTitle = element.shadowRoot.querySelector('h2[class="slds-text-heading_medium"]');

        expect(headerTitle.textContent).toBe(element.title);
    });

});