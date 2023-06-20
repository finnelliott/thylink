import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ArrowPathIcon, ClockIcon, UserCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { User } from '@prisma/client'

export default function EditUserModal({ open, setOpen, user }: { open: boolean, setOpen: (value: boolean) => void, user: User }) {

  const cancelButtonRef = useRef(null)
  const [ name, setName ] = useState<string>(user.name)
  const [ username, setUsername ] = useState<string>(user.username)
  const [ bio, setBio ] = useState<string>(user.bio ?? "")
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')
  const [ success, setSuccess ] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch(`/api/users`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: user.id,
              name,
              username,
              bio
          })
      })
      if (res.status === 200) {
          setSuccess(true)
          setLoading(false)
          setOpen(false)
          setTimeout(() => {
            location.reload()
          }, 500)
      } else {
        throw new Error('Something went wrong.')
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
                    <UserCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-left sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Edit profile
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Make changes to your profile and how its displayed to your audience.
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
                    <div className="flex">
                        <div className="flex-shrink-0">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                        </div>
                        <div className="ml-auto pl-3">
                            <button onClick={() => setError('')} className="font-normal text-sm text-red-700 hover:text-red-600 flex items-center">
                                Try again
                                <ArrowPathIcon className='w-4 h-4 ml-2' />
                            </button>
                        </div>
                    </div>
                </div>}

                {!loading && error == '' && <form onSubmit={handleSubmit}>
                    <div className="space-y-1.5 pt-4 mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input required={true} value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm" />
                    </div>
                    <div className="space-y-1.5 mb-6">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <div className="w-full relative">
                            <input required={true} value={username} onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm pr-48" />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 sm:text-sm">.domain.com</span>
                        </div>
                    </div>
                    <div className="space-y-1.5 mb-6">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <div className="w-full relative">
                            <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} name="bio" id="bio" className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm pr-48" />
                        </div>
                    </div>
                    <button type="submit" className="w-full justify-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900">Update profile</button>
                </form>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}