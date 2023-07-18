import { ReactNode, useEffect } from "react";
import { iconClose } from "../../../public/icons";


interface OverlayLayoutProps {
    children?: ReactNode;
    isShow: any;
    handle: () => void;
}

const OverlayLayout = ({ children, isShow, handle }: OverlayLayoutProps) => {

    const bodyElement = document.querySelector('body');

    useEffect(() => {
        if (isShow) {
            bodyElement?.classList.add('overflow-hidden');
            bodyElement?.classList.add('pr-4');
        }
        // else {
        //     bodyElement?.classList.remove('overflow-hidden');
        //     bodyElement?.classList.remove('pr-4');
        // }
    }, [isShow]);

    // Handle Hidden Comment Notify
    const handleHiddenNotifyComment = () => {
        bodyElement?.classList.remove('overflow-hidden');
        bodyElement?.classList.remove('pr-4');
        handle()
    }

    return (
        <div className={`${ isShow ? 'fixed block overflow-y-scroll' : 'hidden' } transition-all z-50 top-0 right-0 bottom-0 left-0 bg-black/10`}>

            <div className="mx-auto max-w-lg w-full top-0">
                <div className="bg-white rounded-md shadow-lg mt-[30px] mx-4 relative">

                    <button onClick={handleHiddenNotifyComment} className="p-2 hover:bg-gray-200 rounded-full absolute right-3 top-3">
                        <i className="w-5 h-5 block">{iconClose}</i>
                    </button>

                    <div className="min-h-[400px]">
                        {children}
                    </div>

                    <div className="border-t h-[50px] flex items-center px-4">
                        <span onClick={handleHiddenNotifyComment} className="py-1 px-3 border rounded-md ml-auto mr-5 cursor-pointer select-none">Đóng</span>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default OverlayLayout;
