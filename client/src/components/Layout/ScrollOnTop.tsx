
import { useEffect, useRef, useState } from "react";
import { iconArrowTop } from "../../../public/icons";

const ScrollOnTop = () => {
    const buttonRef = useRef<any>(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        window.onscroll = () => {
            if (document.documentElement.scrollTop > 150) {
                setShowButton(true)
            } else {
                setShowButton(false)
            }
        };
    }, []);

    const eventOnTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {showButton ? (
                <button
                    ref={buttonRef}
                    onClick={eventOnTop}
                    className="fixed right-7 bottom-7 z-50 border border-gray-300 rounded text-center flex flex-col justify-center items-center p-2"
                >
                    <i className="w-6 block">{iconArrowTop}</i>
                </button>
            ) : null}
        </>
    );
};

export default ScrollOnTop;
