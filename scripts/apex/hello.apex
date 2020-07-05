// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

string tempvar = 'Enter_your_name_here';
System.debug('Hello World!');
System.debug('My name is ' + tempvar);


String interfaceName = 'IFileUpload';
ApexClass[] classes = (ApexClass[])[FIND :interfaceName 
                            IN ALL FIELDS
                            RETURNING ApexClass(Id, Name)][0];

System.debug('classes count:'+ classes.size());
for (ApexClass fileUploadClass : classes) {
    System.debug('classes name:'+ fileUploadClass.Name);
    if(fileUploadClass.Name != 'SalesforceFileUpload' && fileUploadClass.Name != 'IFileUpload' && fileUploadClass.Name != 'FileUploadController'){
        if(Type.forName(fileUploadClass.Name).newInstance() instanceOf IFileUpload) {
             System.debug('FINAL classes name:'+ fileUploadClass.Name);
            String controllerName = fileUploadClass.Name;
        }                
    }
}

system.debug('check:'+ Type.forName('TestManagedPackage').newInstance());
system.debug('check2:'+ Type.forName('TestManagedPackage').newInstance() instanceOf fupload.IFileUpload);
