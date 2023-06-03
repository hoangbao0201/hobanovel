

interface FormIntroduceProps {
    description: string
}

const FormIntroduce = ({ description } : FormIntroduceProps) => {

    return (
        <div className="flex -mx-4">
            <div className="px-4" dangerouslySetInnerHTML={{
                __html: description
            }}/>
        </div>
    )
}

export default FormIntroduce;
