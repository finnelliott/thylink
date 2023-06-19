
"use client";

import { User } from "@prisma/client";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function VisitSiteButton({ user }: { user: User }) {
    return (
        <Link href={`/sites/${user.username}`} target="_blank" rel="noopener noreferer" className="w-auto h-10 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-transparent text-gray-600 flex items-center justify-center text-sm">
            <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
            <span>Visit</span>
        </Link>
    )
}