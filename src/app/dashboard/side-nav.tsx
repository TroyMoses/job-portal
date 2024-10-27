"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function SideNav() {
  const pathname = usePathname();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  if (!userLoaded) {
    return <p>Loading user data...</p>;
  }

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isCommissioner = user?.publicMetadata?.role === "commissioner";
  const isCAO = user?.publicMetadata?.role === "cao";
  const isTechnical = user?.publicMetadata?.role === "technical";

  if (!isAdmin && !isCommissioner && !isCAO && !isTechnical) {
    router.push("/");
    return null;
  }

  return (
    <div className="w-40 flex flex-row md:flex-col md:gap-4">
      <Link href="/dashboard/home">
        <Button
          variant={"link"}
          className={clsx("flex gap-2", {
            "text-blue-500": pathname.includes("/dashboard/home"),
          })}
        >
          <HomeIcon /> Dashboard
        </Button>
      </Link>
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
          <StarIcon /> Not Shortlisted
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

      {isAdmin && (
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
      )}

      {isCommissioner && (
        <Link href="/dashboard/applicant-results">
          <Button
            variant={"link"}
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes(
                "/dashboard/applicant-results"
              ),
            })}
          >
            <StarIcon /> Applicant Results
          </Button>
        </Link>
      )}

      {isAdmin && (
        <Link href="/dashboard/applicant-results">
          <Button
            variant={"link"}
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes(
                "/dashboard/applicant-results"
              ),
            })}
          >
            <StarIcon /> Applicant Results
          </Button>
        </Link>
      )}

      {isCAO && (
        <Link href="/dashboard/applicant-results">
          <Button
            variant={"link"}
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes(
                "/dashboard/applicant-results"
              ),
            })}
          >
            <StarIcon /> Applicant Results
          </Button>
        </Link>
      )}

      {isTechnical && (
        <Link href="/dashboard/applicant-results">
          <Button
            variant={"link"}
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes(
                "/dashboard/applicant-results"
              ),
            })}
          >
            <StarIcon /> Applicant Results
          </Button>
        </Link>
      )}

      {isCommissioner && (
        <Link href="/dashboard/appointed">
          <Button
            variant={"link"}
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes("/dashboard/appointed"),
            })}
          >
            <StarIcon /> Appointed Applicants
          </Button>
        </Link>
      )}

      {isAdmin && (
        <Link href="/dashboard/appointed">
          <Button
            variant={"link"}
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes("/dashboard/appointed"),
            })}
          >
            <StarIcon /> Appointed Applicants
          </Button>
        </Link>
      )}

      {isCAO && (
        <Link href="/dashboard/appointed">
          <Button
            variant={"link"}
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes("/dashboard/appointed"),
            })}
          >
            <StarIcon /> Appointed Applicants
          </Button>
        </Link>
      )}

      {isTechnical && (
        <Link href="/dashboard/appointed">
          <Button
            variant={"link"}
            className={clsx("flex gap-2", {
              "text-blue-500": pathname.includes("/dashboard/appointed"),
            })}
          >
            <StarIcon /> Appointed Applicants
          </Button>
        </Link>
      )}

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
