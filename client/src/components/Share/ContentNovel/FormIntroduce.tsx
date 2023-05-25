import { PageHomeProps } from "@/pages";
import { NovelType } from "@/types";

interface FormIntroduceProps {
    description: string
}

const FormIntroduce = ({ description } : FormIntroduceProps) => {

    return (
        <div className="px-4">
            <div className="" dangerouslySetInnerHTML={{
                __html: description
            }}/>
        </div>
    )
}

export default FormIntroduce;
