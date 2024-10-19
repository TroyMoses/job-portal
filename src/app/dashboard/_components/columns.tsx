"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { JobCardActions } from "./job-actions";

export const columns: ColumnDef<Doc<"jobs">>[] = [
  {
    accessorKey: "title",
    header: "Job Title",
  },
  {
    accessorKey: "salaryScale",
    header: "Salary Scale",
  },
  {
    accessorKey: "reportsTo",
    header: "Reports To",
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
      return (
        <div>
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <JobCardActions
            job={row.original}
          />
        </div>
      );
    },
  },
];
