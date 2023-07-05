import Link from "next/link";
import { ReactNode } from "react";
import {
    iconAddDraft,
    iconAddNewNovel,
    iconAllDraft,
    iconChart,
    iconDocuments,
    iconMyNovel,
    iconNotifyError,
    iconSteal,
} from "../../../public/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import 'react-perfect-scrollbar/dist/css/styles.css';

interface CreatorLayoutProps {
    children?: ReactNode;
    tab?: string;
}

const dataContentSide = [
    {
        title: "Bản thảo",
        children: [
            {
                value: "Thêm Bản Thảo",
                icon: iconAddDraft,
                title: "Thêm bản thảo",
                description:
                    "Bạn có thể thêm bản thảo và xuất bản nó ngay lập tức ở đây, hoặc đơn giản chỉ muốn viết một đoạn và để nó tự lưu lại",
                linkItem: "/creator/drafts/new",
            },
            {
                value: "Các Bản Thảo",
                icon: iconAllDraft,
                title: "Các bản thảo",
                description: "Đây là tập hợp danh sách các bản thảo chưa xuất bản của bạn",
                linkItem: "/creator/drafts",
            },
        ],
    },
    {
        title: "Sách truyện",
        children: [
            {
                value: "Cào truyện",
                icon: iconSteal,
                linkItem: "/creator/novels/steal",
            },
            {
                value: "Thêm Truyện Mới",
                icon: iconAddNewNovel,
                linkItem: "/creator/novels/new",
            },
            {
                value: "Truyện Của Tôi",
                icon: iconMyNovel,
                linkItem: "/creator/novels",
            },
            {
                value: "Báo Lỗi",
                icon: iconNotifyError,
                linkItem: "/creator/novels/issues",
            },
            {
                value: "Thống Kê",
                icon: iconChart,
                linkItem: "/creator/novels/statistics",
            },
            {
                value: "Tư Liệu",
                icon: iconDocuments,
                linkItem: "/creator/novels/documents",
            },
        ],
    },
];

const CreatorLayout = ({ children, tab }: CreatorLayoutProps) => {

    return (
        <div className="overflow-hidden w-full h-full relative">
            <div className="z-50 bg-[#f8f8f8] fixed ml-[260px] top-0 w-full border-b border-gray-300">
                <h1>
                    <Link href="/" className="h-12 px-4 flex items-center">hobanovel</Link>
                </h1>
            </div>
            <div className="relative block ml-[260px] mt-12 p-5 overflow-y-auto scrollbar-thumb-gray-500 scrollbar-track-gray-300">
                <div>
                    <h2></h2>
                    <div></div>
                </div>
                <div className="bg-white min-h-[500px] p-5 rounded-xl border-gray-300 border">
                    {children}
                </div>
            </div>

            <div className="fixed bg-[#f8f8f8] h-full top-0 left-0 flex w-[260px] flex-col border-r border-gray-300">
                <PerfectScrollbar
                    options={{ suppressScrollX: true, wheelPropagation: true, wheelSpeed: 0.5, minScrollbarLength: 10 }}
                >
                    <h1 className="font-semibold text-xl py-1 mt-3 ml-[30px]">
                        <Link href="/">
                            hobanovel
                        </Link>
                    </h1>
                    <ul>
                        {dataContentSide.map((itemTitle, indexTitle) => {
                            return (
                                <li key={indexTitle} className="flex flex-col">
                                    <div className="ml-[30px] mb-[15px] mt-[30px] uppercase text-sm text-gray-400 font-semibold">
                                        {itemTitle.title}
                                    </div>
                                    <ul>
                                        {itemTitle.children.map((item, index) => {
                                            return (
                                                <li key={index} className="">
                                                    <Link
                                                        href={item.linkItem}
                                                        className={`flex items-center px-[15px] py-[10px] mx-[15px] hover:ml-[21px] transition-all duration-300 rounded-lg ${
                                                            tab == item.linkItem &&
                                                            "bg-indigo-500 text-white fill-white shadow-sm bg-opacity-90 shadow-indigo-600"
                                                        }`}
                                                    >
                                                        <i className="block w-5 mr-4 ">
                                                            {!!item.icon && item.icon}
                                                        </i>
                                                        <span className="text-base line-clamp-1">
                                                            {item.value}
                                                        </span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                </PerfectScrollbar>
            </div>
        </div>
    );
};

export default CreatorLayout;
