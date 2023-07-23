import { ReactNode } from "react";
import Image from "next/image"

import MainLayout from "@/components/Layout/MainLayout";
import WrapperLayout from "@/components/Layout/WrapperLayout"


const ComicDetail = () => {

    return (
        <WrapperLayout>
            <div>
                <div className="[&>div]:relative [&>div]:items-center [&>div]:text-center [&>div>img]:w-full ">
                    
                    <div id="" className="">
                        <Image
                            width={500}
                            height={500}
                            alt="Ta Là Tà Đế chap 386 - Trang 1"
                            src="https://hobanovelstorage.blob.core.windows.net/hobanovel/001-cc439a6.jpg"
                            // data-original="//cdn.ntcdntempv3.com/data/images/26017/1029190/001-cc439a6.jpg?data=net"
                            // data-cdn="//cdn.ntcdntempv26.com/data/images/26017/1029190/001-cc439a6.jpg?data=net"
                        />
                    </div>
                    <div id="" className="r">
                        <Image
                            width={500}
                            height={500}
                            alt="Ta Là Tà Đế chap 386 - Trang 2"
                            src="https://hobanovelstorage.blob.core.windows.net/hobanovel/002-0cad43e.jpg"
                            // data-original="//cdn.ntcdntempv3.com/data/images/26017/1029190/001-cc439a6.jpg?data=net"
                            // data-cdn="//cdn.ntcdntempv26.com/data/images/26017/1029190/001-cc439a6.jpg?data=net"
                        />
                    </div>
                </div>
            </div>
        </WrapperLayout>
    )
}

export default ComicDetail;

ComicDetail.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            {page}
        </MainLayout>
    );
};
