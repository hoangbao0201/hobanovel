import styled from "styled-components";


const CustomizeSelect = styled.select`
    padding: 5px 10px;
    outline: none;
    
`

interface OptionsProps {
    value: string
    label: string
    id: string
}

interface SelectOptionsProps {
    defaultValue: OptionsProps
    options: OptionsProps[]
    handle: any
}

const SelectOptions = ({ defaultValue, options, handle } : SelectOptionsProps) => {

    const handleFoodChange = (e : any) => {
        handle({ sortBy: e.target.value, page: 1 })
    };

    return (
        <CustomizeSelect onChange={handleFoodChange} defaultValue={defaultValue.label}>
            {
                options.map((item, index) => {
                    return (
                        <option className="" key={index} value={item.id}>{item.label}</option>
                    )
                })
            }
        </CustomizeSelect>
    )
}

export default SelectOptions;