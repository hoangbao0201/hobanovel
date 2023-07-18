import Link from "next/link";
import { ReactNode } from "react";

import { iconSteal } from "../../../public/icons";

interface AdminLayoutProps {
    children?: ReactNode;
    tab?: string;
}

const dataContentSide = [
    {
        value: "Dashboard",
        icon: iconSteal,
        linkItem: "/admin/dashboard",
    },
    {
        value: "Setting",
        icon: iconSteal,
        linkItem: "/admin/settings",
    },
    {
        value: "Banners",
        icon: iconSteal,
        linkItem: "/admin/banners",
    },
];

const AdminLayout = ({ children, tab }: AdminLayoutProps) => {
    return (
        <>
            {/* <Head>
                <style>
                    {`
                        body {
                            background-color: #f8f8f8;
                        }
                    `}
                </style>
            </Head> */}
            <div className="relative">
                <nav className="md:left-0 bg-white md:bottom-0 md:w-64 md:fixed md:min-h-screen overflow-y-auto border-r relative px-3 py-2">
                    <div className="pb-5 pt-3 border-b mb-2">
                        <h1 className="py-2 px-3">
                            <Link href="/">
                                HOBANOVEL
                            </Link>
                        </h1>
                    </div>
                    <h3 className="py-2 px-3 uppercase font-semibold text-sm text-gray-500">
                        ADMIN LAYOUT PAGES
                    </h3>
                    <ul>
                        {dataContentSide.map((item, index) => {
                            return (
                                <li key={index} className="">
                                    <Link href={item.linkItem} className="py-2 px-3 font-semibold uppercase text-gray-800">
                                        {item.value}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="relative md:ml-64">
                    <nav className="w-full bg-white border-b px-3">
                        <div className="flex h-14 items-center">Header</div>
                    </nav>
                    <div className="p-3">
                        <div className="bg-white p-6">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
