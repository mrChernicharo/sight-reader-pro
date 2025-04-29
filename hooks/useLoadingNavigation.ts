import { wait } from "@/utils/helperFns";
import { usePathname, router } from "expo-router";
import { useState, useCallback, useEffect } from "react";

export function useLoadingNavigation() {
    const [isNavigating, setIsNavigating] = useState(false);
    const path = usePathname();

    const navigateTo = useCallback(async (route: any) => {
        setIsNavigating(true);
        // console.log("navigating to ", route);
        await wait(10_000);

        router.push({
            pathname: route,
        });
    }, []);

    useEffect(() => {
        // console.log("path :::", { p: path });
        if (path) {
            setIsNavigating(false);
        }
    }, [path]);

    // useEffect(() => {
    //     console.log("isNavigating :::", { isNavigating });
    // }, [isNavigating]);

    return {
        navigateTo,
        isNavigating,
    };
}
