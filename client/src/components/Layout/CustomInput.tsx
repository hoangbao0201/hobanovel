import { useEffect, useState } from "react";

import cn from "clsx";
import { iconHideEye, iconShowEye } from "../../../public/icons";

const CustomInput = ({ name, value, handleOnchangeValue, label = "", id = "", type = "input", props }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const handleInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = () => {
        setIsFocused(false);
    };

    const eventOnchangeValueInput = (e: any) => {
        handleOnchangeValue(e);
    };

    const eventToggleTypePassword = () => {
        setIsShowPassword((value) => !value);
    };

    return (
        <div className="mb-4 grid">
            <label className="select-none mb-1 bg-white cursor-text transition-all" htmlFor={id}>
                {label}
            </label>
            <div
                className={`relative flex items-center w-full rounded cursor-text overflow-hidden pr-2 ${
                    isFocused
                        ? "shadow-inner border border-blue-600"
                        : "hover:border-blue-600 border border-slate-200"
                }`}
            >
                <input
                    id={id}
                    name={name}
                    type={`${isShowPassword ? "input" : type}`}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    defaultValue={value}
                    onChange={eventOnchangeValueInput}
                    autoComplete="off"
                    className="flex-1 border-none py-2 px-4 outline-none text-base"
                />
                {type === "password" && (
                    <span
                        onClick={eventToggleTypePassword}
                        className="w-5 h-5 py-1 ml-2 -translate-y-1 cursor-pointer block fill-slate-500"
                    >
                        {isShowPassword ? iconHideEye : iconShowEye}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CustomInput;
