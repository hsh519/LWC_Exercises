import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getFieldValue, getFieldDisplayValue } from "lightning/uiRecordApi";

export default class Utils {
	static showToast = (firingComponent, toastTitle, toastBody, variant) => {
		const evt = new ShowToastEvent({
			title: toastTitle,
			message: toastBody,
			variant: variant
		});

		firingComponent.dispatchEvent(evt);
	};

	static getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}
}
