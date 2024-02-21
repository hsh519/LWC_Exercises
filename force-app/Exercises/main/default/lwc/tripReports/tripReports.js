import { LightningElement } from "lwc";

export default class TripReports extends LightningElement {
	mode = "browse";
	selectedTripReportId = 0;

	get browseMode() {
		return this.mode === "browse";
	}
	get addOrEditMode() {
		return this.mode === "add" || this.mode === "edit";
	}

	handleTripReportModeChange(event) {
		this.mode = event.detail.mode;
		this.selectedTripReportId = event.detail.Id;
	}
}
