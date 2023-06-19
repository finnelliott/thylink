import prisma from "@/../../prisma/prismadb";
import Site from "@/components/Site";
import logo from "@/../public/thylink-logo-gray.png";
import Image from "next/image";

export default async function SiteHome({ params }: { params: { slug: string }}) {
    const user = await prisma.user.findUnique({
        where: {
            username: params.slug
        },
        include: {
            links: true
        }
    })
    if (!user) {
        return (
            <main className="py-48">
                User not found
            </main>
        )
    }
    return (
        <div className="w-screen min-h-screen relative">
        <main className="py-48 px-4 sm:px-6 lg:px-8">
            <Site user={user} />
        </main>
        <footer className="w-screen flex items-center justify-center">
            <a href="https://www.thyl.ink" target="_blank" rel="noreferer noopener" className="mx-auto flex justify-center absolute bottom-4 text-gray-300 items-center text-xs flex-row"><div className="mr-2">Made with</div><Image src={logo} width={113.78} height={32} className="text-gray-300 mt-1" alt="thyl.ink logo" /></a>
        </footer>
        </div>
    )
}