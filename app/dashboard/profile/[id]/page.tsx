import { fetchProvider } from '@/app/lib/data';
import { Form } from '@/app/ui/new-request';
import { auth } from '@/auth';

export default async function Page({ params }: { params: { id: string } }) {
  const provider = await fetchProvider(params.id);
  const session: any = await auth();

  return (
    <>
      {
        provider &&
        provider.map((provider, i) => {
          return (
            <main key={i}>
              <div className="h-full p-4">
                <div className="rounded-lg bg-white pb-8 shadow-xl">
                  <div className="h-[250px] w-full">
                    <img
                      src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
                      className="h-full w-full rounded-tl-lg rounded-tr-lg"
                    />
                  </div>
                  <div className="-mt-20 flex flex-col items-center">
                    <img
                      src="https://placehold.co/100"
                      className="w-100 rounded-full border-4 border-white"
                    />
                    <div className="mt-2 flex items-center space-x-2">
                      <p className="text-2xl">{provider.name}</p>
                    </div>
                    <p className="text-gray-700">{provider.title}</p>
                  </div>
                  <div className="mt-2 flex flex-1 flex-row items-center justify-end px-8 lg:items-end">
                    <div className="mt-2 flex items-center space-x-4">
                      <Form
                        consumerId={session?.user?.id}
                        consumername={session?.user?.name}
                        providerId={provider.id}
                        providerName={provider.name}
                      />
                    </div>
                  </div>
                </div>
                <div className="my-4 flex flex-col space-y-4 2xl:flex-row 2xl:space-x-4 2xl:space-y-0">
                  <div className="flex w-full flex-col 2xl:w-1/3">
                    <div className="flex-1 rounded-lg bg-white p-8 shadow-xl">
                      <h4 className="text-xl font-bold text-gray-900">
                        Personal Info
                      </h4>
                      <ul className="mt-2 text-gray-700">
                        <li className="flex border-y py-2">
                          <span className="w-24 font-bold">Full name:</span>
                          <span className="text-gray-700">{provider.name}</span>
                        </li>
                        <li className="flex border-b py-2">
                          <span className="w-24 font-bold">Age:</span>
                          <span className="text-gray-700">{provider.age}</span>
                        </li>
                        <li className="flex border-b py-2">
                          <span className="w-24 font-bold">Mobile:</span>
                          <span className="text-gray-700">{provider.phone}</span>
                        </li>
                        <li className="flex border-b py-2">
                          <span className="w-24 font-bold">Email:</span>
                          <span className="text-gray-700">{provider.email}</span>
                        </li>
                        <li className="flex border-b py-2">
                          <span className="w-24 font-bold">Interested Domains:</span>
                          <span className="text-gray-700">
                            {provider.interesteddomains}
                          </span>
                        </li>
                        <li className="flex border-b py-2">
                          <span className="w-24 font-bold">Expertise:</span>
                          <span className="text-gray-700">{provider.expertise}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4 flex w-full flex-col 2xl:w-2/3">
                      <div className="flex-1 rounded-lg bg-white p-8 shadow-xl">
                        <h4 className="text-xl font-bold text-gray-900">About</h4>
                        <p className="mt-2 text-gray-700">{provider.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex-1 rounded-lg bg-white p-8 shadow-xl">
                      <h4 className="text-xl font-bold text-gray-900">
                        Activity log
                      </h4>
                      <div className="relative px-4">
                        <div className="absolute h-full border border-dashed border-secondary border-opacity-20"></div>
      
                        <div className="my-6 -ml-1.5 flex w-full items-center">
                          <div className="z-10 w-1/12">
                            <div className="h-3.5 w-3.5 rounded-full bg-blue-600"></div>
                          </div>
                          <div className="w-11/12">
                            <p className="text-sm">Profile informations changed.</p>
                            <p className="text-xs text-gray-500">3 min ago</p>
                          </div>
                        </div>
                        <div className="my-6 -ml-1.5 flex w-full items-center">
                          <div className="z-10 w-1/12">
                            <div className="h-3.5 w-3.5 rounded-full bg-blue-600"></div>
                          </div>
                          <div className="w-11/12">
                            <p className="text-sm">
                              Connected with{' '}
                              <a href="#" className="font-bold text-blue-600">
                                Colby Covington
                              </a>
                              .
                            </p>
                            <p className="text-xs text-gray-500">15 min ago</p>
                          </div>
                        </div>
                        <div className="my-6 -ml-1.5 flex w-full items-center">
                          <div className="z-10 w-1/12">
                            <div className="h-3.5 w-3.5 rounded-full bg-blue-600"></div>
                          </div>
                          <div className="w-11/12">
                            <p className="text-sm">
                              Invoice{' '}
                              <a href="#" className="font-bold text-blue-600">
                                #4563
                              </a>{' '}
                              was created.
                            </p>
                            <p className="text-xs text-gray-500">57 min ago</p>
                          </div>
                        </div>
                        <div className="my-6 -ml-1.5 flex w-full items-center">
                          <div className="z-10 w-1/12">
                            <div className="h-3.5 w-3.5 rounded-full bg-blue-600"></div>
                          </div>
                          <div className="w-11/12">
                            <p className="text-sm">
                              Message received from{' '}
                              <a href="#" className="font-bold text-blue-600">
                                Cecilia Hendric
                              </a>
                              .
                            </p>
                            <p className="text-xs text-gray-500">1 hour ago</p>
                          </div>
                        </div>
                        <div className="my-6 -ml-1.5 flex w-full items-center">
                          <div className="z-10 w-1/12">
                            <div className="h-3.5 w-3.5 rounded-full bg-blue-600"></div>
                          </div>
                          <div className="w-11/12">
                            <p className="text-sm">
                              New order received{' '}
                              <a href="#" className="font-bold text-blue-600">
                                #OR9653
                              </a>
                              .
                            </p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="my-6 -ml-1.5 flex w-full items-center">
                          <div className="z-10 w-1/12">
                            <div className="h-3.5 w-3.5 rounded-full bg-blue-600"></div>
                          </div>
                          <div className="w-11/12">
                            <p className="text-sm">
                              Message received from{' '}
                              <a href="#" className="font-bold text-blue-600">
                                Jane Stillman
                              </a>
                              .
                            </p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )
        })
      }
    </>
  )
}
