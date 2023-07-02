import Link from "next/link";
import { ReactNode, useState } from "react";
import {
    iconAddNewNovel,
    iconChart,
    iconDocuments,
    iconMyNovel,
    iconNotifyError,
    iconSteal,
} from "../../../public/icons";
import "react-perfect-scrollbar/dist/css/styles.css";
import WrapperLayout from "./WrapperLayout";

interface AccountLayoutProps {
    children?: ReactNode;
    tab?: string;
}

interface ItemTabWithDataContentProps {
    value: string;
    icon: ReactNode;
    linkItem: string;
    children?: ItemTabWithDataContentProps[];
}

interface ItemTabProps {
    item: ItemTabWithDataContentProps;
    tab?: string;
}

const dataContentSide = [
    {
        value: "Hồ sơ",
        icon: iconSteal,
        linkItem: "/account/user",
    },
    {
        value: "Tủ truyện",
        icon: iconAddNewNovel,
        linkItem: "/account/bookcase",
    },
    {
        value: "Cài đặt",
        icon: iconMyNovel,
        linkItem: "/account/settings",
    },
    {
        value: "Tài sản",
        icon: iconNotifyError,
        linkItem: "/account/assects",
    },
    {
        value: "Mua kẹo",
        icon: iconChart,
        linkItem: "/account/payment=momo",
        children: [
            {
                value: "MoMo",
                icon: iconChart,
                linkItem: "/account/payment/momo",
            },
            {
                value: "VNPay",
                icon: iconChart,
                linkItem: "/account/payment/vnpay",
            },
            {
                value: "Tai khoan ngân hàng",
                icon: iconChart,
                linkItem: "/account/payment/bank",
            },
        ],
    },
    {
        value: "Thông báo",
        icon: iconDocuments,
        linkItem: "/account/notification",
    },
    {
        value: "Trợ giúp & Báo lỗi",
        icon: iconDocuments,
        linkItem: "/account/support",
    },
];

const ItemTab = ({ item, tab }: ItemTabProps) => {
    const [isDrop, setIsDrop] = useState(false);

    const handleToggleDropdown = (e: any) => {
        e.preventDefault();
        setIsDrop((value) => !value);
    };

    return (
        <>
            <Link
                href={item.linkItem}
                onClick={item?.children && handleToggleDropdown}
                className={`flex items-center px-[15px] py-[12px] rounded-md select-none ${
                    tab === item.linkItem
                        ? "bg-indigo-500 text-white fill-white font-semibold shadow-sm bg-opacity-9"
                        : "transition-colors duration-75 hover:bg-gray-200 text-gray-800 fill-gray-800"
                }`}
            >
                <div className="flex items-center">
                    <i className="block w-5 h-5 mr-4">{!!item.icon && item.icon}</i>
                    <span className="text-base line-clamp-1">{item.value}</span>
                </div>
            </Link>
            {item?.children && (
                <ul className={`${isDrop ? "block" : "hidden"} transition-all duration-150`}>
                    {item?.children.map((itemChild, index) => {
                        return (
                            <li key={index}>
                                <Link
                                    key={index}
                                    href={itemChild.linkItem}
                                    className={`flex items-center ml-4 px-[15px] py-[12px] rounded-lg select-none ${
                                        tab === itemChild.linkItem
                                            ? "bg-indigo-500 text-white fill-white font-semibold shadow-sm bg-opacity-9"
                                            : "transition-colors duration-75 hover:bg-gray-200 text-gray-800 fill-gray-800"
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <i className="block w-5 h-5 mr-4">
                                            {!!itemChild.icon && itemChild.icon}
                                        </i>
                                        <span className="text-base line-clamp-1">
                                            {itemChild.value}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
};

const AccountLayout = ({ children, tab }: AccountLayoutProps) => {

    return (
        <WrapperLayout>
            <div className="flex">
                <ul className="flex flex-col rounded-lg py-3 px-2 bg-gray-100 w-full max-w-[270px]">
                    {dataContentSide.map((item, index) => {
                        return (
                            <li key={index} >
                                <ItemTab item={item} tab={tab} />
                            </li>
                        )
                    })}
                </ul>
                <div className="px-4 flex-1">
                    {children}
                </div>
            </div>
        </WrapperLayout>
    );
};

export default AccountLayout;

