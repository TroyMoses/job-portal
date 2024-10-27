"use client";

import { useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
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
import { useToast } from "@/components/ui/use-toast";
import { RejectionReasonDialog } from "./RejectionReasonDialog";

export function FileCardActions({
  file,
  isShortlisted,
  isRejected,
}: {
  file: Doc<"files">;
  isShortlisted: boolean;
  isRejected: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const toggleShortlisted = useMutation(api.files.toggleShortlisted);
  const toggleRejected = useMutation(api.files.toggleRejected);

  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  const handleRejection = (reason: string) => {
    toggleRejected({
      userId: file.userId as Id<"users">,
      reason,
    });
    toast({
      variant: "success",
      title: "Applicant Not Shortlisted",
      description: "Applicant has been added to the not-shortlisted table",
    });
    setShowRejectionDialog(false);
  };

  return (
    <>
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
                  toast({
                    variant: "success",
                    title: "Applicant Shortlisted",
                    description: "Applicant has been added to the shortlisted table",
                  });
                }}
                className="flex gap-1 items-center cursor-pointer"
              >
                <div className="flex gap-1 items-center">
                  <StarIcon className="w-4 h-4" /> Shortlist
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowRejectionDialog(true)}
                className="flex gap-1 items-center cursor-pointer"
              >
                <div className="flex gap-1 items-center">
                  <StarHalf className="w-4 h-4" /> Don{"'"}t Shortlist
                </div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showRejectionDialog && (
        <RejectionReasonDialog
          onSubmit={handleRejection}
          onClose={() => setShowRejectionDialog(false)}
        />
      )}
    </>
  );
}
