import validateCpf from "../ValidateCpf";

export default class Cpf {
    value: string;

    constructor (value: string) {
        if(!validateCpf(value)) throw new Error("Invalid CPF");
        this.value = value;
    }
}