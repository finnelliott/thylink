import prisma from '@/../../prisma/prismadb';
import { currentUser, redirectToSignIn } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

export default function CreatePageCard() {
    async function createPage(data: FormData) {
        'use server';
        const user = await currentUser();
        if (!user) return redirectToSignIn();
        const name = data.get("name") as string;
        const username = data.get("username") as string;
        const bio = data.get("bio") ? data.get("bio") as string : undefined;
        await prisma.user.create({
            data: {
                clerk_id: user.id,
                name,
                username,
                bio
            }
        })
        revalidatePath(`/app`);
        return;
    }

    return (
        <div className="border border-gray-200 bg-gray-50 rounded-2xl p-8 sm:max-w-lg mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-medium mb-2 text-black">Create a page</h2>
                <p className="text-sm font-normal text-gray-600">Provide some basic details in order to create your page.</p>
            </div>
            <form action={createPage}>
                <div className="space-y-1.5 mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input required={true} type="text" name="name" id="name" className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm" />
                </div>
                <div className="space-y-1.5 mb-6">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <div className="w-full relative">
                        <input required={true} type="text" name="username" id="username" className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm pr-48" />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 sm:text-sm">.thyl.ink</span>
                    </div>
                </div>
                <div className="space-y-1.5 mb-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <div className="w-full relative">
                        <textarea rows={3} name="bio" id="bio" className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm pr-48" />
                    </div>
                </div>
                <button type="submit" className="w-full justify-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900">Create page</button>
            </form>
        </div>
    )
}