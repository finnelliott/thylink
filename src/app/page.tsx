import Image from "next/image";
import logo from "@/../../public/thylink-logo-black.png"
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

export default function Home () {
    return (
        <main className="prose py-24 max-w-prose mx-auto">
            <Image src={logo} width={113.78} height={32} alt="Thy Link Logo" />
            <p>Behold, good folk! We introduceth to thee, <strong>Thy Link</strong>, a wondrous creation for those who seeketh to shareth their online presence with the world. This noble alternative to Linktree shall provideth a single, unified platform for all thy links, so that thou mayest easily direct thy followers to the many realms of thy digital kingdom.</p>

            <p>With Thy Link, thou shalt:</p>

            <ul>
            <li><strong>Assembleth all thy links</strong>: Bringeth together thy social media profiles, blogs, and other online abodes in one place, making it easier for thy followers to findeth and engageth with thee.</li>
            <li><strong>Useth custom domains</strong>: Establish thy presence with a domain that is truly thine own, for a more professional and memorable experience.</li>
            <li><em>Coming Soon</em> - <strong>Customizeth thy page</strong>: Adorn thy page with colors, images, and fonts that reflecteth thy unique style and personality.</li>
            <li><em>Coming Soon</em> - <strong>Analyzeth thy performance</strong>: Gaineth insights into the number of visitors and clicks on thy links, so thou mayest better understandeth thy audience and their interests.</li>
            </ul>

            <p>Waste not another moment, good sirs and ladies! Embark on thy journey to a more organized and efficient online presence with Thy Link.</p>
            <Link href="/app" className="flex items-center">Begin Thy Journey<ArrowLongRightIcon className="w-5 h-5 ml-3" /></Link>
        </main>
    )
}