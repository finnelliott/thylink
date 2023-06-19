import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import logo from "@/../public/thylink-logo-black.png";

export default function Header() {
    return (
        <header className="flex justify-between items-center py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <div className="h-8 w-auto" ><Image src={logo} width={113.78} height={32} className="object-contain" alt="thyl.ink logo" /></div>
                <div className="w-8 h-8 flex items-center justify-center"><UserButton /></div>
            </div>
        </header>
    )
}