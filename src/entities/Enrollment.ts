import InvoiceRepository from "../InvoiceRepository";
import Student from "./Student";

export default class Enrollment {
    student: Student;
    date: Date;
    level: string;
    module: string;
    price: number;
    clazz: string;
    code: string;
    installments: number;
    invoice: any;
    invoiceRepository: InvoiceRepository;

    constructor(
        student: Student,
        date: Date,
        level: string,
        module: string,
        price: number,
        clazz: string,
        code: string,
        installments: number,
        invoiceRepository: InvoiceRepository,
    ) {
        this.student = student;
        this.date = date;
        this.level = level;
        this.module = module;
        this.price = price;
        this.clazz = clazz;
        this.code = code;
        this.installments = installments;
        this.invoiceRepository = invoiceRepository;
        this.invoice = this.invoiceRepository.calculate(price, installments);
    }
}