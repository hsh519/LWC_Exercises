import { LightningElement, api, wire } from "lwc";

import Utils from "c/utils";
import getInstructors from "@salesforce/apex/StudentBrowserForm.getInstructors";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { reduceErrors } from "c/ldsUtils";

// TODO #1: In a single line, import four functions from 'lightning/uiRecordApi' that we will use for Lightning Data Service.
// The functions are: createRecord, getFieldValue, getRecord, updateRecord
import { createRecord, getFieldValue, getRecord, updateRecord } from "lightning/uiRecordApi"; //fill in the contents of this line

import OBJECT_TRIP_REPORT from "@salesforce/schema/TripReport__c";
import FIELD_ID from "@salesforce/schema/TripReport__c.Id";
import FIELD_DATE from "@salesforce/schema/TripReport__c.Date__c";

// TODO #2: using the examples of FIELD_ID and FIELD_DATE, import the Instructor__c, Name, Rating__c, ReviewType__c, and Review__c fields
// HINT: loook at the fieldsToLoad array that immediately follows.
import FIELD_INSTRUCTOR from "@salesforce/schema/TripReport__c.Instructor__c";
import FIELD_NAME from "@salesforce/schema/TripReport__c.Name";
import FIELD_RATING from "@salesforce/schema/TripReport__c.Rating__c";
import FIELD_REVIEWTYPE from "@salesforce/schema/TripReport__c.ReviewType__c";
import FIELD_REVIEW from "@salesforce/schema/TripReport__c.Review__c";

const fieldsToLoad = [FIELD_DATE, FIELD_INSTRUCTOR, FIELD_NAME, FIELD_RATING, FIELD_REVIEWTYPE, FIELD_REVIEW];

export default class TripReportFormAdvanced extends LightningElement {
	error;
	_editorInitialized;
	saveButtonDisabled = true;

	@api recordId;

	//arrays to populate form options
	instructors;
	reviewTypes;

	//properties to store form values
	instructorId;
	locationName;
	dateVisited;
	reviewType;
	rating = 3;
	review;

	//TODO #3: following the examples of and dateVisited and instructorId, store the value of the name, rating, review type, and review fields in JavaScript properties
	@wire(getRecord, { recordId: "$recordId", fields: fieldsToLoad })
	wiredTripReport({ error, data }) {
		if (data) {
			this.dateVisited = getFieldValue(data, FIELD_DATE);
			this.instructorId = getFieldValue(data, FIELD_INSTRUCTOR);
			this.locationName = getFieldValue(data, FIELD_NAME);
			this.rating = getFieldValue(data, FIELD_RATING);
			this.reviewType = getFieldValue(data, FIELD_REVIEWTYPE);
			this.review = getFieldValue(data, FIELD_REVIEW);

			this.error = undefined;
		} else if (error) {
			this.error = error;
		}
	}

	@wire(getInstructors)
	wired_getInstructors({ error, data }) {
		this.instructors = [];
		if (data) {
			this.instructors = data.map((instructor) => ({
				value: instructor.Id,
				label: instructor.Name
			}));
		} else if (error) {
			this.error = error;
		}
	}

	//Get Object Info
	@wire(getObjectInfo, { objectApiName: OBJECT_TRIP_REPORT })
	objectInfo;

	//Get ReviewType picklist values
	@wire(getPicklistValues, { recordTypeId: "$objectInfo.data.defaultRecordTypeId", fieldApiName: FIELD_REVIEWTYPE })
	wired_getPicklistValues({ error, data }) {
		this.reviewTypes = [];
		if (data) {
			this.reviewTypes = data.values.map((reviewType) => ({
				value: reviewType.value,
				label: reviewType.label
			}));
		}
	}

	get formTitle() {
		return typeof this.recordId === "undefined" || this.recordId === 0 ? "Add Trip Report" : "Edit Trip Report";
	}

	//TODO #4: set the value of the private properties when they're changed in the form
	onInstructorChange(event) {
		this.instructorId = event.target.value;
	}

	onLocationNameChange(event) {
		this.locationName = event.target.value;
	}

	onDateVisitedChange(event) {
		this.dateVisited = event.target.value;
	}

	onReviewTypeChange(event) {
		this.reviewType = event.target.value;
	}

	onRatingChange(event) {
		this.rating = event.target.value;
	}

	onReviewChange(event) {
		this.review = event.target.value;
	}

	onSave() {
		this.saveTripReport();
	}
	saveTripReport() {
		const fieldsToSave = {};
		fieldsToSave[FIELD_DATE.fieldApiName] = this.dateVisited;
		fieldsToSave[FIELD_INSTRUCTOR.fieldApiName] = this.instructorId;
		//TODO #5: follow the pattern from the previous two lines to include rating, reviewtype, review, and name
		//in our request
		fieldsToSave[FIELD_RATING.fieldApiName] = this.rating;
		fieldsToSave[FIELD_REVIEWTYPE.fieldApiName] = this.reviewType;
		fieldsToSave[FIELD_REVIEW.fieldApiName] = this.review;
		fieldsToSave[FIELD_NAME.fieldApiName] = this.locationName;

		if (!this.recordId) {
			//todo #6: When creating a new record, define an object named recordInput with two property:
			//---fields, which contains the fieldsToSave object
			//---apiName, which contains the api name of the trip report object
			const recordInput = { fields: fieldsToSave, apiName: OBJECT_TRIP_REPORT.objectApiName };

			createRecord(recordInput)
				.then((tripReport) => {
					//TODO #7: after record creation, store the new ID of the trip report in our recordId property
					this.recordId = tripReport.Id;
					Utils.showToast(this, "Success", "Trip Report Created", "success");
					this.returnToBrowseMode();
				})
				.catch((error) => {
					let errors = reduceErrors(error);
					let errorBody = errors.length ? errors[0] : "There was a problem creating your record.";
					Utils.showToast(this, "Error creating record", errorBody, "error");
				});
		} else {
			//TODO #8: when doing an update, add the recordId to our fieldsToSave object
			//so that the system knows which record to update
			fieldsToSave[FIELD_ID.fieldApiName] = this.recordId;

			const recordInput = { fields: fieldsToSave };
			updateRecord(recordInput)
				.then(() => {
					Utils.showToast(this, "Success", "Trip report updated", "success");
					this.returnToBrowseMode();
				})
				.catch((error) => {
					let errors = reduceErrors(error);
					let errorBody = errors.length ? errors[0] : "There was a problem updating your record.";
					Utils.showToast(this, "Error updating record", errorBody, "error");
				});
		}
	}

	validateFields() {
		const field = Array.from(this.template.querySelectorAll(".validateMe"));
		return field.every((currentField) => currentField.checkValidity());
	}

	onBlur() {
		this.saveButtonDisabled = !this.validateFields();
	}

	onCancel() {
		this.returnToBrowseMode();
	}

	returnToBrowseMode() {
		const evt = new CustomEvent("tripreportmodechange", {
			detail: {
				mode: "browse"
			}
		});

		this.dispatchEvent(evt);
	}
}
