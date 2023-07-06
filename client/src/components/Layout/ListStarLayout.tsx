import { WithClassName } from "@/types/common";
import { iconStar } from "../../../public/icons";
import cn from "clsx"

interface ListStarLayoutProps extends WithClassName {
    numb?: number | 5
    size?: number
}

export const ListStarLayout = (props : ListStarLayoutProps) => {
    return (
        <div className={cn(
            props.className,
            "-ml-1"
        )}>
            <div className="relative flex items-center">
                <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400 opacity-40`}>{iconStar}</i>
                <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400 opacity-40`}>{iconStar}</i>
                <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400 opacity-40`}>{iconStar}</i>
                <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400 opacity-40`}>{iconStar}</i>
                <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400 opacity-40`}>{iconStar}</i>


                <div
                    style={{
                        width: `${props.numb ? ( ( Math.round(props.numb * 2) /2 )/5 )*100 : 100}%`, 
                    }}
                    className="absolute flex items-center top-0 left-0 overflow-hidden"
                >
                    <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400`}>{iconStar}</i>
                    <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400`}>{iconStar}</i>
                    <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400`}>{iconStar}</i>
                    <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400`}>{iconStar}</i>
                    <i className={`w-${props.size || 4} sm:w-4 w-3 mx-1 flex-shrink-0 fill-yellow-400`}>{iconStar}</i>
                </div>

            </div>

        </div>
    );
};
