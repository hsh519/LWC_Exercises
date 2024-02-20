import { LightningElement, api } from "lwc";

export default class StudentTiles extends LightningElement {
	@api studentList = [];
	selectedStudentId = "";

	@api
	setSelectedStudent(studentId) {
		this.selectedStudentId = studentId;
	}

	handleStudentSelected(event) {
		this.selectedStudentId = event.detail.studentId;
	}
}
