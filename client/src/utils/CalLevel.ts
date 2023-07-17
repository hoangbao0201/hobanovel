import { LEVEL_VALUE } from "@/constants/data"


export const CalLevel = (level: number) => {
    
    const position = LEVEL_VALUE[level <= 180 ? Math.round(level/20) : 9]
    const scale = ((level%20)*100)/20 || 100

    return { position, scale }
}