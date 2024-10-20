"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadButton } from "./upload-button";
import Image from "next/image";
import { Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./jobs-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">You have no files, upload one now</div>
      <UploadButton />
    </div>
  );
}

export function JobBrowser({
  title,
  shortlistedOnly,
  deletedOnly,
}: {
  title: string;
  shortlistedOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  const shortlisted = useQuery(api.files.getAllShortListed);

  const files = useQuery(api.files.getFiles, {
    shortlisted: shortlistedOnly,
    deletedOnly,
  });
  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file: Doc<"files">) => ({
      ...file,
      isShortlisted: (shortlisted ?? []).some(
        (shortlisted) => shortlisted.userId === file.userId
      ),
    })) ?? [];

  return (
    <div>
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <UploadButton />
      </div>
      <div className="md:hidden flex flex-col gap-5 mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <UploadButton />

        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <Tabs defaultValue="table">
        <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:justify-between md:items-center items-start">
          <TabsList className="mb-2">
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="ppt">PPT</SelectItem>
                <SelectItem value="pptx">PPTX</SelectItem>
                <SelectItem value="doc">DOCS</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="xlsx">EXCEL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-12 md:mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your files...</div>
          </div>
        )}

        <TabsContent value="table">
          {/* @ts-ignore */}
          <DataTable columns={columns} data={modifiedFiles} />
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder />}
    </div>
  );
}
