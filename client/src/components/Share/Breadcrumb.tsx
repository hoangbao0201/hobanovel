import styled from "styled-components";
import { iconAngleDouble, iconAngleRight } from "../../../public/icons";
import { Fragment } from "react";
import Link from "next/link";

const BreadcrumbStyle = styled.ul``;
type ItemPathType = {
    title: string;
    url: string;
};
interface BreadcrumbProps {
    path: ItemPathType[];
}

const Breadcrumb = ({ path }: BreadcrumbProps) => {
    return (
        <div className="flex items-center mx-4 border-l-4 border-l-blue-500 mr-3 mb-4">
            <ul
                itemScope
                itemType="http://schema.org/BreadcrumbList"
                className="flex items-center flex-wrap text-sm gap-2 px-3"
            >
                <li
                    itemScope
                    itemProp="itemListElement"
                    itemType="http://schema.org/ListItem"
                    className="text-blue-500"
                >
                    <Link itemProp="item" itemType="http://schema.org/Thing" href="/">
                        <span itemProp="name">hobanovel</span>
                    </Link>
                </li>
                {path.length > 0 && (
                    <>
                        {path.map((item, index) => {
                            return (
                                <li
                                    key={index}
                                    itemScope
                                    itemProp="itemListElement"
                                    itemType="http://schema.org/ListItem"
                                    className="text-blue-500"
                                >
                                    <i className="w-3 h-3 mr-2 inline-block flex-shrink fill-gray-400 rotate-90">
                                        {iconAngleDouble}
                                    </i>
                                    <Link
                                        itemProp="item"
                                        itemType="http://schema.org/Thing"
                                        href={item.url}
                                    >
                                        <span itemProp="name">{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </>
                )}
            </ul>
        </div>
    );
};

export default Breadcrumb;
