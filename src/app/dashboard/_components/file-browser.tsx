"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Loader2, RowsIcon } from "lucide-react"
import { useState, useMemo } from "react"
import { DataTable } from "./files-table"
import { columns } from "./columns-files"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Doc } from "../../../../convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FileBrowser({
  title,
  shortlistedOnly,
  deletedOnly,
}: {
  title: string
  shortlistedOnly?: boolean
  deletedOnly?: boolean
}) {
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  const { user, isLoaded: userLoaded } = useUser()
  const router = useRouter()

  const shortlisted = useQuery(api.files.getAllShortListed)
  const files = useQuery(api.files.getFiles, {
    shortlisted: shortlistedOnly,
    deletedOnly,
  })

  const isLoading = files === undefined

  // Group files by year and get available years
  const { filesByYear, availableYears } = useMemo(() => {
    if (!files) return { filesByYear: {}, availableYears: [] }

    const byYear: Record<string, any[]> = {}

    files.forEach((file) => {
      const creationDate = new Date(file._creationTime)
      const year = creationDate.getFullYear().toString()

      if (!byYear[year]) {
        byYear[year] = []
      }

      byYear[year].push(file)
    })

    return {
      filesByYear: byYear,
      availableYears: Object.keys(byYear).sort().reverse(),
    }
  }, [files])

  // Get files for the current view based on selected year
  const currentFiles = useMemo(() => {
    if (selectedYear === "all") {
      return files || []
    }
    return filesByYear[selectedYear] || []
  }, [files, filesByYear, selectedYear])

  // Filtered data based on search query
  const modifiedFiles = useMemo(() => {
    return currentFiles
      .map((file: Doc<"files">) => ({
        ...file,
        isShortlisted: (shortlisted ?? []).some((shortlisted) => shortlisted.userId === file.userId),
      }))
      .filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.post?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.telephone?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
  }, [currentFiles, shortlisted, searchQuery])

  if (!userLoaded) {
    return <p>Loading user data...</p>
  }

  const isAdmin = user?.publicMetadata?.role === "admin"
  const isCommissioner = user?.publicMetadata?.role === "commissioner"
  const isCAO = user?.publicMetadata?.role === "cao"
  const isTechnical = user?.publicMetadata?.role === "technical"

  if (!isAdmin && !isCommissioner && !isCAO && !isTechnical) {
    router.push("/")
    return null
  }

  const exportToExcel = () => {
    const filteredData = modifiedFiles.map((file) => ({
      Name: file.name,
      Post: file.post,
      Telephone: file.telephone,
      Email: file.email,
      "Shortlisted?": file.isShortlisted ? "Yes" : "No",
      Date: new Date(file._creationTime).toLocaleDateString("en-GB"),
    }))

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(filteredData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Files")

    // Generate filename with year if specific year is selected
    const filename = selectedYear !== "all" ? `application_data_${selectedYear}.xlsx` : "application_data.xlsx"

    // Write the workbook to an Excel file
    XLSX.writeFile(workbook, filename)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Add title with year if specific year is selected
    const title = selectedYear !== "all" ? `Files Data - ${selectedYear}` : "Files Data"

    doc.text(title, 14, 10)

    const tableData = modifiedFiles.map((file) => [
      file.name,
      file.post,
      file.telephone,
      file.isShortlisted ? "Yes" : "No",
    ])

    doc.autoTable({
      head: [["Name", "Post", "Telephone", "Shortlisted"]],
      body: tableData,
    })

    // Generate filename with year if specific year is selected
    const filename = selectedYear !== "all" ? `application_data_${selectedYear}.pdf` : "application_data.pdf"

    doc.save(filename)
  }

  return (
    <div>
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
      <div className="md:hidden flex flex-col gap-5 mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Year Filter */}
        <div className="w-full md:w-64">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year} ({filesByYear[year]?.length || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search by job post, applicant name or telephone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

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
            <Button variant="destructive" onClick={exportToPDF} disabled={modifiedFiles.length === 0}>
              <FileText className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>

            <Button variant="secondary" onClick={exportToExcel} disabled={modifiedFiles.length === 0}>
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

        {!isLoading && modifiedFiles.length === 0 && (
          <div className="flex flex-col gap-4 w-full items-center mt-12 md:mt-24">
            <div className="text-2xl text-gray-500">No applications found</div>
            {selectedYear !== "all" && (
              <div className="text-lg text-gray-400">No data available for {selectedYear}</div>
            )}
          </div>
        )}

        <TabsContent value="table">
          {modifiedFiles.length > 0 && (
            <>
              {selectedYear !== "all" && (
                <div className="mb-4 text-lg font-medium">
                  Showing {modifiedFiles.length} applications from {selectedYear}
                </div>
              )}
              <DataTable
                //@ts-ignore
                columns={columns}
                data={modifiedFiles}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

