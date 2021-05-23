import validateCpf from "../helpers/ValidateCpf";

export class Student {
    private name: string;
    private cpf: string;

    constructor(name: string, cpf: string) {
        if (!name.match(/^([A-Za-z]+ )+([A-Za-z])+$/)) {
            throw new Error("Invalid student name");
        }

        if (cpf && !validateCpf(cpf)) {
            throw new Error("Invalid CPF");
        }

        this.name = name;
        this.cpf = cpf.replace(/\D/g, "");
    }

    getName() {
        return this.name;
    }

    getCpf() {
        return this.cpf;
    }
}