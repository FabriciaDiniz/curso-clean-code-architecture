import ClassRepositoryMemory from "./ClassRepositoryMemory";
import EnrollmentRepositoryMemory from "./EnrollmentRepositoryMemory";
import EnrollStudent from "./EnrollStudent";
import InvoiceRepositoryMemory from "./InvoiceRepositoryMemory";
import LevelRepositoryMemory from "./LevelRepositoryMemory";
import ModuleRepositoryMemory from "./ModuleRepositoryMemory";

let enrollStudent: EnrollStudent;

beforeEach(function () {
    const enrollmentRepository = new EnrollmentRepositoryMemory();
    const levelRepository = new LevelRepositoryMemory();
    const moduleRepository = new ModuleRepositoryMemory();
    const classRepository = new ClassRepositoryMemory();
    const invoiceRepository = new InvoiceRepositoryMemory();
    enrollStudent = new EnrollStudent(levelRepository, moduleRepository, classRepository, enrollmentRepository, invoiceRepository);
});

test("Should not enroll without valid student name", () => {
    const enrollmentRequest = {
        student: {
            name: "Ana"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid name"));
});

test("Should not enroll without valid student cpf", () => {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "213.345.654-10"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Invalid CPF"));
});

test("Should not enroll duplicated student", () => {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    };
    enrollStudent.execute(enrollmentRequest);
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Enrollment with duplicated student is not allowed"));
});

test("Should generate enrollment code", () => {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    };
    const enrollment = enrollStudent.execute(enrollmentRequest);
    expect(enrollment.code).toBe("2021EM1A0001");
});

test("Should not enroll student below minimum age", () => {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84",
            birthDate: "2014-03-12"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Student below minimum age"));
});

test("Should not enroll student over class capacity", () => {
    enrollStudent.execute({
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    });
    enrollStudent.execute({
        student: {
            name: "Ana Maria",
            cpf: "240.826.286-06"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    });
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "670.723.738-10"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Class is over capacity"));
});

test("Should not enroll after the end of the class", () => {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "670.723.738-10"
        },
        date: "01-01-2022",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Class has already finished"));
});

test("Should not enroll after 25% of the start of the class", () => {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        },
        date: "06-01-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 12,
    };
    expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error("Class has already started"));
});

test("Should generate the invoices based on the number of installments, rounding each amount and applying the rest in the last invoice", () => {
    const enrollmentRequest = {
        student: {
            name: "Ana Maria",
            cpf: "864.464.227-84"
        },
        date: "01-06-2021",
        level: "EM",
        module: "1",
        price: 17000,
        class: "A",
        installments: 3,
    };
    const enrollment = enrollStudent.execute(enrollmentRequest);
    expect(enrollment.invoice).toStrictEqual([5666, 5666, 5668]);
});
