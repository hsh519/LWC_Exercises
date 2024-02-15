public with sharing class StudentBrowser {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getStudents(String instructorId, String courseDeliveryId){
        String query = '';
		String scheckStatus = 'Status__c IN (\'Enrolled\', \'Completed\') ';
        String recordTypeFilter = ' RecordType.Name = \'Technician\' ';

		//Base query
        query += 'SELECT Id, Name, Email, Phone, Title, Account.Name, PhotoUrl FROM Contact ';
		if (String.isNotEmpty(courseDeliveryId)) {
            //Add delivery Id
			query += 'WHERE Id IN (SELECT Student__c FROM course_attendee__c WHERE course_delivery__c = :courseDeliveryId AND ' + scheckStatus + ') AND ' + recordTypeFilter + ' ';
		} else if (String.isNotEmpty(instructorId)) {
            //Add instructor Id
            query += 'WHERE Id IN (SELECT Student__c FROM course_attendee__c WHERE course_delivery__r.Instructor__c = :instructorId AND ' + scheckStatus + ') AND ' + recordTypeFilter + ' ';
        } else if (String.isNotEmpty(recordTypeFilter)) {
			//Only record type filter for valid RecordType
            query += 'WHERE ' + recordTypeFilter + ' ' ;
        }
		query += 'WITH SECURITY_ENFORCED ';
		query += 'ORDER BY Name';
		
        System.debug(query);
		return Database.query(query);
    }
}