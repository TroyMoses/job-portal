"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Loader2, RowsIcon, Calendar } from "lucide-react"
import { useState, useMemo } from "react"
import { DataTable } from "./rejected-table"
import { columns } from "./columns-rejected"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Doc } from "../../../../convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RejectedBrowser({
  title,
  rejectedOnly,
  deletedOnly,
}: {
  title: string
  rejectedOnly?: boolean
  deletedOnly?: boolean
}) {
  const { user, isLoaded: userLoaded } = useUser()
  const router = useRouter()

  const [type, setType] = useState<Doc<"files">["type"] | "all">("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  const rejected = useQuery(api.files.getAllRejected)

  const files = useQuery(api.files.getFiles, {
    rejectedOnly: rejectedOnly,
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

  const modifiedFiles = useMemo(() => {
    return currentFiles
      .map((file: Doc<"files">) => ({
        ...file,
        isRejected: (rejected ?? []).some((rejected) => rejected.userId === file.userId),
      }))
      .filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.post?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.telephone?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
  }, [currentFiles, rejected, searchQuery])

  // Ensure user is loaded
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
          placeholder="Search by job post, applicant name, email or telephone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <Tabs defaultValue="table">
        <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:justify-between md:items-center items-start">
          <TabsList className="mb-2">
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-12 md:mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading rejected applications...</div>
          </div>
        )}

        {!isLoading && modifiedFiles.length === 0 && (
          <div className="flex flex-col gap-4 w-full items-center mt-12 md:mt-24">
            <div className="text-2xl text-gray-500">No rejected applications found</div>
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
                  Showing {modifiedFiles.length} rejected applications from {selectedYear}
                </div>
              )}
              {/* @ts-ignore */}
              <DataTable columns={columns} data={modifiedFiles} />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

