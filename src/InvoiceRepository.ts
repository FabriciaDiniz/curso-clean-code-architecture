export default interface InvoiceRepository {
    calculate(module: any, installments: number): number[];
}
