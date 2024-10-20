import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { StarHalf, StarIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function FileCardActions({
  file,
  isShortlisted,
}: {
  file: Doc<"files">;
  isShortlisted: boolean;
}) {
  const toggleShortlisted = useMutation(api.files.toggleShortlisted);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuItem
          onClick={() => {
            toggleShortlisted({
              userId: file.userId,
            });
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          {isShortlisted ? (
            <div className="flex gap-1 items-center">
              <StarIcon className="w-4 h-4" /> Reject
            </div>
          ) : (
            <div className="flex gap-1 items-center">
              <StarHalf className="w-4 h-4" /> Approve
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  );
}
