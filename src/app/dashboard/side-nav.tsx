"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const pathname = usePathname();

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

      <Link href="/dashboard/applicants">
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/applicants"),
          })}
        >
          <StarIcon /> Applicants
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
