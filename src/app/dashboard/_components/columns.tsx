"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";

export const columns: ColumnDef<Doc<"jobs"> >[] = [
  {
    accessorKey: "title",
    header: "Job Title",
  },
  {
    accessorKey: "salaryScale",
    header: "Salary Scale",
  },
  {
    accessorKey: "purpose",
    header: "Purpose of The Job",
  },
  {
    accessorKey: "reportsTo",
    header: "Reports To",
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
];
