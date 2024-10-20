"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadButton } from "../../dashboard/_components/upload-button";
import Image from "next/image";
import { Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "../../dashboard/_components/search-bar";
import { useState } from "react";
import { DataTable } from "../../dashboard/_components/jobs-table";
import { columns } from "../../dashboard/_components/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image representing no jobs available"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">You have no jobs, upload one now</div>
      <UploadButton />
    </div>
  );
}

export default function JobBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {

  const jobs = useQuery(api.jobs.getAllJobs);

  const isLoading = jobs === undefined;

  const modifiedJobs =
    jobs?.map((job) => ({
      ...job,
    })) ?? [];

  return (
    <DefaultLayout>
      <div>
        <Breadcrumb pageName="Jobs" />
        <div className="hidden md:flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>

          <Link href={"/admin/addjob"}>
            <Button
              type="button"
              className="text-sm px-2 py-1"
            >
              Upload Job
            </Button>
          </Link>
        </div>
        <div className="md:hidden flex flex-col gap-5 mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          <Button
            type="button"
            className="text-sm px-2 py-1"
          >
            Upload Job
          </Button>

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
              <div className="text-2xl">Loading your jobs...</div>
            </div>
          )}
          
          <TabsContent value="table">
            <DataTable columns={columns} data={modifiedJobs} />
          </TabsContent>
        </Tabs>

      </div>
    </DefaultLayout>
  );
}
