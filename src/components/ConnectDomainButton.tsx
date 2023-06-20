"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import ConnectDomainModal from "./ConnectDomainModal";

export default function ConnectDomainButton({ user }: { user: User }) {
    const [ connectDomainModalOpen, setConnectDomainModalOpen ] = useState(false)
    return (
        <>
        <button onClick={() => setConnectDomainModalOpen(true)} className="w-auto h-10 rounded-full border border-gray-200 hover:bg-gray-50 bg-transparent text-gray-600 flex items-center justify-center px-4 py-2 text-sm"><GlobeAltIcon className="w-5 h-5 mr-2" /><span>Connect</span></button>
        <ConnectDomainModal open={connectDomainModalOpen} setOpen={setConnectDomainModalOpen} user={user} />
        </>
    )
}