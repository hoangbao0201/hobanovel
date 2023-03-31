import { useEffect, useState } from "react"

const Header = () => {

    const [isHeader, setIsHeader] = useState(true);

    useEffect(() => {
        let prevScrollPosition = window.pageYOffset;
    
        const handleScroll = () => {
            const currentScrollPosition = window.pageYOffset;
            const shouldHideHeader = currentScrollPosition > prevScrollPosition && currentScrollPosition >= 100;
        
            setIsHeader(!shouldHideHeader);
            prevScrollPosition = currentScrollPosition;
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <div className="w-full h-12"></div>
            <header className={`transition-all ${isHeader ? "opacity-100" : "opacity-0 pointer-events-none"} fixed top-0 left-0 right-0 z-50`}>
                <div className={`w-full bg-white border-b border-b-gray-100`}>
                    <div className="max-w-7xl mx-auto flex items-center h-12 px-3 bg-red-500">
                        Header
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header