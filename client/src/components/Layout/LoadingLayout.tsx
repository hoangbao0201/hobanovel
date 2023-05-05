import styled from "styled-components"

interface LoadingProps {
    w?: string
    h?: string
    theme?: string
}

const LoadingLayout = ({ w, h } : LoadingProps) => {


    return <div style={{ width: `${w || "80px"}`, height: `${h || "28px"}` }} className="">Loading</div>
}

export default LoadingLayout



const LoadingFormStyle = styled.span`
    &, &:before, &:after {
        border-radius: 50%;
        width: 12px;
        height: 12px;
        animation-fill-mode: both;
        animation: bblFadInOut 1.8s infinite ease-in-out;
    }
    & {
        color: #333;
        font-size: 7px;
        position: relative;
        text-indent: -9999em;
        transform: translateZ(0);
        animation-delay: -0.14s;
    }
    &:before,
    &:after {
        content: '';
        position: absolute;
        top: 0;
    }
    &:before {
        left: -3em;
        animation-delay: -0.28s;
    }
    &:after {
        left: 3em;
    }

    @keyframes bblFadInOut {
        0%, 80%, 100% { box-shadow: 0 2.5em 0 -1.3em }
        40% { box-shadow: 0 2.5em 0 0 }
    }
` 


export const LoadingForm = ({ theme } : LoadingProps) => {

    return (
        <div className="flex pt-2 pb-6">
            <LoadingFormStyle className={`mx-auto ${theme === 'dark' ? "" : ""}`}></LoadingFormStyle>
        </div>
    )
}