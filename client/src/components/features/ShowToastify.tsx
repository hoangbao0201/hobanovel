import { toast } from "react-toastify";

type ToastType = "success" | "error" | "warning" | "info";

interface ShowToastifyProps {
    data: any
    type: ToastType
    isDefault?: boolean
}

export const ShowToastify = ({ data, type, isDefault = true } : ShowToastifyProps)  => {
    return toast(data, {
        type,
        theme: "colored",
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: isDefault,
        progress: undefined,
        className: "text-xs",
        icon: isDefault,
    });
};
