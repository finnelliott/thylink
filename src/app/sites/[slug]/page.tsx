import prisma from "@/../../prisma/prismadb";
import Site from "@/components/Site";

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
        <main className="py-48 px-4 sm:px-6 lg:px-8">
            <Site user={user} />
        </main>
    )
}