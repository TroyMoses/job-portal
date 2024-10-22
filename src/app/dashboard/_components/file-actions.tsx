"use client";

import { Doc } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, StarHalf, StarIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

export function FileCardActions({
  file,
  isShortlisted,
  isRejected,
}: {
  file: Doc<"files">;
  isShortlisted: boolean;
  isRejected: boolean;
}) {
  const router = useRouter();
  const toggleShortlisted = useMutation(api.files.toggleShortlisted);
  const toggleRejected = useMutation(api.files.toggleRejected);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/dashboard/applicant/${file.userId}`);
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <div className="flex gap-1 items-center">
            <StarIcon className="w-4 h-4" /> View
          </div>
        </DropdownMenuItem>

        {!isShortlisted && !isRejected && (
          <>
            <DropdownMenuItem
              onClick={() => {
                toggleShortlisted({
                  userId: file.userId,
                });
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <div className="flex gap-1 items-center">
                <StarIcon className="w-4 h-4" /> Approve
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toggleRejected({
                  userId: file.userId,
                });
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <div className="flex gap-1 items-center">
                <StarHalf className="w-4 h-4" /> Reject
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
