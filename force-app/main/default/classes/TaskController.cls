public with sharing class TaskController{
    
    // @AuraEnabled
    // public static  List<task__c> getTasks(Integer pageSize, Integer pageNumber){
    //     Integer offset = (pageNumber - 1) * pageSize;
    //     List<task__c> taskList = new List<task__c>();
    //     return [SELECT Name, Project__r.name,Project__c,Assigner__r.name, Status__c, Start_Date__c, End_Date__c, Duration__c  FROM Task__c LIMIT :pageSize OFFSET :offset];
        
        
    // }

    @AuraEnabled
    public static  void deleteTask(String delid){
        System.debug(delid);
        List<Task__c> taskList = new List<Task__c>(); 
        taskList = [SELECT Id FROM Task__c WHERE Id = :delid];
        delete taskList;
  
    }

    @AuraEnabled
    public static List<Task__c> fetchTask(String searchKeyWord,Integer pageSize, Integer pageNumber){

        System.debug('---pageNumber---');
        System.debug(pageNumber);
        Integer totalRecord = [SELECT count() From Task__c];  
        System.debug('---totalRecord---');
        System.debug(totalRecord);    
        Integer offset = (pageNumber - 1) * pageSize;
        
        System.debug('---offset---');
        System.debug(offset);
        Integer totalPage = (Integer)Math.ceil(totalRecord/pageSize);     
        System.debug('---totalpage---');
        System.debug(totalPage);
        String searchKey = '%'+ searchKeyWord + '%';
        if(pageNumber < totalPage){
            pageNumber = totalPage;
        }       
        List <Task__c> taskList = new List <Task__c> ();              
   
                taskList = [SELECT Id,Name, Project__r.name, Duration__c,
                                       Assigner__r.name, Status__c, Start_Date__c, End_Date__c  
                                       FROM Task__c LIMIT :pageSize OFFSET :offset];                                     
                return taskList;              
     
    }
    
    public class SimpleResponse {      
        @AuraEnabled public List<Task__c>  returnList { get; set; }
        @AuraEnabled public Integer totalPage { get; set; }        
        // @AuraEnabled public Integer pageSize {get; set;}
        // @AuraEnabled public Integer pageNumber {get; set;}
        // public SimpleResponse(){      
        // }
    }    

    // @AuraEnabled
    // public static List<Task__c> searchTasks( String searchTerm ) {
    //     List<Task__c> listTasks = getTaskHelper(searchTerm);
    //     return listTasks;
    // }
    @AuraEnabled
    public static List<Task__c> searchTasks(String searchTerm){
        List<Task__c> result = new List<Task__c>();
        if ( String.isNotBlank( searchTerm ) ) {
            String searchLike= '%'+searchTerm+'%';
             result = [SELECT Name, Project__r.name,Project__c,Assigner__r.name, Status__c, Start_Date__c, End_Date__c, Duration__c  FROM Task__c WHERE  Name LIKE :searchLike]  ;                   
        }
        if (String.isBlank(searchTerm)) {
            result = [SELECT Name, Project__r.name,Project__c,Assigner__r.name, Status__c, Start_Date__c, End_Date__c, Duration__c  FROM Task__c ]  ;  
        }

        return result;
    }

    @AuraEnabled
    public static List<Task__c> filterTasks(Integer option){
        System.debug(option);
         List<Task__c> result = new List<Task__c>();
         if (option == 1) {
               return [select Name from Task__c where Start_Date__c = LAST_N_WEEKS:1]; 
         }
         if (option == 2) {
            return  [select Name from Task__c where Start_Date__c = LAST_MONTH]; 
         }
        return result;
    }

    
    
}