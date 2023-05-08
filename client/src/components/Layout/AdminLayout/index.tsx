import Link from "next/link";
import { ReactNode, useState } from "react";
import { iconSteal } from "../../../../public/icons";


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
        <div className="relative">
            <nav className="md:left-0 md:bottom-0 md:w-64 md:fixed md:min-h-screen overflow-y-auto border-r relative px-3 py-2">
                <div className="pb-5 pt-3 border-b mb-2">
                    <Link href="/">
                        <h3 className="py-2 px-3">HOBANOVEL</h3>
                    </Link>
                </div>
                <h3 className="py-2 px-3 uppercase font-semibold text-sm text-gray-500">ADMIN LAYOUT PAGES</h3>
                <div>
                    {
                        dataContentSide.map((item, index) => {
                            return (
                                <div key={index} className="">
                                    <Link href={item.linkItem}>
                                        <div  className="py-2 px-3 font-semibold uppercase text-gray-800">
                                            {item.value}
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
            </nav>
            <div className="relative md:ml-64">
                <nav className="w-full border-b px-3">
                    <div className="flex h-14 items-center">Header</div>
                </nav>
                <div className="p-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

