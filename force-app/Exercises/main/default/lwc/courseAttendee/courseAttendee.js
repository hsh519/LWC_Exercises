import { LightningElement, api, wire } from "lwc";
import Utils from "c/utils";
import { NavigationMixin } from "lightning/navigation";
import { getRecord } from "lightning/uiRecordApi";
import FIELD_CourseName from "@salesforce/schema/Course_Attendee__c.Course_Delivery__r.Course__r.Name";
import FIELD_StartDate from "@salesforce/schema/Course_Attendee__c.Course_Delivery__r.Start_Date__c";
import FIELD_StudentId from "@salesforce/schema/Course_Attendee__c.Student__c";
import FIELD_StudentName from "@salesforce/schema/Course_Attendee__c.Student__r.Name";
import FIELD_StudentPict from "@salesforce/schema/Course_Attendee__c.Student__r.PhotoUrl";
const fields = [FIELD_CourseName, FIELD_StartDate, FIELD_StudentId, FIELD_StudentName, FIELD_StudentPict];

export default class CourseAttendee extends NavigationMixin(LightningElement) {
	@api recordId;
	attendee;
	error;

	@wire(getRecord, { recordId: "$recordId", fields })
	wiredMap({ error, data }) {
		if (data) {
			const courseName = Utils.getDisplayValue(data, FIELD_CourseName);
			const startDate = Utils.getDisplayValue(data, FIELD_StartDate);
			this.attendee = {
				cardTitle: `${courseName} on ${startDate}`,
				studentId: Utils.getDisplayValue(data, FIELD_StudentId),
				studentTile: {
					Name: Utils.getDisplayValue(data, FIELD_StudentName),
					PhotoUrl: Utils.getDisplayValue(data, FIELD_StudentPict)
				}
			};
			this.error = undefined;
		} else if (error) {
			this.error = error;
			this.attendee = undefined;
		}
	}

	onEdit() {
		this[NavigationMixin.Navigate]({
			type: "standard__recordPage",
			attributes: {
				recordId: this.recordId,
				objectApiName: "Course_Attendee__c",
				actionName: "edit"
			}
		});
	}
}
