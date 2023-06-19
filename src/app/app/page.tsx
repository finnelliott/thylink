import prisma from "@/../../prisma/prismadb";
import CreateSiteCard from "@/components/CreateSiteCard";
import EditSite from "@/components/EditSite";
import { currentUser, redirectToSignIn } from "@clerk/nextjs";

export default async function AppHome() {
    const clerkUser = await currentUser();
    if (!clerkUser) return redirectToSignIn();
    const user = await prisma.user.findUnique({
        where: {
            clerk_id: clerkUser.id
        },
        include: {
            links: true
        }
    })
    return (
        <main className="py-24 px-4 sm:px-6 lg:px-8">
            {!user ?
            <CreateSiteCard />
            :
            <EditSite user={user} />
            }
        </main>
    )
}