
const ItemNovelLazy = () => {

    return (
        <div className="flex">
            <div className={`relative w-20 h-28 bg-gray-300 shadow`} style={{ animation: "2s ease-in-out infinite c" }}></div>
            
            <div className="flex-1 ml-3">
                <div className={`bg-gray-300 w-full mb-3 h-5`} style={{ animation: "2s ease-in-out infinite c" }}></div>
                <div className={`bg-gray-300 w-full mb-3 h-14`} style={{ animation: "2s ease-in-out infinite c" }}></div>
                <div className="mb-3 text-base flex align-middle items-center justify-between">
                    <div className={`bg-gray-300 w-2/3 mr-3 h-4`} style={{ animation: "2s ease-in-out infinite c" }}></div>
                    <div className={`bg-gray-300 w-1/3 h-4`} style={{ animation: "2s ease-in-out infinite c" }}></div>
                </div>
            </div>
        </div>
    )
}

export default ItemNovelLazy;