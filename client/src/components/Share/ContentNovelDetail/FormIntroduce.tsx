

interface FormIntroduceProps {
    description: string
}

const FormIntroduce = ({ description } : FormIntroduceProps) => {

    return (
        <div className="px-4 break-words" dangerouslySetInnerHTML={{
            __html: description
        }}/>
    )
}

export default FormIntroduce;
