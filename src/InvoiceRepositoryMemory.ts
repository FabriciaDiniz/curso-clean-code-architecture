import InvoiceRepository from "./InvoiceRepository";

export default class InvoiceRepositoryMemory implements InvoiceRepository {
    invoice: any[] = [];

    calculate(price: number, installments: number): number[] {
        const parcel = price / installments;
        const roundParcel = Math.floor(parcel);
        let rest = parcel - roundParcel;
        const lastParcel = Number(((rest * installments) + roundParcel).toFixed(2));
        const firstParcels = Array(installments-1).fill(roundParcel, 0, installments - 1);
        this.invoice = [...firstParcels, lastParcel];
        return this.invoice;
    }
}