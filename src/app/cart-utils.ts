import { CartItem } from "./entities";

export function getVat(countryCode: string): number {
    if (countryCode === 'IT') {
        return 0.22;
    }
    return 0;
}

export function getDiscountedPrice(price: number, discount: number) {
    return price * (1 - discount/100);
}

export function getVatPrice(price: number, vat: number) {
    return price * (1 + vat);
}

export function printPrice(num: number) {
    return `${num.toFixed(2)}€`;
}


export function calcCartItem(item: CartItem, vat: number) {
    let price = item.product.netPrice * item.quantity;
    const totalNetPrice = getDiscountedPrice(price, item.product.discount);
    const totalPrice = getVatPrice (totalNetPrice, vat);

    return {
        ...item,
        totalWeight: item.product.weight * item.quantity,
        totalPrice,
        totalNetPrice,
        discountAmount: totalPrice * item.product.discount/100
    }
}

export function getTransportFee(weight: number) {
    let transportFee = 0;

    if (weight > 2000) {
        transportFee = 7;
    }
    if(weight > 5000) {
        transportFee = 15;
    }
    if (weight > 10000) {
        transportFee = 20;
    }
    return transportFee;
}
