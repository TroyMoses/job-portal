"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { RowsIcon } from "lucide-react";
import { DataTable } from "../../dashboard/_components/jobs-table";
import { columns } from "../../dashboard/_components/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            <Button type="button" className="text-sm px-2 py-1">
              Upload Job
            </Button>
          </Link>
        </div>
        <div className="md:hidden flex flex-col gap-5 mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          <Button type="button" className="text-sm px-2 py-1">
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

          <TabsContent value="table">
            <DataTable
              columns={columns}
              //@ts-ignore
              data={modifiedJobs}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DefaultLayout>
  );
}
