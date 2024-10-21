"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "../../../public/1234.png";

export default function Nav() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="h-[15vh] overflow-hidden shadow-md px-8">
      <div className="items-center container mx-auto justify-between flex"></div>
      <div className="w-[100%] md:w-[100%] h-[100%] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="w-[200px] h-[150px] md:w-[250px] md:h-[250px] flex items-center space-x-2">
          <Link href={"/"}>
            <Image
              src={LogoImage}
              alt="Log"
              width={100}
              height={100}
              className="w-[50%] h-[50%]  ml-4 mt-5"
            />
          </Link>
          <span className="w-[100%] h-[40%] py-6 mt-5 font-extrabold">
            Kakumiro District Local Government
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Button size={"sm"} variant={"destructive"}>
            <Link href="/">Application Guidelines</Link>
          </Button>
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-1.5 text-[14px] sm:text-[16px] sm:px-6 sm:py-2 bg-blue-600 font-semibold text-white rounded-lg hover:bg-blue-800 transition-all duration-300">
                Log In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex gap-5">
              {isAdmin && (
                <Button size={"sm"} variant={"outline"}>
                  <Link href="/dashbord/">Admin Dashboard</Link>
                </Button>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
