import getCertifiedStudents from "@salesforce/apex/CertifiedStudentList.getCertifiedStudents";
import deleteStudentCertification from "@salesforce/apex/CertifiedStudentList.deleteStudentCertification";
import { LightningElement, api, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";

export default class CertifiedStudentList extends LightningElement {
	@api certificationName = "";
	@api certificationId = 0;
	certifiedStudents;
	btnGroupDisabled = true;
	error;
	_wiredStudentResult;

	columnConfig = [
		{
			label: "Name",
			fieldName: "name",
			type: "text"
		},
		{
			label: "Date",
			fieldName: "date",
			type: "text"
		},
		{
			label: "Email",
			fieldName: "email",
			type: "text"
		},
		{
			label: "Phone",
			fieldName: "phone",
			type: "text"
		}
	];

	@wire(getCertifiedStudents, { certificationId: "$certificationId" })
	wired_getCertifiedStudents(result) {
		this._wiredStudentResult = result;
		this.certifiedStudents = [];
		if (result.data) {
			this.certifiedStudents = result.data.map((certHeld) => ({
				certificationHeldId: certHeld.Id,
				contactId: certHeld.Certified_Professional__r.Id,
				name: certHeld.Certified_Professional__r.Name,
				date: certHeld.Date_Achieved__c,
				email: certHeld.Certified_Professional__r.Email,
				phone: certHeld.Certified_Professional__r.Phone
			}));
		} else if (result.error) {
			this.error = result.error;
		}
	}

	onRowSelection(event) {
		const numSelected = event.detail.seletedRows.length;
		this.dtnGroupDisabled = numSelected === 0;
	}

	getSelectedIds() {
		const datatable = this.template.querySelector("lightning-datatable");
		const ids = datatable.getSelectedRows().map((r) => r.certificationHeldId);
		return ids;
	}

	onCertActions(event) {
		const btnClicked = event.target.getAttribute("data-btn-id");

		switch (btnClicked) {
			case "btnEmail":
				break;
			case "btnSendCert":
				break;
			case "btnDelete":
				this.onDelete();
				break;
				defalut: break;
		}
	}

	onDelete() {
		const certificationIds = this.getSelectedIds();
		deleteStudentCertification({ certificationIds })
			.then(() => {
				refreshApex(this._wiredStudentResult);
			})
			.catch((error) => {
				this.error = error;
			});
	}
}