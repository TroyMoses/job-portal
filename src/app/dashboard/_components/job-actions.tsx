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

export function JobCardActions({
    job,
    isFavorited,
  }: {
    job: Doc<"jobs"> & { imageUrl:  string | null};
    isFavorited: boolean;
  }) {
    const deleteJob = useMutation(api.jobs.deletejob);
    const restoreJob = useMutation(api.jobs.restoreJob);
    const toggleFavorite = useMutation(api.jobs.toggleFavorite);
    const { toast } = useToast();
    const me = useQuery(api.users.getMe);
  
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
    return (
      <>
            <AlertDialog open={isConfirmOpen} onOpenChange={ setIsConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will mark the job for deletion. Jobs are deleted periodically.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteJob({
                    jobId: job._id,
                  });
                  setIsConfirmOpen(false);
                  toast({
                    variant: "default",
                  title: "File marked for deletion",
                  description: "Your file will be deleted soon",
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
            <DropdownMenuItem
              onClick={() => {
                if (!job.imageId) return;
                window.open(job.imageId, "_blank");
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <FileIcon className="w-4 h-4" /> Download
            </DropdownMenuItem>
  
            <DropdownMenuItem
              onClick={() => {
                toggleFavorite({
                  jobId: job._id,
                });
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              {isFavorited ? (
                <div className="flex gap-1 items-center">
                  <StarIcon className="w-4 h-4" /> Unfavorite
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <StarHalf className="w-4 h-4" /> Favorite
                </div>
              )}
            </DropdownMenuItem>
  
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
                  if (job.shouldDelete) {
                    restoreJob({
                      jobId: job._id,
                    });
                  } else {
                    setIsConfirmOpen(true);
                  }
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
  