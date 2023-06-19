import { Link, User } from "@prisma/client"

export default function Site({ 
    user 
}: {
    user: User & {
        links: Link[]
    }
}) {
    return (
        <div className="space-y-4 sm:max-w-lg mx-auto flex flex-col items-center justify-center">
            <h2 className="text-2xl font-medium text-black">{user.name}</h2>
            {user.bio && <p className="text-base font-normal pb-4 text-gray-600">{user.bio}</p>}
            <div className="w-full flex flex-col space-y-2">
                {user.links.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-full justify-center inline-flex items-center px-4 py-2 border border-gray-800 text-sm font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-50">{link.title}</a>
                ))}
            </div>
        </div>
    )
}