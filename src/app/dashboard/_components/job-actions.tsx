import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";
import Link from "next/link";

export function JobCardActions({ job }: { job: Doc<"jobs"> }) {
  // const deleteJob = useMutation(api.jobs.deleteJob);
  // const restoreJob = useMutation(api.jobs.restoreJob);
  const { toast } = useToast();
  const me = useQuery(api.users.getMe);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the job for our deletion process. Jobs are
              deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                // await deleteJob({
                //   jobId: file._id,
                // });
                toast({
                  variant: "default",
                  title: "Job marked for deletion",
                  description: "Your job will be deleted soon",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={`/admin/editjob/${job._id}`}>
            <DropdownMenuItem
              onClick={() => {}}
              className="flex gap-1 items-center cursor-pointer"
            >
              <FileIcon className="w-4 h-4" /> View/Edit Job
            </DropdownMenuItem>
          </Link>

          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || job.userId === me?._id
              );
            }}
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // if (job.shouldDelete) {
                //   restoreJob({
                //     jobId: job._id,
                //   });
                // } else {
                //   setIsConfirmOpen(true);
                // }
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              {job.shouldDelete ? (
                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                  <UndoIcon className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                  <TrashIcon className="w-4 h-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
