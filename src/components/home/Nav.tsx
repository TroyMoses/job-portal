import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useSession,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "../../../public/logo.png";

export default function Nav() {
  return (
    <div className="h-[13vh] overflow-hidden shadow-md">
      {/* <div className="items-center container mx-auto justify-between flex">
        <Link href="/" className="flex gap-2 items-center text-xl text-black -ml-5">
          <Image src="/logo.png" width="50" height="50" alt="sycom file drive logo" />
          <span className="hidden md:block">
            Sycom FileDrive
          </span>
        </Link>

        <div className="hidden md:block">
          <SignedIn>
            <Button variant={"outline"}>
              <Link href="/dashboard/files">Your Files</Link>
            </Button>
          </SignedIn>
        </div>

        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton afterSignOutUrl="/"/>
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div> */}
      <div className="w-[90%] md:w-[80%] h-[100%] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="w-[150px] h-[150px] md:w-[250px] md:h-[250px]">
          <Link href={"/"}>
            <Image
              src={LogoImage}
              alt="Log"
              width={250}
              height={250}
              className="w-[100%] h-[100%]"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-1.5 text-[14px] sm:text-[16px] sm:px-6 sm:py-2 bg-blue-600 font-semibold text-white rounded-lg hover:bg-blue-800 transition-all duration-300">
                Sign Up
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
