import { iconEllipsis } from "../../../public/icons"


interface PaginationLayout {
    countPage: number
    currentPage: number
    handleChangePage: any
}

export const PaginationLayout = ({ countPage, currentPage, handleChangePage } : PaginationLayout) => {

    return (
        <ul className="flex items-center gap-2">
            <li onClick={() => handleChangePage(1)}>
                <span className={`py-2 px-4 rounded-md block border select-none cursor-pointer dark:hover:bg-white/5 dark:border-white ${ currentPage === 1 ? 'dark:bg-white/25' : '' }`}>1</span>
            </li>

            {
                currentPage > 4 && (
                    <span>
                        <i className="w-4 h-4 block dark:fill-white">{iconEllipsis}</i>
                    </span>
                )
            }

            {
                [
                    currentPage-2,
                    currentPage-1,
                    currentPage,
                    currentPage+1,
                    currentPage+2,
                ].map((number) => {
                    if(number > 1 && number<countPage) {
                        return (
                            <li key={number} onClick={() => handleChangePage(number)}>
                                <span className={`py-2 px-4 rounded-md block border select-none cursor-pointer dark:hover:bg-white/5 dark:border-white ${ currentPage === number ? 'dark:bg-white/25' : '' }`}>{number}</span>
                            </li>
                        )
                    }
                })
            }

            {
                countPage - currentPage > 4 && (
                    <span>
                        <i className="w-4 h-4 block dark:fill-white">{iconEllipsis}</i>
                    </span>
                )
            }

            {
                countPage > 1 && (
                    <li onClick={() => handleChangePage(countPage)}>
                        <span className={`py-2 px-4 rounded-md block border select-none cursor-pointer dark:hover:bg-white/5 dark:border-white ${ currentPage === countPage ? 'dark:bg-white/25' : '' }`}>{countPage}</span>
                    </li>
                )
            }

        </ul>
    )
}