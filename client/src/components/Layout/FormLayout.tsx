import { ReactNode } from "react";

import { WithClassName } from "@/types/common";
import styled from "styled-components";
import ClientOnly from "../Share/ClientOnly";



const LoadingLineFormStyle = styled.div`
    width: 100%;
    height: 5px;
    background-color: transparent;
    position: relative;
    overflow: hidden;
    &::before {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        background-color: #4285f4;
        animation: bar-1 3.1s cubic-bezier(0.65, 0.81, 0.73, 0.4) infinite;
    }
    &::after {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        background-color: #4285f4;
        animation: bar-2 3.1s cubic-bezier(0.16, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
    }

    @keyframes bar-1 {
        0% {
            left: -35%;
            right: 100%;
        }
        60%, 100% {
            left: 100%;
            right: -90%;
        }
    }
    @keyframes bar-2 {
        0% {
            left: -200%;
            right: 100%;
        }
        60%, 100% {
            left: 107%;
            right: -8%;
        }
    }
`

interface FormLayoutPops extends WithClassName {
    children: ReactNode
    loading?: boolean
    classChild?: string
}

const FormLayout = ({ children, className, classChild, loading = false } : FormLayoutPops) => {

    return (
        <ClientOnly>
            <div className={`${className}`}>
                <LoadingLineFormStyle className={`${loading ? "block" : "hidden"}`} />
                <div className={`${classChild} ${loading ? "opacity-60 pointer-events-none select-none" : ""}`}>
                    {children}
                </div>
            </div>
        </ClientOnly>
    )
}

export default FormLayout;