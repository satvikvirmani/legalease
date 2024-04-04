import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function Page() {
  return (
    <div className="hero items-left flex h-[80vh] h-screen w-9/12 w-full flex-col justify-center bg-[url('/background.jpg')]	bg-cover bg-no-repeat p-[5%]">
      <div className="title mb-[5%]">
        <h1 className="m-0 text-2xl">Find Your Perfect Advocate:</h1>
        <h2>Explore, Decide, Review</h2>
      </div>
      <p className="text-md mb-10 max-w-2xl	">
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
