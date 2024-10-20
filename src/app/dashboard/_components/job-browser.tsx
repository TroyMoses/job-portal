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
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  deletedOnly,
}: {
  title: string;
  deletedOnly?: boolean;
}) {

  const jobs = useQuery(api.jobs.getAllJobs);
  const isLoading = jobs === undefined;

  const modifiedJobs =
  jobs?.map((job: Doc<"jobs">) => ({
      ...job,
    })) ?? [];

  return (
    <div>
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>

        <Link href={"/dashboard/addjob"}>
            <Button type="button" className="text-sm px-2 py-1">
              Upload Job
            </Button>
          </Link>
      </div>
      <div className="md:hidden flex flex-col gap-5 mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <Link href={"/dashboard/addjob"}>
            <Button type="button" className="text-sm px-2 py-1">
              Upload Job
            </Button>
          </Link>

      </div>

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
          {/* @ts-ignore */}
          <DataTable columns={columns} data={modifiedJobs} />
        </TabsContent>
      </Tabs>

      {jobs?.length === 0 && <Placeholder />}
    </div>
  );
}
