import getDeliveriesByInstructor from "@salesforce/apex/StudentBrowserForm.getDeliveriesByInstructor";
import getInstructors from "@salesforce/apex/StudentBrowserForm.getInstructors";
import { LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";

export default class StudentBrowserForm extends NavigationMixin(LightningElement) {
	instructors = [];
	selectedInstructorId = "";
	deliveries = [];
	selectedDeliveryId = "";
	error;
	isButtonDisabled = true;

	@wire(getInstructors)
	wired_getInstructors({ data, error }) {
		this.instructors = [];
		if (data) {
			this.instructors.push({
				value: "",
				label: "Select an instructor"
			});

			data.forEach((instructor) => {
				this.instructors.push({
					value: instructor.Id,
					label: instructor.Name
				});
			});
		} else if (error) {
			this.error = error;
		}
	}

	@wire(getDeliveriesByInstructor, { instructorId: "$selectedInstructorId" })
	wired_getDeliveriesByInstructor({ data, error }) {
		if (data) {
			this.deliveries = [];
			if (data && data.length) {
				this.deliveries = data.map((delivery) => ({
					value: delivery.Id,
					label: `${delivery.Start_Date__c} ${delivery.Location__c} ${delivery.Attendee_Count__c} students`
				}));

				this.deliveries.unshift({
					value: "",
					lael: "Any Delivery"
				});
			}
		} else if (error) {
			this.error = error;
		}
	}

	onInstructorChange(event) {
		this.selectedDeliveryId = "";
		this.selectedInstructorId = event.target.value;
		this.isButtonDisabled = this.selectedInstructorId === "";
		this.notifyParent();
	}

	onDeliveryChange(event) {
		this.selectedDeliveryId = event.target.value;
		this.notifyParent();
	}

	notifyParent() {
		const evt = new CustomEvent("filterchange", {
			detail: {
				instructorId: this.selectedInstructorId,
				deliveryId: this.selectedDeliveryId
			}
		});

		this.dispatchEvent(evt);
	}

	onAddNewDelivery() {
		const pageInfo = {
			type: "standard__objectPage",
			attributes: {
				objectApiName: "Course_Delivery__c",
				actionName: "new"
			},
			state: {
				defaultFieldValues: encodeDefaultFieldValues({
					Instructor__c: this.selectedInstructorId
				})
			}
		};

		this[NavigationMixin.Navigate](pageInfo);
	}
}
