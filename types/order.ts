export type OrderStatus =
    | "PENDING"        // vừa tạo, chờ chuyển khoản
    | "WAITING"        // đã bấm "Tôi đã thanh toán", chờ admin xác nhận
    // | "CONFIRMED"      // admin xác nhận
    | "ACTIVE"         // package đang hoạt động
    | "REJECTED";      // admin từ chối

export interface OrderItem {
    packageId: number;
    packageCode: string;
    packageName: string;
    price: number;
    quantity: number;
    vip: boolean;
}

export interface BankInfo {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch: string;
    transferContent: string;  // nội dung chuyển khoản
}

export interface Order {
    id: string;
    orderCode: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    bankInfo: BankInfo;
    createdAt: string;
    paidAt?: string;
    confirmedAt?: string;
    note?: string;
}
