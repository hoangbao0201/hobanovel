import { PageHomeProps } from "@/pages";
import { NovelType } from "@/types";

interface FormIntroduceProps {
    description: string
}

const FormIntroduce = ({ description } : FormIntroduceProps) => {

    return (
        <div>
            <div className="" dangerouslySetInnerHTML={{
                __html: description
            }}/>
        </div>
    )
}

export default FormIntroduce;
