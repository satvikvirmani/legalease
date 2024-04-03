import Link from 'next/link';
import Image from 'next/image'
import { Button } from '@/app/ui/button';

export default function Page() {
  return (
    <div className="hero flex flex-col w-9/12 items-left justify-center h-[80vh] p-[5%] bg-[url('/background.jpg')] bg-no-repeat	bg-cover w-full h-screen">
      <div className="title mb-[5%]">
        <h1 className='text-lg m-0'>Find Your Perfect Advocate:</h1>
        <h2>Explore, Decide, Review</h2>
      </div>
      <p className='text-md mb-10 max-w-2xl	'>
        Welcome to <em>LegalEase</em>, where legal expertise meets consumer
        choice. We bring together a comprehensive database of skilled lawyers,
        complete with ratings and consumer feedback, to help you make informed
        decisions for your legal needs.
      </p>
      <div className="btns flex">
        <Link href="/login">
          <Button>Log in</Button>
        </Link>
      </div>
    </div>
  );
}
