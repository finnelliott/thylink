import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/../../prisma/prismadb"
import { currentUser } from '@clerk/nextjs'

export async function GET(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            clerk_id: clerkUser.id
        }
    })
    return new Response(JSON.stringify(user))
}
 
export async function PUT(request: NextRequest) {
    const { name, username, bio } = await request.json()
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            clerk_id: clerkUser.id
        }
    })
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }
    const updatedUser = await prisma.user.update({
        where: {
            clerk_id: clerkUser.id
        },
        data: {
            name,
            username,
            bio,
        }
    })

    return new Response(JSON.stringify(updatedUser))
}