import { currentUser } from "@clerk/nextjs";
import prisma from "@/../../prisma/prismadb";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
    const req = await request.json();
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            clerk_id: clerkUser.id
        }
    });
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (user.id !== req.user_id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const link = await prisma.link.create({
        data: {
            user_id: req.user_id,
            url: req.url,
            title: req.title,
        }
    });

    return new Response(JSON.stringify(link));
}

export async function PUT(request: Request) {
    const req = await request.json();
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            clerk_id: clerkUser.id
        }
    });
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (user.id !== req.user_id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const link = await prisma.link.findUnique({
        where: {
            id: req.id
        },
        include: {
            user: true
        }
    });
    if (!link) {
        return new Response("Link not found", { status: 404 });
    }
    
    if (link.user.id !== req.user_id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const updatedLink = await prisma.link.update({
        where: {
            id: req.id
        },
        data: {
            user_id: req.user_id,
            url: req.url,
            title: req.title,
        }
    });
    revalidateTag("user")
    return new Response(JSON.stringify(updatedLink));
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id') || '';
    if (!user_id) {
        return new Response("user_id not found", { status: 404 });
    }
    const id = searchParams.get('id') || '';
    if (!id) {
        return new Response("id for link not found", { status: 404 });
    }
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return new Response("Unauthorized", { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            clerk_id: clerkUser.id
        }
    });
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (user.id !== user_id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const link = await prisma.link.findUnique({
        where: {
            id
        },
        include: {
            user: true
        }
    });
    if (!link) {
        return new Response("Link not found", { status: 404 });
    }

    if (link.user.id !== user_id) {
        return new Response("Unauthorized", { status: 401 });
    }

    await prisma.link.delete({
        where: {
            id: id
        }
    });

    return new Response("Link deleted");
}