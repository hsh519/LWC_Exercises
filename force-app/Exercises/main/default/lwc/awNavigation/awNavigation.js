import { LightningElement, wire } from "lwc";
import getCertifications from "@salesforce/apex/AwNavigation.getCertifications";

export default class AwNavigation extends LightningElement {
	certifications = [];
	error;

	@wire(getCertifications)
	wired_getCertifications({ error, data }) {
		if (data) {
			this.certifications = data.map((cert) => ({
				Id: cert.Id,
				Name: cert.Name,
				compoundKey: `certification|${cert.Id}|${cert.Name}`
			}));
		} else if (error) {
			this.error = error;
		}
	}

	onselect(event) {
		const selectedItemName = event.detail.name;
		const evt = new CustomEvent("navitemselected", {
			detail: { itemName: selectedItemName }
		});

		this.dispatchEvent(evt);
	}
}
