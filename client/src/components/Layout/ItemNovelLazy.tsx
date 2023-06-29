import styled from "styled-components";




const ItemLazyStyle = styled.div`
    animation: 2s ease-in-out infinite c;

    @keyframes c {
        50% {
            opacity: 0.4;
        }
    }
`

const ItemNovelLazy = () => {

    return (
        <>
            <div className="flex">

                <ItemLazyStyle className="relative w-20 h-28 bg-gray-300 shadow">
                </ItemLazyStyle>
                
                <div className="flex-1 ml-3">
                    <ItemLazyStyle className="bg-gray-300 w-full mb-3 h-5"></ItemLazyStyle>
                    <ItemLazyStyle className="bg-gray-300 w-full mb-3 h-14"></ItemLazyStyle>
                    <div className="mb-3 text-base flex align-middle items-center justify-between">
                        <ItemLazyStyle className="bg-gray-300 w-2/3 mr-3 h-4"></ItemLazyStyle>
                        <ItemLazyStyle className="bg-gray-300 w-1/3 h-4"></ItemLazyStyle>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ItemNovelLazy;