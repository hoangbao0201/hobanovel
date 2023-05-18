import { WithClassName } from "@/types/common";
import { iconStar } from "../../../public/icons";
import cn from "clsx"

interface ListStarLayoutProps extends WithClassName {
    numb?: number | 5
}

export const ListStarLayout = (props : ListStarLayoutProps) => {
    return (
        <div className={cn(
            props.className,
            "flex items-center"
        )}>
            <div className="gap-1 relative">
                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">{iconStar}</i>
                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">{iconStar}</i>
                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">{iconStar}</i>
                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">{iconStar}</i>
                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">{iconStar}</i>

                <div
                    style={{
                        width: `${props.numb ? ( props.numb*20 ) : (100)}%`,
                    }}
                    className="max-w-full block whitespace-nowrap overflow-hidden absolute gap-1 top-0 left-0 right-0 bottom-0"
                >
                    <i className="w-4 mx-1 inline-block fill-yellow-500">{iconStar}</i>
                    <i className="w-4 mx-1 inline-block fill-yellow-500">{iconStar}</i>
                    <i className="w-4 mx-1 inline-block fill-yellow-500">{iconStar}</i>
                    <i className="w-4 mx-1 inline-block fill-yellow-500">{iconStar}</i>
                    <i className="w-4 mx-1 inline-block fill-yellow-500">{iconStar}</i>
                </div>
            </div>
        </div>
    );
};
