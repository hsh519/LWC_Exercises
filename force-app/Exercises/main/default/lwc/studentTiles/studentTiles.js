import { LightningElement, api } from "lwc";

export default class StudentTiles extends LightningElement {
	@api studentList = [];
	selectedStudentId = "";

	handleStudentSelected(event) {
		this.selectedStudentId = event.detail.studentId;
	}
}
