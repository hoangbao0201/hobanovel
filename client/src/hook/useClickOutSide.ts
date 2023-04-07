import { useRouter } from "next/router";
import { useEffect, useRef } from "react"

export const useClickOutSide = (node: any, handler: Function) => {
    
    const router = useRouter();
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler])


    useEffect(() => {
        
        const handleClickOutSide = (e: any) => {
            if(!node.current) {
                return;
            }
            if(node.current.contains(e.target)) {
                return;
            }
            if(node.current) {
                handlerRef.current();
            }
        }

        return () => {
            document.addEventListener("mousedown", handleClickOutSide)
        }

    }, [node])

    useEffect(() => {

        const handleRouterChange = () => {
            handlerRef.current();
        }

        router.events.on("routeChangeStart", handleRouterChange);
        return () => {
            router.events.off("routeChangeStart", handleRouterChange);
        }
    }, [])


    // const handlerRef = useRef(handler);

    // useEffect(() => {
    //     handlerRef.current = handler;
    // }, [handler])

    // useEffect(() => {
    //     const handleClickOutside = (e : any) => {

    //         if(!node.current) {
    //             return;
    //         }
    //         if(node.current.contains(e.target)) {
    //             return;
    //         }
    //         if(handlerRef.current) {
    //             handlerRef.current();
    //         }
    //     }

    //     return () => {
    //         document.addEventListener("mousedown", handleClickOutside);
    //     }
    // }, [node])
}
