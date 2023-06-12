import { PROPERTIES_NOVEL } from "@/constants/data";
import { NovelType } from "@/types";
import Link from "next/link";


interface JustUpdatedProps {
    novels?: NovelType[]
}

const JustUpdated = ({ novels= [] } : JustUpdatedProps) => {

    // console.log("J: ", novels)

    return (
        <>
            <h3 className="px-4 mb-5 text-xl font-semibold">Truyện mới cập nhật</h3>


                    {
                        novels ? (
                            <table className="block relative my-6 mx-3 pt-1 border-t">
                                <tbody className="overflow-x-auto">
                                    {
                                        novels.map((novel : NovelType, index) => {
                                            return (
                                                <tr key={novel.novelId} className={`${index%2 && "bg-[#fcfcfa]"} rounded-md hover:bg-slate-100 hover:text-red-800`}>
                                                    <td className="p-2 text-sm text-slate-600">
                                                        <h2 className="line-clamp-1">{PROPERTIES_NOVEL['genres'][novel.category-1].value || "Không tìm thấy"}</h2>
                                                    </td>
                                                    <td className="w-1/4 pr-2 text-slate-700 font-semibold text-base">
                                                        <Link href={`/truyen/${novel.slug}`}>
                                                            <h2 className="line-clamp-1">{novel.title || "Không tìm thấy"}</h2>
                                                        </Link>
                                                    </td>
                                                    <td className="w-1/4 pr-2 text-slate-700 font-semibold text-base">
                                                        <Link href={`/truyen/${novel.slug}`}>
                                                            <h2 className="line-clamp-1">{novel.title || "Không tìm thấy"}</h2>
                                                        </Link>
                                                    </td>
                                                    <td className="p-2">
                                                        <h2 className="line-clamp-1">{novel.author || "Không tìm thấy"}</h2>
                                                    </td>
                                                    <td className="p-2 text-sm text-slate-600">
                                                        <h2 className="line-clamp-1">Nguyễn Hoàng Bảo</h2>
                                                    </td>
                                                    <td className="p-2 text-sm text-slate-600">
                                                        <h2 className="line-clamp-1">2 phút trước</h2>
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

        </>

    )
}

export default JustUpdated;