import { ReactNode } from "react"
import { iconAngleRight } from "../../../public/icons"




interface PageTitleProps {
    children: ReactNode
}

const PageTitle = ({children} : PageTitleProps) => {

    return (
        <h2 className="text-[18px] text-gray-700 uppercase font-bold px-4 mb-3">
            <span>{children}</span> <i className="w-4 h-4 inline-block">{iconAngleRight}</i>
        </h2>
    )
}

export default PageTitle