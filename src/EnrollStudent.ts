import ClassRepository from "./ClassRepository";
import Enrollment from "./entities/Enrollment";
import EnrollmentRepository from "./EnrollmentRepository";
import LevelRepository from "./LevelRepository";
import ModuleRepository from "./ModuleRepository";
import Student from "./entities/Student";
import InvoiceRepository from "./InvoiceRepository";

export default class EnrollStudent {
    levelRepository: LevelRepository;
    moduleRepository: ModuleRepository;
    classRepository: ClassRepository;
    enrollmentRepository: EnrollmentRepository;
    invoiceRepository: InvoiceRepository;

    constructor(
        levelRepository: LevelRepository,
        moduleRepository: ModuleRepository,
        classRepository: ClassRepository,
        enrollmentRepository: EnrollmentRepository,
        invoiceRepository: InvoiceRepository,
    ) {
        this.levelRepository = levelRepository;
        this.moduleRepository = moduleRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    execute(enrollmentRequest: any) {
        const student = new Student(
            enrollmentRequest.student.name,
            enrollmentRequest.student.cpf,
            enrollmentRequest.student.birthDate
        );
        const level = this.levelRepository.findByCode(enrollmentRequest.level);
        const module = this.moduleRepository.findByCode(enrollmentRequest.level, enrollmentRequest.module);
        const clazz = this.classRepository.findByCode(enrollmentRequest.class);
        if (student.getAge() < module.minimumAge) throw new Error("Student below minimum age");
        const enrollmentDate = new Date(enrollmentRequest.date);
        const classEndDate = new Date(clazz.endDate);
        if (enrollmentDate > classEndDate) throw new Error("Class has already finished");
        const studentsEnrolledInClass = this.enrollmentRepository.findAllByClass(level.code, module.code, clazz.code);
        const classStartDate = new Date(clazz.startDate);
        const classDuration = classEndDate.getTime() - classStartDate.getTime();
        const timeSinceClassStarted = enrollmentDate.getTime() - classStartDate.getTime();  
        if ((timeSinceClassStarted * 100 / classDuration) > 25) throw new Error("Class has already started");       
        if (studentsEnrolledInClass.length === clazz.capacity) throw new Error("Class is over capacity");
        const existingEnrollment = this.enrollmentRepository.findByCpf(enrollmentRequest.student.cpf);
        if (existingEnrollment) throw new Error("Enrollment with duplicated student is not allowed");
        const sequence = new String(this.enrollmentRepository.count() + 1).padStart(4, "0");
        const code = `${enrollmentDate.getFullYear()}${level.code}${module.code}${clazz.code}${sequence}`;
        const enrollment = new Enrollment(student, enrollmentDate, level.code, module.code, module.price, clazz.code, code, enrollmentRequest.installments, this.invoiceRepository);
        this.enrollmentRepository.save(enrollment);
        return enrollment;
    }
}
