"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function SideNav() {
  const pathname = usePathname();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  // Ensure user is loaded
  if (!userLoaded) {
    return <p>Loading user data...</p>;
  }

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isCommissioner = user?.publicMetadata?.role === "commissioner";

  if (!isAdmin && !isCommissioner) {
    router.push("/");
    return null;
  }

  return (
    <div className="w-40 flex flex-row md:flex-col md:gap-4">
      <Link href="/dashboard/jobs">
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/jobs"),
          })}
        >
          <FileIcon /> All Jobs
        </Button>
      </Link>

      <Link href="/dashboard/applications">
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/applications"),
          })}
        >
          <FileIcon /> Applications
        </Button>
      </Link>

      <Link href="/dashboard/shortlist">
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/shortlist"),
          })}
        >
          <StarIcon /> Shortlist
        </Button>
      </Link>

      <Link href="/dashboard/rejected">
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/rejected"),
          })}
        >
          <StarIcon /> Rejected
        </Button>
      </Link>

      <Button
        variant={"link"}
        className={clsx("flex gap-2", {
          "text-blue-500": pathname.includes("/dashboard/applicant"),
        })}
      >
        <StarIcon /> Applicant
      </Button>

      <Link href="/dashboard/aptitude-test">
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/aptitude-test"),
          })}
        >
          <StarIcon /> Aptitude Test
        </Button>
      </Link>

      {/* <Link href="/dashboard/trash">
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/trash"),
          })}
        >
          <TrashIcon /> Trash
        </Button> 
      </Link>*/}
    </div>
  );
}
