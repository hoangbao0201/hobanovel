

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
            style={props.rank == 0 ? {  } : { 
                // backgroundImage: `url("/emotions/rank/${props.rank}.gif")`, 
                // borderImage: `url("/emotions/rank/${props.rank}.gif") 2 round` 
            }}
            rank={props.rank || 1}
            className={cn(
                props.className,
                `
                    whitespace-nowrap overflow-hidden relative

                    ${
                        props.text
                            ? ("font-bold")
                            : (`text-xs border px-2 rounded-sm border-orange-600 text-orange-600`)
                    }

                `,
            )}
        >
            {props.text || LEVEL_VALUE[props.rank <= 180 ? Math.round(props.rank/20) : 9].value }
            {!props.text && <span style={{ width: `${ (((props.rank%20)*100)/20) || 100 }%` }} className={`absolute block top-0 right-0 bottom-0 left-0 bg-yellow-500/40`}></span>}
        </TextStyle>
    )
}

// ${ props.rank == 0 
//     ? "text-gray-800" 
//     : "text-gray-800" }

export default TextRank;