import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/../../prisma/prismadb"
import { currentUser } from '@clerk/nextjs'
 
export async function PUT(request: NextRequest) {
    const { id, name, username, bio } = await request.json()
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (clerkUser.id !== user.clerk_id) {
        return new Response("Unauthorized", { status: 401 });
    }
    const updatedUser = await prisma.user.update({
        where: {
            id
        },
        data: {
            name,
            username,
            bio
        }
    })

    return new Response(JSON.stringify(updatedUser))
}