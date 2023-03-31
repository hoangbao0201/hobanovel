import { NovelType } from "@/types";


interface JustPostedProps {
    novels?: NovelType[]
}

const JustPosted = ({ novels = [] } : JustPostedProps) => {

    return (
        <div className="px-4">
            <div className="p-4 rounded-lg bg-gray-100 mb-3">
                <h3 className="mb-5 text-xl font-semibold">Mới đăng</h3>
                <div></div>
            </div>
        </div>
    )
}

export default JustPosted;