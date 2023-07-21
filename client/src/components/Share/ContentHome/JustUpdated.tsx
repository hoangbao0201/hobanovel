import Link from "next/link";

import { NovelType } from "@/types";
import { PROPERTIES_NOVEL } from "@/constants/data";


interface JustUpdatedProps {
    novels?: NovelType[]
}

const JustUpdated = ({ novels= [] } : JustUpdatedProps) => {

    return (
        <div className="px-4">
    
            {
                novels && novels.length > 0 ? (
                    <table className="block relative border">
                        <tbody className="overflow-x-auto">
                            {
                                novels.map((novel : NovelType, index) => {
                                    return (
                                        <tr key={novel.novelId} className={`${index%2 && "bg-[#fcfcfa]"} rounded-md hover:bg-slate-100 hover:text-red-800`}>
                                            <td className="p-2 text-sm text-slate-600">
                                                <span className="line-clamp-1">{PROPERTIES_NOVEL['genres'][novel.category-1].value || "Không tìm thấy"}</span>
                                            </td>
                                            <td className="w-1/4 pr-2 text-slate-700 font-semibold text-base">
                                                <h3>
                                                    <Link className="line-clamp-1" href={`/truyen/${novel.slug}`}>
                                                        {novel.title || "Không tìm thấy"}
                                                    </Link>
                                                </h3>
                                            </td>
                                            <td className="w-1/4 pr-2 text-slate-700 font-semibold text-base">
                                                <h3>
                                                    <Link className="line-clamp-1" href={`/truyen/${novel.slug}`}>
                                                        {novel.title || "Không tìm thấy"}
                                                    </Link>
                                                </h3>
                                            </td>
                                            <td className="p-2">
                                                <span title={`tác giả ${novel.author}`} className="line-clamp-1">{novel.author || "Không tìm thấy"}</span>
                                            </td>
                                            <td className="p-2 text-sm text-slate-600">
                                                <span className="line-clamp-1">Nguyễn Hoàng Bảo</span>
                                            </td>
                                            <td className="p-2 text-sm text-slate-600">
                                                <time className="line-clamp-1">2 phút trước</time>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                ) : (
                    <div>Không có truyện nào</div>
                )
            }    

        </div>

    )
}

export default JustUpdated;