
interface LoadingLayoutProps {
    w?: string
    h?: string
}

const LoadingLayout = ({ w, h } : LoadingLayoutProps) => {


    return <div style={{ width: `${w || "80px"}`, height: `${h || "28px"}` }} className="">Loading</div>
}

export default LoadingLayout