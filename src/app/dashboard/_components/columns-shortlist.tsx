"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { FileCardActions } from "./file-actions";

export const columns: ColumnDef<Doc<"files"> & { isShortlisted: boolean } & { isRejected: boolean }>[] = [
  {
    accessorKey: "name",
    header: "Applicant Name",
  },
  {
    accessorKey: "post",
    header: "Post Applied For",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telephone",
    header: "Telephone",
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
          <FileCardActions
            file={row.original}
            isShortlisted={row.original.isShortlisted}
            isRejected={row.original.isRejected}
          />
        </div>
      );
    },
  },
];
