import { Order, OrderItem } from "@/types/order";

const API_URL = "http://localhost:9191/api/companies/orders";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};
async function handleResponse(res: Response) {

    if (!res.ok) {
        let message = "Something went wrong";

        try {
            const error = await res.json();
            // console.log("error",error);
            message = error.message || message;
        } catch {}

        throw new Error(message);
    }

    return res.json();
}

export const orderService = {
    createOrder: async (
        items: OrderItem[]
    ): Promise<Order> => {


        // Check every package quantity must be 1
        const invalidQuantity = items.some(
            item => item.quantity !== 1
        );


        if (invalidQuantity) {
            throw new Error(
                "Each package quantity must be 1"
            );
        }


        // Check duplicate packageCode
        const packageCodes = items.map(
            item => item.packageCode
        );


        const hasDuplicate =
            new Set(packageCodes).size !== packageCodes.length;


        if (hasDuplicate) {
            throw new Error(
                "Duplicate packages are not allowed"
            );
        }


        const packageIds = items.map(
            item => item.packageId
        );


        const res = await fetch(
            `${API_URL}`,
            {
                method: "POST",
                headers: {
                    ...getAuthHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    packageIds
                }),
            }
        );


        return handleResponse(res);
    }
,
    getMyOrders: async (): Promise<Order[]> => {

        const res = await fetch(
            `${API_URL}/my`,
            {
                method: "GET",
                headers: getAuthHeader(),
            }
        );

        return handleResponse(res);
    },

    getOrderById: async (
        orderId: string
    ): Promise<Order> => {

        const res = await fetch(
            `${API_URL}/orders/${orderId}`,
            {
                method: "GET",
                headers: getAuthHeader(),
            }
        );

        return handleResponse(res);
    },

    confirmPayment: async (
        orderId: string
    ): Promise<Order> => {

        const res = await fetch(
            `${API_URL}/${orderId}/confirm-payment`,
            {
                method: "POST",
                headers: getAuthHeader()
            }
        );

        return handleResponse(res);
    },
};

export const adminOrderService = {
    async getAllOrders(
        page = 0,
        size = 10
    ): Promise<{
        content: Order[];
        totalPages: number;
        totalElements: number;
        number: number;
    }> {

        const res = await fetch(
            `${API_URL}?page=${page}&size=${size}`,
            {
                method: "GET",
                headers: getAuthHeader(),
            }
        );


        if (!res.ok) {

            const error = await res.json();

            throw new Error(
                error.message ||
                "Cannot load orders"
            );
        }


        return res.json();
    },



    async activateOrder(
        orderId: number
    ): Promise<Order> {


        const res = await fetch(
            `${API_URL}/${orderId}/activate`,
            {
                method: "PUT",
               headers: getAuthHeader(),
            }
        );


        if (!res.ok) {

            const error = await res.json();

            throw new Error(
                error.message ||
                "Cannot activate order"
            );
        }


        return res.json();
    },



    async rejectOrder(
        orderId: number
    ): Promise<Order> {


        const res = await fetch(
            `${API_URL}/${orderId}/reject`,
            {
                method: "PUT",
                headers: getAuthHeader(),
            }
        );


        if (!res.ok) {

            const error = await res.json();

            throw new Error(
                error.message ||
                "Cannot reject order"
            );
        }


        return res.json();
    }

};

export interface QRResponse {
    qrUrl: string;
}


export const generateQR = async (
    orderId: string
): Promise<QRResponse> => {

    const res = await fetch(
        `/api/orders/${orderId}/qr`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );


    if (!res.ok) {
        throw new Error("Generate QR failed");
    }


    return res.json();
};