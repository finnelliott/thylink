"use client";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline"
import { Link, User } from "@prisma/client"
import { Fragment, useState } from "react"
import EditLinkModal from "./EditLinkModal";
import DeleteLinkModal from "./DeleteLinkModal";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function LinkOptionsButton({ link, user }: { link: Link, user: User }) {
  const [ editLinkModalOpen, setEditLinkModalOpen ] = useState<boolean>(false)
  const [ deleteLinkModalOpen, setDeleteLinkModalOpen ] = useState<boolean>(false)
    return (
        <>
        <Menu as="div" className="relative flex-none">
              <Menu.Button className="h-6 w-6 bg-transparent hover:bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-1.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900 font-normal hover:bg-gray-100 w-full text-left'
                        )}
                      >
                        Visit URL<span className="sr-only">, {link.url}</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setEditLinkModalOpen(true)}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900 font-normal hover:bg-gray-100 w-full text-left'
                        )}
                      >
                        Edit link<span className="sr-only">, {link.title}</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setDeleteLinkModalOpen(true)}
                        className={classNames(
                          active ? 'bg-red-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-red-900 font-normal hover:bg-red-50 w-full text-left'
                        )}
                      >
                        Delete link<span className="sr-only">, {link.title}</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
            <EditLinkModal open={editLinkModalOpen} setOpen={setEditLinkModalOpen} user={user} link={link} />
            <DeleteLinkModal open={deleteLinkModalOpen} setOpen={setDeleteLinkModalOpen} user={user} link={link} />
        </>
    )
}