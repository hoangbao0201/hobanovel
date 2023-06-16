import { iconEllipsis } from "../../../public/icons"


interface PaginationLayout {
    countPage: number
    currentPage: number
    handleChangePage: any
}

export const PaginationLayout = ({ countPage, currentPage, handleChangePage } : PaginationLayout) => {

    console.log(currentPage)

    return (
        <ul className="flex items-center gap-2 text-gray-600">
            <li onClick={() => handleChangePage(1)}>
                <span className={`py-1 px-3 rounded-md block border select-none cursor-pointer dark:hover:bg-white/5 dark:border-white ${ currentPage === 1 ? 'dark:bg-white/25 bg-blue-400 text-white' : '' }`}>1</span>
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
                                <span className={`py-1 px-3 rounded-md block border select-none cursor-pointer dark:hover:bg-white/5 dark:border-white ${ currentPage === number ? 'dark:bg-white/25 bg-blue-400 text-white' : '' }`}>{number}</span>
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
                        <span className={`py-1 px-3 rounded-md block border select-none cursor-pointer dark:hover:bg-white/5 dark:border-white ${ currentPage === countPage ? 'dark:bg-white/25 bg-blue-400 text-white' : '' }`}>{countPage}</span>
                    </li>
                )
            }

        </ul>
    )
}