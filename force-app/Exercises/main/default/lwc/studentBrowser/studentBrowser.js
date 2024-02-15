import getStudents from "@salesforce/apex/StudentBrowser.getStudents";
import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import SELECTED_STUDENT_CHANNEL from "@salesforce/messageChannel/SelectedStudentChannel__c";

export default class StudentBrowser extends LightningElement {
	selectedInstructorId = "";
	selectedDeliveryId = "";
	@wire(MessageContext) messageContext;

	@wire(getStudents, { instructorId: "$selectedInstructorId", courseDeliveryId: "$selectedDeliveryId" })
	students;

	handleFilterChange(event) {
		this.selectedInstructorId = event.detail.instructorId;
		this.selectedDeliveryId = event.detail.deliveryId;
	}

	handleStudentSelected(event) {
		const studentId = event.detail.studentId;
		this.updateSelectedStudent(studentId);
	}

	updateSelectedStudent(studentId) {
		publish(this.messageContext, SELECTED_STUDENT_CHANNEL, { studentId: studentId });
	}
}
