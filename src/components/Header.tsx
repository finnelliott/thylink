import { UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
        <header className="flex justify-between items-center py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <div>Links</div>
                <div className="w-8 h-8"><UserButton /></div>
            </div>
        </header>
    )
}