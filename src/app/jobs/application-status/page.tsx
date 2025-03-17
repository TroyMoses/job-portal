"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useMemo } from "react"
import { api } from "../../../../convex/_generated/api"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Clock, Award, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ApplicationStatus = () => {
  const { user, isLoaded: userLoaded } = useUser()
  const [convexUserId, setConvexUserId] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)

  // Queries for user data
  const shortlisted = useQuery(api.files.getAllShortListed)
  const rejected = useQuery(api.files.getAllRejected)
  const applications = useQuery(api.files.getFiles, {})
  const convexUser = useQuery(api.users.getMe, {})
  const results = useQuery(api.results.getAllResults)
  const appointed = useQuery(api.files.getAllAppointed)

  // Get convex user ID
  useEffect(() => {
    if (convexUser && convexUser._id) {
      setConvexUserId(convexUser._id)
    }
  }, [convexUser])

  // Filter applications for the current user
  const userApplications = useMemo(() => {
    if (!applications || !convexUserId) return []
    return applications.filter((app) => app.userId === convexUserId)
  }, [applications, convexUserId])

  // Group applications by year
  const applicationsByYear = useMemo(() => {
    const byYear: Record<string, any[]> = {}

    userApplications.forEach((app) => {
      const creationDate = new Date(app._creationTime)
      const year = creationDate.getFullYear().toString()

      if (!byYear[year]) {
        byYear[year] = []
      }

      byYear[year].push(app)
    })

    return byYear
  }, [userApplications])

  // Get available years
  const availableYears = Object.keys(applicationsByYear).sort().reverse()

  // Get applications for the current view
  const currentApplications = useMemo(() => {
    if (selectedYear === "all") {
      return userApplications
    }
    return applicationsByYear[selectedYear] || []
  }, [userApplications, applicationsByYear, selectedYear])

  // Set the first application as selected by default when applications load
  useEffect(() => {
    if (currentApplications.length > 0 && !selectedApplication) {
      setSelectedApplication(currentApplications[0]._id)
    }
  }, [currentApplications, selectedApplication])

  if (!userLoaded || shortlisted === undefined) {
    return <p>Loading...</p>
  }

  // Get the selected application details
  const selectedApplicationData = currentApplications.find((app) => app._id === selectedApplication)

  // Determine application status for a specific application
  const getApplicationStatus = (application) => {
    const isShortlisted = shortlisted?.some((item) => item.userId === application.userId)
    const isRejected = rejected?.some((item) => item.userId === application.userId)
    const rejectedReason = rejected?.find((item) => item.userId === application.userId)?.reason
    const hasResult = results?.some((item) => item.userId === application.userId)
    const isAppointed = appointed?.some((item) => item.userId === application.userId)

    if (isAppointed) return { status: "appointed", label: "Appointed" }
    if (isShortlisted) return { status: "shortlisted", label: "Shortlisted", hasResult }
    if (isRejected) return { status: "rejected", label: "Not Shortlisted", reason: rejectedReason }
    return { status: "pending", label: "Pending" }
  }

  return (
    <div className="pt-[3rem] pb-[3rem]">
      <div className="w-[100%] h-[60vh] justify-center">
        <div className="w-[80%] mx-auto items-center justify-center gap-[2rem]">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-[28px] sm:text-[35px] lg:text-[40px] text-[#05264e] leading-[3rem] lg:leading-[4rem] font-extrabold">
              Your Application Status
            </h1>

            {!user ? (
              <p className="text-lg text-gray-600">Please log in to view your application status.</p>
            ) : userApplications.length === 0 ? (
              <div className="mt-4 text-center">
                <p className="text-xl font-semibold text-red-600">Status: Not Applied</p>
                <p className="text-lg text-gray-600">You have not applied for any job yet.</p>
                <Link href="/jobs/alljobs">
                  <Button className="mt-4">View Jobs</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-4 w-full max-w-[800px]">
                {/* Year filter if there are applications from multiple years */}
                {availableYears.length > 1 && (
                  <div className="mb-4 flex justify-end">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[180px]">
                        <Calendar className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {availableYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year} ({applicationsByYear[year]?.length || 0})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Application selection if there are multiple applications */}
                {currentApplications.length > 1 && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Your Applications</CardTitle>
                      <CardDescription>Select an application to view its status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentApplications.map((application) => {
                            const status = getApplicationStatus(application)
                            return (
                              <TableRow
                                key={application._id}
                                className={application._id === selectedApplication ? "bg-muted/50" : ""}
                              >
                                <TableCell>{new Date(application._creationTime).toLocaleDateString()}</TableCell>
                                <TableCell>{application.post}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={
                                      status.status === "appointed"
                                        ? "bg-green-500 text-white"
                                        : status.status === "shortlisted"
                                          ? "bg-blue-500 text-white"
                                          : status.status === "rejected"
                                            ? "bg-red-500 text-white"
                                            : "bg-yellow-500 text-white"
                                    }
                                  >
                                    {status.label}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedApplication(application._id)}
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                {/* Selected application status */}
                {selectedApplicationData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {currentApplications.length > 1
                          ? `Application for: ${selectedApplicationData.post}`
                          : "Your Application Status"}
                      </CardTitle>
                      <CardDescription>
                        Applied on {new Date(selectedApplicationData._creationTime).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const status = getApplicationStatus(selectedApplicationData)

                        switch (status.status) {
                          case "appointed":
                            return (
                              <div className="text-center">
                                <p className="text-2xl font-semibold mb-2 text-green-600 flex items-center justify-center">
                                  <Award className="mr-2 h-6 w-6" />
                                  Status: Appointed
                                </p>
                                <p className="text-lg text-gray-600">
                                  Congratulations, {selectedApplicationData.name}! <br />
                                  You have been appointed for the position of {selectedApplicationData.post}.
                                </p>
                              </div>
                            )

                          case "shortlisted":
                            return (
                              <div className="text-center">
                                <p className="text-2xl font-semibold mb-2 text-blue-600 flex items-center justify-center">
                                  <CheckCircle2 className="mr-2 h-6 w-6" />
                                  Status: Approved
                                </p>
                                <p className="text-lg text-gray-600">
                                  <span className="text-green-500 text-xl">
                                    Congratulations! {selectedApplicationData.name}
                                  </span>
                                  <br /> You have been shortlisted for the position of {selectedApplicationData.post}.
                                </p>
                                {status.hasResult ? (
                                  <Link href={`/jobs/my-scores`}>
                                    <Button className="mt-4">View My Scores</Button>
                                  </Link>
                                ) : (
                                  <Link href={`/jobs/aptitude-test/${convexUserId}`}>
                                    <Button className="mt-4">Attempt Aptitude Test</Button>
                                  </Link>
                                )}
                              </div>
                            )

                          case "rejected":
                            return (
                              <div className="text-center">
                                <p className="text-xl font-semibold text-red-600 flex items-center justify-center">
                                  <XCircle className="mr-2 h-6 w-6" />
                                  Status: Not Shortlisted
                                </p>
                                <p className="text-lg text-gray-600">Reason: {status.reason || "Not provided"}</p>
                              </div>
                            )

                          default:
                            return (
                              <div className="text-center">
                                <p className="text-xl font-semibold text-yellow-600 flex items-center justify-center">
                                  <Clock className="mr-2 h-6 w-6" />
                                  Status: Pending
                                </p>
                                <p className="text-lg text-gray-600">
                                  Your application for the post of {selectedApplicationData.post} is under review.
                                </p>
                              </div>
                            )
                        }
                      })()}
                    </CardContent>
                    {currentApplications.length > 1 && (
                      <CardFooter className="flex justify-center gap-4">
                        <Button
                          variant="outline"
                          disabled={currentApplications.indexOf(selectedApplicationData) === 0}
                          onClick={() => {
                            const currentIndex = currentApplications.findIndex((app) => app._id === selectedApplication)
                            if (currentIndex > 0) {
                              setSelectedApplication(currentApplications[currentIndex - 1]._id)
                            }
                          }}
                        >
                          Previous Application
                        </Button>
                        <Button
                          variant="outline"
                          disabled={
                            currentApplications.indexOf(selectedApplicationData) === currentApplications.length - 1
                          }
                          onClick={() => {
                            const currentIndex = currentApplications.findIndex((app) => app._id === selectedApplication)
                            if (currentIndex < currentApplications.length - 1) {
                              setSelectedApplication(currentApplications[currentIndex + 1]._id)
                            }
                          }}
                        >
                          Next Application
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationStatus

