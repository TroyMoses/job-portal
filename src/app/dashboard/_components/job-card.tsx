import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Doc, Id } from "../../../../convex/_generated/dataModel";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { formatRelative } from "date-fns";
  
  import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
  import { ReactNode } from "react";
  import { useQuery } from "convex/react";
  import { api } from "../../../../convex/_generated/api";
  import Image from "next/image";
  import { JobCardActions } from "./job-actions";
  
  export function   JobCard({
    job,
  }: {
    job: Doc<"jobs"> & { isFavorited: boolean; imageUrl:  string | null};
  }) {
    const userProfile = useQuery(api.users.getUserProfile, {
      userId: job.userId,
    });
  
    const typeIcons = {
      normal: <ImageIcon />,
      urgent: <ImageIcon />,
      all: <ImageIcon />,
    closed: <ImageIcon />,
    } as Record<Doc<"jobs">["type"], ReactNode>;
  
    return (
      <Card>
        <CardHeader className="relative">
          <CardTitle className="flex gap-2 text-base font-normal">
            <div className="flex justify-center">{typeIcons[job.type]}</div>{" "}
            {job.title}
          </CardTitle>
          <div className="absolute top-2 right-2">
            <JobCardActions isFavorited={job.isFavorited} job={job} />
          </div>
        </CardHeader>
        <CardContent className="h-[200px] flex justify-center items-center">
          {job.imageId === "image" && job.imageId && (
            <Image alt={job.title} width="200" height="100" src={job.imageId} />
          )}

        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
            <Avatar className="w-6 h-6">
              <AvatarImage src={userProfile?.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {userProfile?.name}
          </div>
          <div className="text-xs text-gray-700">
            Uploaded on {formatRelative(new Date(job._creationTime), new Date())}
          </div>
        </CardFooter>
      </Card>
    );
  }