

import cn from "clsx"
import styled from "styled-components";
import { WithClassName } from "@/types/common";
import { LEVEL_VALUE } from "@/constants/data";

interface TextStyleProps {
    rank: number;
}
const TextStyle = styled.span<TextStyleProps>`
    background-image: url("/emotions/rank/${props => props.rank || 0}.gif");
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
            rank={props.rank || 1}
            className={cn(
                props.className,
                `block duration-300 ease-in-out bg-auto bg-center line-clamp-1 whitespace-nowrap ${!props.text && ""} ${ props.rank == 0 ? "" : "text-transparent" }`,
            )}
        >{props.text || LEVEL_VALUE[props.rank].value }</TextStyle>
    )
}

export default TextRank;