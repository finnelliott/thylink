import { Link, User } from "@prisma/client"
import CreateLinkButton from "./CreateLinkButton"
import LinkButton from "./LinkOptionsButton"
import EditUserButton from "./EditUserButton"
import VisitSiteButton from "./VisitSiteButton"

export default function EditSite({ 
    user 
}: {
    user: User & {
        links: Link[]
    }
}) {
    return (
        <div className="space-y-4 sm:max-w-lg mx-auto flex flex-col items-center justify-center relative">
            <h2 className="text-2xl font-medium text-black">{user.name}</h2>
            {user.bio && <p className="text-base font-normal text-gray-600 pb-2">{user.bio}</p>}
            <div className="div flex w-full justify-center space-x-2 pb-4"><EditUserButton user={user} /><VisitSiteButton user={user} /></div>
            <div className="w-full flex flex-col space-y-2">
                {user.links.map(link => (
                    <div key={link.id} className="w-full inline-flex items-center px-4 py-2 border border-gray-800 text-sm font-medium rounded-md shadow-sm text-gray-900 bg-white justify-between">
                        <div className="w-6 h-6" />
                        {link.title}
                        <LinkButton link={link} user={user} />
                    </div>
                ))}
            </div>
            <CreateLinkButton user={user} />
        </div>
    )
}