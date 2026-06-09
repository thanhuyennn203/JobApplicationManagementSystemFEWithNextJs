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

        const packageIds = items.map(
            item => item.packageId
        );

        const res = await fetch(
            `${API_URL}`,
            {
                method: "POST",
                headers: getAuthHeader(),
                body: JSON.stringify({
                    packageIds,
                }),
            }
        );

        return handleResponse(res);
    },

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