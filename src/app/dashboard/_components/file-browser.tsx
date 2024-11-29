"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2, RowsIcon } from "lucide-react";
import { useState } from "react";
import { DataTable } from "./files-table";
import { columns } from "./columns-files";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export function FileBrowser({
  title,
  shortlistedOnly,
  deletedOnly,
}: {
  title: string;
  shortlistedOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const shortlisted = useQuery(api.files.getAllShortListed);
  const files = useQuery(api.files.getFiles, {
    shortlisted: shortlistedOnly,
    deletedOnly,
  });
  const isLoading = files === undefined;

  // Filtered data based on search query
  const modifiedFiles =
    files
      ?.map((file: Doc<"files">) => ({
        ...file,
        isShortlisted: (shortlisted ?? []).some(
          (shortlisted) => shortlisted.userId === file.userId
        ),
      }))
      .filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.post?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.telephone?.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? [];

  if (!userLoaded) {
    return <p>Loading user data...</p>;
  }

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isCommissioner = user?.publicMetadata?.role === "commissioner";
  const isCAO = user?.publicMetadata?.role === "cao";
  const isTechnical = user?.publicMetadata?.role === "technical";

  if (!isAdmin && !isCommissioner && !isCAO && !isTechnical) {
    router.push("/");
    return null;
  }

  const exportToExcel = () => {
    const filteredData = modifiedFiles.map((file) => ({
      Name: file.name,
      Post: file.post,
      Telephone: file.telephone,
      Email: file.email, // Example of another field
      "Shortlisted?": file.isShortlisted ? "Yes" : "No",
      Date: new Date(file._creationTime).toLocaleDateString("en-GB"), 
    }));
  
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Files");
  
    // Write the workbook to an Excel file
    XLSX.writeFile(workbook, "application_data.xlsx");
  };
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Files Data", 14, 10);
  
    const tableData = modifiedFiles.map((file) => [
      file.name,
      file.post,
      file.telephone,
      file.isShortlisted ? "Yes" : "No",
    ]);
  
    doc.autoTable({
      head: [["Name", "Post", "Telephone", "Shortlisted"]],
      body: tableData,
    });
  
    doc.save("application_data.pdf");
  };
  
  return (
    <div>
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
      <div className="md:hidden flex flex-col gap-5 mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search by job post, applicant name or telephone..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full max-w-lg"
      />

      <Tabs defaultValue="table">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="table" className="flex gap-2 items-center">
                <RowsIcon /> Table
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex gap-4">
            <Button variant="destructive" onClick={exportToPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>

            <Button variant="secondary" onClick={exportToExcel}>
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>



        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-12 md:mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading applications...</div>
          </div>
        )}

        <TabsContent value="table">
          <DataTable
            //@ts-ignore
            columns={columns}
            data={modifiedFiles}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
