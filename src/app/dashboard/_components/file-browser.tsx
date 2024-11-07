"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2, RowsIcon } from "lucide-react";
import { useState } from "react";
import { DataTable } from "./files-table";
import { columns } from "./columns-files";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function FileBrowser({
  title,
  shortlistedOnly,
  deletedOnly,
}: {
  title: string;
  shortlistedOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const shortlisted = useQuery(api.files.getAllShortListed);
  const files = useQuery(api.files.getFiles, {
    shortlisted: shortlistedOnly,
    deletedOnly,
  });
  const isLoading = files === undefined;

  // Filtered data based on search query
  const modifiedFiles =
    files
      ?.map((file: Doc<"files">) => ({
        ...file,
        isShortlisted: (shortlisted ?? []).some(
          (shortlisted) => shortlisted.userId === file.userId
        ),
      }))
      .filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.post?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.telephone?.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? [];

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
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
      <div className="md:hidden flex flex-col gap-5 mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search by job post, applicant name or telephone..."
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
            <div className="text-2xl">Loading applications...</div>
          </div>
        )}

        <TabsContent value="table">
          <DataTable
            //@ts-ignore
            columns={columns}
            data={modifiedFiles}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
