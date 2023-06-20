import { NextRequest } from "next/server";
import prisma from "@/../../prisma/prismadb"

export default async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) return new Response("No url provided", { status: 400 })
    const user = await prisma.user.findUnique({
        where: {
            domain: url
        }
    })
    if (!user) return new Response("No user found", { status: 404 })
    return new Response(user.username, { status: 200 })
}