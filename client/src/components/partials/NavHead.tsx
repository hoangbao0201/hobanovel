import Link from "next/link";
import { iconHome } from "../../../public/icons";


const NavHead = () => {

    return (
        <nav className="w-full border-b bg-gray-200">
            <div className="max-w-5xl mx-auto flex items-center px-3 relative">
                <ul className="float-left">
                    <li className="float-left block">
                        <Link href={`/`} className="mx-3">
                            <i className="w-5 h-5 block">{iconHome}</i>
                        </Link>
                    </li>
                    <li className="float-left block">
                        <Link href={`/`} className="mx-3">
                            <i className="w-5 h-5 block">{iconHome}</i>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavHead;