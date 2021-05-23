import EnrollStudent from "./EnrollStudent";
import { Student } from "./entities/Student";

test("Should not enroll without valid student name", () => {
    const enrollment = new EnrollStudent();
    const student = new Student("Ana#45", "427.144.060-41");

    const enrollmentRequest = { student };

    expect(() => enrollment.execute(enrollmentRequest)).toThrow(new Error("Invalid student name"));
});

test("Should not enroll without valid student cpf", () => {
    const enrollment = new EnrollStudent();
    const student = new Student("Maria Joaquina", "123.456.789-99");

    const enrollmentRequest = { student };

    expect(() => enrollment.execute(enrollmentRequest)).toThrow(new Error("Invalid CPF"));
});
