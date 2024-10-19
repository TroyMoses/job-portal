// "use client";

<<<<<<< HEAD
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api"; // Ensure this points to the correct path
import { UploadButton } from "../../dashboard/_components/upload-button"; // Button to upload new jobs
import { JobCard } from "../../dashboard/_components/job-card"; // Job card component for displaying jobs
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "../../dashboard/_components/search-bar"; // Search component
import { useState } from "react";
import { DataTable } from "../../dashboard/_components/job-table"; // Use a job table component here
import { columns } from "../../dashboard/_components/columns"; // Adjust import for job columns
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc, Id } from "../../../../convex/_generated/dataModel"; // Ensure this points to the correct path
import { Label } from "@/components/ui/label";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
=======
// import { useOrganization, useUser } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { api } from "../../../../convex/_generated/api"; // Ensure this points to the correct path
// // import { UploadButton } from "../../dashboard/_components/upload-button"; // Button to upload new jobs
// import { FileCard } from "../../dashboard/_components/file-card"; // Job card component for displaying jobs
// import Image from "next/image";
// import { GridIcon, Loader2, RowsIcon } from "lucide-react";
// import { SearchBar } from "../../dashboard/_components/search-bar"; // Search component
// import { useState } from "react";
// import { DataTable } from "../../dashboard/_components/file-table"; // Use a job table component here
// import { columns } from "../../dashboard/_components/columns"; // Adjust import for job columns
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Doc } from "../../../../convex/_generated/dataModel"; // Ensure this points to the correct path
// import { Label } from "@/components/ui/label";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import { Metadata } from "next";
// import DefaultLayout from "@/components/Layouts/DefaultLayout";
// import Link from "next/link";
>>>>>>> main

// function Placeholder() {
//   return (
//     <div className="flex flex-col gap-8 w-full items-center mt-24">
//       <Image
//         alt="an image representing no jobs available"
//         width="300"
//         height="300"
//         src="/empty.svg"
//       />
//       <div className="text-2xl">You have no jobs, upload one now</div>
//       {/* <UploadButton /> */}
//     </div>
//   );
// }

<<<<<<< HEAD
export default function JobBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"jobs">["status"] | "all">("all");
=======
// export default function JobBrowser({
//   title,
//   favoritesOnly,
//   deletedOnly,
// }: {
//   title: string;
//   favoritesOnly?: boolean;
//   deletedOnly?: boolean;
// }) {
//   const organization = useOrganization();
//   const user = useUser();
//   const [query, setQuery] = useState("");
//   const [type, setType] = useState<"all">("all");
>>>>>>> main

//   let orgId: string | undefined = undefined;
//   if (organization.isLoaded && user.isLoaded) {
//     orgId = organization.organization?.id ?? user.user?.id;
//   }

<<<<<<< HEAD
  const favorites = useQuery(
    api.jobs.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const jobs = useQuery(
    api.jobs.getJobs,
    orgId
      ? {
          orgId,
          type: type === "all" ? (type as "urgent" | "normal" | "closed" ) : undefined,
          query,
          favoritesJob: favoritesOnly,
          deletedOnly,
        }
      : "skip"
  );

  const isLoading = jobs === undefined;

  const modifiedJobs =
    jobs?.map((job) => ({
      ...job,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.jobId === job._id
      ),
      imageId: job.imageId?.toString() ?? null,
    })) ?? [];
=======
//   // const jobs = useQuery(
//   //   api.jobs.allJobs, // Change to your jobs API endpoint
//   //   orgId
//   //     ? {
//   //         orgId,
//   //         type: type === "all" ? undefined : type,
//   //         query,
//   //       }
//   //     : "skip"
//   // );
//   const isLoading = jobs === undefined;

//   const modifiedJobs =
//     jobs?.map((job) => ({
//       ...job,
//       isFavorited: (favorites ?? []).some(
//         (favorite) => favorite.jobId === job._id // Ensure this matches your favorite structure
//       ),
//     })) ?? [];
>>>>>>> main

//   return (
//     <DefaultLayout>
//     <div>
//     <Breadcrumb pageName="Profile" />
//       <div className="hidden md:flex justify-between items-center mb-8">
//         <h1 className="text-4xl font-bold">{title}</h1>

//         <SearchBar query={query} setQuery={setQuery} />

//         <UploadButton />
//       </div>
//       <div className="md:hidden flex flex-col gap-5 mb-8">
//         <h1 className="text-4xl font-bold">{title}</h1>
//         <UploadButton />

//         <SearchBar query={query} setQuery={setQuery} />
//       </div>

//       <Tabs defaultValue="grid">
//         <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:justify-between md:items-center items-start">
//           <TabsList className="mb-2">
//             <TabsTrigger value="grid" className="flex gap-2 items-center">
//               <GridIcon />
//               Grid
//             </TabsTrigger>
//             <TabsTrigger value="table" className="flex gap-2 items-center">
//               <RowsIcon /> Table
//             </TabsTrigger>
//           </TabsList>

<<<<<<< HEAD
          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Job Type Filter</Label>
            <Select
              value={status}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="closed">Part-Time</SelectItem>

                {/* Add more job types if needed */}
              </SelectContent>
            </Select>
          </div>
        </div>
=======
//           <div className="flex gap-2 items-center">
//             <Label htmlFor="type-select">Job Type Filter</Label>
//             <Select
//               value={type}
//               onValueChange={(newType) => {
//                 setType(newType as any);
//               }}
//             >
//               <SelectTrigger id="type-select" className="w-[180px]">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 <SelectItem value="full-time">Full-Time</SelectItem>
//                 <SelectItem value="part-time">Part-Time</SelectItem>
//                 {/* Add more job types if needed */}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
>>>>>>> main

//         {isLoading && (
//           <div className="flex flex-col gap-8 w-full items-center mt-12 md:mt-24">
//             <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
//             <div className="text-2xl">Loading your jobs...</div>
//           </div>
//         )}

<<<<<<< HEAD
        <TabsContent value="grid">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {modifiedJobs?.map((job) => {
              return <JobCard key={job._id} job={job} />; // Use JobCard for displaying jobs
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          {/* Implement your job table component here */}
          <DataTable columns={columns} data={modifiedJobs} />
        </TabsContent>
      </Tabs>
=======
//         <TabsContent value="grid">
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
//             {modifiedJobs?.map((job) => {
//               return <FileCard key={job._id} job={job} />; // Use JobCard for displaying jobs
//             })}
//           </div>
//         </TabsContent>
//         <TabsContent value="table">
//           {/* Implement your job table component here */}
//           <DataTable columns={columns} data={modifiedJobs} />
//         </TabsContent>
//       </Tabs>
>>>>>>> main

//       {jobs?.length === 0 && <Placeholder />}
//     </div>
//     </DefaultLayout>
//   );
// }
