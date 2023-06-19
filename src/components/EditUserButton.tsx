"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import EditUserModal from "./EditUserModal";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function EditUserButton({ user }: { user: User }) {
    const [ editUserModalOpen, setEditUserModalOpen ] = useState(false)
    return (
        <>
        <button onClick={() => setEditUserModalOpen(true)} className="w-auto h-10 rounded-full border border-gray-200 hover:bg-gray-50 bg-transparent text-gray-600 flex items-center justify-center px-4 py-2 text-sm"><PencilIcon className="w-5 h-5 mr-2" /><span>Edit</span></button>
        <EditUserModal open={editUserModalOpen} setOpen={setEditUserModalOpen} user={user} />
        </>
    )
}