@isTest
public with sharing class FileUploadControllerTest {
    
    @TestSetup
    static void makeData(){
        
        Account a = new Account();
        a.Name = 'Test';

        Insert a;
    }

    @IsTest
    static void withDefaultController(){
        
        Test.startTest();
        
        Account account = [Select Id From Account Where Name = 'Test'];
        string fileContent = 'M1A7Om0FDufnjtVgxlISyyKwl4DY4HeiaR0QR8n%2BNbJf7ejmRFDksrDPTGOa5vy9uRHtznnAxXZeK7h7jWXiysQUbuAMn3HoK5iWXcyKzlsccHNeFiZe8fS4b4bMxnhMZKqCDJycnita3g%2BVTuZSg5weDSMEl3DORHyvtU0BJWMgYZOx6H2%2Blc3OjpsW1ZGARQMkUkEP71ggK7eORUkSsswkbbt6YxitaCKPB3LtkbJznr9KynMERx7I4RHuCMgAzknP51atrmJ2Z42BVzjOentVObZldrY2njFaNq28ksr7kHBPO0Yx371xTRqpG9Zo0v3iu3Bye49q6O3iY%2FZsfeQqSDgEDNYFpHtCsGLHGOtdBaytLKvA8pOvNc01qEUdVYyuXWOIhucM3TAFdnYfPJGM%2FwAWDXCWuFdeMr3Oa7TS5d8RfaoJ6H1FZpDZ6FCSIkwUc8A46GuqsMMBhSm7setcLpUvmss';
        Id fileId = FileUploadController.uploadFileInChunks(account.Id, null, 'test.jpeg', 'image/jpeg', fileContent, '', true);

        System.assert(fileId != null);

        Test.stopTest();
        
    }

    @IsTest
    static void withOverrideController(){
        
        Test.startTest();
        Account account = [Select Id From Account Where Name = 'Test'];
        string fileContent = 'M1A7Om0FDufnjtVgxlISyyKwl4DY4HeiaR0QR8n%2BNbJf7ejmRFDksrDPTGOa5vy9uRHtznnAxXZeK7h7jWXiysQUbuAMn3HoK5iWXcyKzlsccHNeFiZe8fS4b4bMxnhMZKqCDJycnita3g%2BVTuZSg5weDSMEl3DORHyvtU0BJWMgYZOx6H2%2Blc3OjpsW1ZGARQMkUkEP71ggK7eORUkSsswkbbt6YxitaCKPB3LtkbJznr9KynMERx7I4RHuCMgAzknP51atrmJ2Z42BVzjOentVObZldrY2njFaNq28ksr7kHBPO0Yx371xTRqpG9Zo0v3iu3Bye49q6O3iY%2FZsfeQqSDgEDNYFpHtCsGLHGOtdBaytLKvA8pOvNc01qEUdVYyuXWOIhucM3TAFdnYfPJGM%2FwAWDXCWuFdeMr3Oa7TS5d8RfaoJ6H1FZpDZ6FCSIkwUc8A46GuqsMMBhSm7setcLpUvmss';
        Id fileId = FileUploadController.uploadFileInChunks(account.Id, 'SalesforceFileUpload', 'test.jpeg', 'image/jpeg', fileContent, '', true);

        System.assert(fileId != null);
        Test.stopTest();
        
    }
}
