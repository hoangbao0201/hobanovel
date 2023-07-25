
import classNames from 'classnames';
import { useSwiper } from 'swiper/react'

interface SwiperButtonProps {
    type: "next" | "prev";
    styleButton?: string;
    styleIcon?: string;
}

export default function SwiperButton({
    type,
    styleButton,
    styleIcon
} : SwiperButtonProps) {
    const swiper = useSwiper();

    const handleClickButton = () => {
        if(type === 'next') {
            swiper.slideNext();
        } else {
            swiper.slidePrev();
        }
    }

    return (
        <button aria-label={type === "next" ? "sau" : "trước"} className={classNames(styleButton)} onClick={handleClickButton}>
            {type === "next" ? (
                <i>
                   <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={styleIcon}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                    </svg> 
                </i>
            ) : (
                <i>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={styleIcon}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                </i>
            )}
        </button>
    );
};
