import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

type ClickOutsideHandler = () => void;

export const useClickOutSide = (node: any, handler: ClickOutsideHandler) => {
    // const router = useRouter();
    // const handlerRef = useRef(handler);

    // useEffect(() => {
    //     handlerRef.current = handler;
    // }, [handler])

    // useEffect(() => {

    //     const handleClickOutSide = (e: any) => {
    //         if(!node.current) {
    //             return;
    //         }
    //         if(node.current.contains(e.target)) {
    //             return;
    //         }
    //         if(node.current) {
    //             handlerRef.current();
    //         }
    //     }

    //     return () => {
    //         document.addEventListener("mousedown", handleClickOutSide)
    //     }

    // }, [node])

    // useEffect(() => {

    //     const handleRouterChange = () => {
    //         handlerRef.current();
    //     }

    //     router.events.on("routeChangeStart", handleRouterChange);
    //     return () => {
    //         router.events.off("routeChangeStart", handleRouterChange);
    //     }
    // }, [])

    const router = useRouter();
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const handleClickOutside = (e : any) => {
            if (node.current && !node.current.contains(e.target)) {
                handlerRef.current();
            }
        };

        const handleRouteChange = () => {
            handlerRef.current();
        };

        document.addEventListener("mousedown", handleClickOutside);
        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            router.events.off("routeChangeStart", handleRouteChange);
        };
    }, [node, router.events]);

    return node;
};
