import { Student } from "./entities/Student";

export type EnrollmentRequest = {
    student: Student,
}

export default class EnrollStudent {
    studentList: Student[] = [];

    execute(request: EnrollmentRequest): number | Error {
        const name = request.student.getName();
        const cpf = request.student.getCpf();

        const newStudent = new Student(name, cpf);

        if (this.studentList.includes(newStudent)) {
            return new Error("Enrollment with duplicated student is not allowed.");
        }
        return this.studentList.push(newStudent);
    }
}
