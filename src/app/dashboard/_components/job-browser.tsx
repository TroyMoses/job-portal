"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2, RowsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "./jobs-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";

export function JobBrowser({
  title,
  deletedOnly,
}: {
  title: string;
  deletedOnly?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const jobs = useQuery(api.jobs.getAllJobs);
  const isLoading = jobs === undefined;

  const modifiedJobs =
    jobs
      ?.map((job: Doc<"jobs">) => ({
        ...job,
      }))
      .filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.salaryScale.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? [];

  // Ensure user is loaded
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
    <div>
      <div>
        <div className="hidden md:flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>

          {isAdmin && (
            <Link href={"/dashboard/addjob"}>
              <Button type="button" className="text-sm px-2 py-1">
                Upload Job
              </Button>
            </Link>
          )}
        </div>
        <div className="md:hidden flex flex-col gap-5 mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          {isAdmin && (
            <Link href={"/dashboard/addjob"}>
              <Button type="button" className="text-sm px-2 py-1">
                Upload Job
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search by job title or salary scale..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full max-w-lg"
      />

      <Tabs defaultValue="table">
        <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:justify-between md:items-center items-start">
          <TabsList className="mb-2">
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-12 md:mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading jobs...</div>
          </div>
        )}

        <TabsContent value="table">
          <DataTable columns={columns} data={modifiedJobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
