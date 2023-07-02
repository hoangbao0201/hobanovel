

import cn from "clsx"
import styled from "styled-components";
import { WithClassName } from "@/types/common";
import { LEVEL_VALUE } from "@/constants/data";

interface TextStyleProps {
    rank: number;
}
const TextStyle = styled.span<TextStyleProps>`
    /* background-image: url("/emotions/rank/${props => props.rank || 0}.gif"); */
    
    -webkit-background-clip: text;
`

interface TextRankProps extends WithClassName {
    alt?: string
    text?: string
    rank: number
}

const TextRank = (props : TextRankProps) => {


    return (
        <TextStyle
            style={props.rank == 0 ? {  } : { backgroundImage: `url("/emotions/rank/${props.rank}.gif")`, borderImage: `url("/emotions/rank/${props.rank}.gif") 2 round` }}
            rank={props.rank || 1}
            className={cn(
                props.className,
                `duration-300 ease-in-out bg-auto bg-center line-clamp-1 whitespace-nowrap text-center

                ${!props.text
                    ? (`font-bold text-xs uppercase border rounded-sm px-1 pt-[3px] ${props.rank == 0 ? "" : ""}`) 
                    : ("font-semibold text-base")} 

                ${ props.rank == 0 
                    ? "text-gray-700" 
                    : "text-transparent" }`,

            )}
        >{props.text || LEVEL_VALUE[props.rank].value }</TextStyle>
    )
}

export default TextRank;