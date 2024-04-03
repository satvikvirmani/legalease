import { Button } from '@/components/ui/button'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-full h-screen grid place-items-center'>
      <div className='text-center flex flex-col gap-y-8'>
      <h1 className='text-xl'>Not Found</h1>
      <p className='text-sm'>Could not find requested resource</p>
      <Button>
      <Link href="/">Return Home</Link>
      </Button>
      </div>
    </div>
  )
}