import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import prisma from "@/../../prisma/prismadb";

export async function GET(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized", { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: {
            clerk_id: clerkUser.id
        }
    })
    if (!user) {
        return new Response("Unauthorized", { status: 401 })
    }
    if (!user.domain) {
        return new Response("No domain set on user", { status: 404 })
    }
    const res = await fetch(`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${user.domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.AUTH_BEARER_TOKEN}`
        }
    }).then(async res => await res.json());
    return new Response(JSON.stringify(res))
}

export async function POST(request: NextRequest) {
    const { url } = await request.json()
    const user = await currentUser();
    if (!user) {
        return new Response("Unauthorized", { status: 401 })
    }
    const result = await fetch(`https://api.vercel.com/v10/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`, {
        method: "POST",
        body: JSON.stringify({
            "name": url
        }),
        headers: {
            "Authorization": `Bearer ${process.env.AUTH_BEARER_TOKEN}`
        }
    })
    if (result.status == 200) {
        await prisma.user.update({
            where: {
                clerk_id: user.id
            },
            data: {
                domain: url
            }
        })
    }
    const data = await result.json()
    return new Response(JSON.stringify(data), {
        status: result.status
    })
}

export async function DELETE(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized", { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: {
            clerk_id: clerkUser.id
        }
    })
    if (!user) {
        return new Response("Unauthorized", { status: 401 })
    }
    const result = await fetch(`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${user.domain}?teamId=${process.env.TEAM_ID_VERCEL}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${process.env.AUTH_BEARER_TOKEN}`
        }
    }).then(async res => await res.json());
    await prisma.user.update({
        where: {
            clerk_id: clerkUser.id
        },
        data: {
            domain: {
                unset: true
            }
        }
    })
    return new Response(JSON.stringify(result))
}