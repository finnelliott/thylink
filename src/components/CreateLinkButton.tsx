"use client";

import { useState } from "react";
import CreateLinkModal from "./CreateLinkModal";
import { User } from "@prisma/client";

export default function CreateLinkButton({ user }: { user: User }) {
    const [ createLinkModalOpen, setCreateLinkModalOpen ] = useState(false)
    return (
        <>
        <button onClick={() => setCreateLinkModalOpen(true)} className="w-full justify-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900">Add link</button>
        <CreateLinkModal open={createLinkModalOpen} setOpen={setCreateLinkModalOpen} user={user} />
        </>
    )
}