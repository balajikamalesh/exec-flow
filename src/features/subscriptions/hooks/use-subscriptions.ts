import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useSubscriptions = () => {
    return useQuery({
        queryKey: ["subscriptions"],
        queryFn: async () => {
            const { data } = await authClient.customer.state();
            return data;
        },
    });
}

export const usehasActiveSubscription = () => {
    const { data: customer, isLoading, ...rest } = useSubscriptions();

    const hasActiveSubscription = customer?.activeSubscriptions && customer.activeSubscriptions.length > 0;

    return {
        hasActiveSubscription,
        subscriptions: customer?.activeSubscriptions?.[0],
        isLoading,
        ...rest
    };
}