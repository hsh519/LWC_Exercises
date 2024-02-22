import getStudents from "@salesforce/apex/StudentBrowser.getStudents";
import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import SELECTED_STUDENT_CHANNEL from "@salesforce/messageChannel/SelectedStudentChannel__c";
import { NavigationMixin } from "lightning/navigation";

export default class StudentBrowser extends NavigationMixin(LightningElement) {
	selectedInstructorId = "";
	selectedDeliveryId = "";
	@wire(MessageContext) messageContext;

	cols = [
		{
			fieldName: "Name",
			lable: "Name"
		},
		{
			fieldName: "Title",
			lable: "Title",
			hiddenOnMobile: true
		},
		{
			fieldName: "Phone",
			lable: "Phone",
			type: "phone"
		},
		{
			fieldName: "Email",
			lable: "E-Mail",
			type: "email"
		}
	];

	students = [];

	@wire(getStudents, { instructorId: "$selectedInstructorId", courseDeliveryId: "$selectedDeliveryId" })
	wired_getStudents(result) {
		if (result.data || result.error) {
			this.students = result;
			this.dispatchEvent(new CustomEvent("doneloading", { bubbles: true, composed: true }));
		}
	}

	handleFilterChange(event) {
		this.selectedInstructorId = event.detail.instructorId;
		this.selectedDeliveryId = event.detail.deliveryId;
		this.dispatchEvent(new CustomEvent("loading", { bubbles: true, composed: true }));
	}

	handleStudentSelected(event) {
		const studentId = event.detail.studentId;
		this.updateSelectedStudent(studentId);
	}

	updateSelectedStudent(studentId) {
		const grid = this.template.querySelector("c-responsive-datatable");
		const gallery = this.template.querySelector("c-student-tiles");

		if (gallery) {
			gallery.setSelectedStudent(studentId);
		}

		if (grid) {
			grid.setSelectedRecord(studentId);
		}

		publish(this.messageContext, SELECTED_STUDENT_CHANNEL, { studentId: studentId });
	}

	handleRowDblClick(event) {
		const studentId = event.detail.pk;
		this[NavigationMixin.Navigate]({
			type: "standard__recordPage",
			attributes: {
				recordId: studentId,
				ObjectApiName: "Contact",
				actionName: "edit"
			}
		});
	}

	handleRowClick(event) {
		const studentId = event.detail.pk;
		this.updateSelectedStudent(studentId);
	}
}
