"use client";

import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowPathIcon, ClockIcon, GlobeAltIcon, UserCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { User } from '@prisma/client'
import ConfiguredSection from './ConfiguredSection';

export default function ConnectDomainModal({ open, setOpen, user }: { open: boolean, setOpen: (value: boolean) => void, user: User }) {
  const cancelButtonRef = useRef(null)
  const [ removing, setRemoving ] = useState<boolean>(false)
  const [ refreshing, setRefreshing ] = useState<boolean>(false)
  const [ tempUser, setTempUser ] = useState<User>(user)
  const [ domain, setDomain ] = useState<string | undefined>(user.domain ?? undefined)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')
  const [ success, setSuccess ] = useState<boolean>(false)
  const [ domainInfo, setDomainInfo ] = useState<string | undefined>()
  const [ verified, setVerified ] = useState<boolean>(false)

  async function revalidateDomain() {
    setRefreshing(true)
    getDomains()
    const res = await fetch(`/api/users`, {
      method: "GET"
    }).then(res => res.json())
    setTempUser(res)
    setRefreshing(false)
  }

  async function getDomains() {
    
    if (user.domain) {
      const res = await fetch(`/api/domains/check?domain=${user.domain}`).then(res => res.json())
      if (res.error) {
        setError(res.error.message)
      }
      setDomainInfo(res)
    }
  }

  async function handleRemoveDomain() {
    setRemoving(true)
    const res = await fetch(`/api/domains`, {
      method: "DELETE",
    })
    setRemoving(false)
    location.reload();
  }

  useEffect(() => {
    getDomains()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch(`/api/domains`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              url: domain,
          })
      })
      const data = await res.json()
      if (res.status == 409) {
        setError(`Cannot add ${domain} since it's already assigned to another project.`)
        setLoading(false)
      }
      if (res.status == 200) {
        setSuccess(true)
        setLoading(false)
        revalidateDomain()
      }
    } catch (e) {
      setError("Sorry, something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => {setError('');setOpen(false)}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="">
                  <div className="mr-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <GlobeAltIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-left sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Connect a domain
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Set a custom domain for your profile.
                      </p>
                    </div>
                  </div>
                </div>

                {loading && <div className="rounded-md bg-gray-50 p-4 mt-4 animate-pulse">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-800">Loading...</h3>
                        </div>
                    </div>
                </div>}

                {error !== '' && <div className="rounded-md bg-red-50 p-4 mt-4">
                    <div className="flex flex-col w-full">
                        <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <h3 className="pt-3 flex-1 text-sm font-medium text-red-800">{error}</h3>
                        <div className="pt-3 flex-shrink-0">
                            <button onClick={() => {setError('');getDomains();}} className="font-normal text-sm text-red-700 hover:text-red-600 flex items-center">
                                Try again
                                <ArrowPathIcon className='w-4 h-4 ml-2' />
                            </button>
                        </div>
                    </div>
                </div>}

                {!loading && !tempUser.domain && error == '' && <form onSubmit={handleSubmit}>
                    <div className="space-y-1.5 mb-4 pt-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Domain</label>
                        <input required={true} value={domain} onChange={(e) => setDomain(e.target.value)} type="text" name="name" id="name" className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="w-full justify-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900">Connect domain</button>
                </form>}

                {!loading && error == '' && tempUser.domain && <div className='mt-4 shadow-inner rounded-md bg-gray-50 p-4 flex flex-col'>
                  <div className="flex justify-between items-center">
                  <p className="text-base text-gray-600">{tempUser.domain}</p>
                  <div className="flex space-x-2">
                    <button onClick={() => revalidateDomain()} className="rounded bg-gray-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">{refreshing ? "...": "Refresh"}</button>
                    <button onClick={() => handleRemoveDomain()} className="rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">{removing ? "..." : "Remove"}</button>
                  </div>
                  </div>
                  <ConfiguredSection domainInfo={domainInfo} />
                </div>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}