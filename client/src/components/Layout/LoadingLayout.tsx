import styled from "styled-components";

interface LoadingProps {
    w?: string;
    h?: string;
    theme?: string;
    className?: string;
}

const LoadingFormStyle = styled.span`
    &,
    &:before,
    &:after {
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
        content: "";
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
        0%,
        80%,
        100% {
            box-shadow: 0 2.5em 0 -1.3em;
        }
        40% {
            box-shadow: 0 2.5em 0 0;
        }
    }
`;
export const LoadingForm = ({ theme }: LoadingProps) => {
    return (
        <div className="flex pt-2 pb-6">
            <LoadingFormStyle
                className={`mx-auto ${theme === "dark" ? "" : ""}`}
            ></LoadingFormStyle>
        </div>
    );
};

const LoadingButtonStyle = styled.span`
    & {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
        border-top: 2px solid #fff;
        border-right: 2px solid transparent;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
export const LoadingButton = ({ theme, className }: LoadingProps) => {
    return (
        <LoadingButtonStyle
            className={`mr-2 ${theme === "dark" ? "" : ""} ${className}`}
        ></LoadingButtonStyle>
    );
};

const LoadingSearchStyle = styled.span`
    & {
        width: 20px;
        height: 20px;
        display: inline-block;
        position: relative;
        background: #ccc;
        box-sizing: border-box;
        animation: flipX 1s linear infinite;
    }

    @keyframes flipX {
        0% {
            transform: perspective(200px) rotateX(0deg) rotateY(0deg);
        }
        50% {
            transform: perspective(200px) rotateX(-180deg) rotateY(0deg);
        }
        100% {
            transform: perspective(200px) rotateX(-180deg) rotateY(-180deg);
        }
    }
`;
export const LoadingSearch = ({ theme, className }: LoadingProps) => {
    return (
        <LoadingSearchStyle
            className={`${theme === "dark" ? "" : ""} ${className}`}
        ></LoadingSearchStyle>
    );
};
