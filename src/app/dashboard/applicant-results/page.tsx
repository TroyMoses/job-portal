"use client";

import * as React from "react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AddScoreDialog } from "@/components/Dialog";
import { Id } from "../../../../convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input"; // Import Input component
import { ArrowDown, ArrowUp } from "lucide-react";

const ResultsPage = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch all results
  const results = useQuery(api.results.getAllResults);
  const toggleAppointed = useMutation(api.results.toggleAppointed);

  // State for managing the search input and filtered results
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "overallAverageScore", direction: "desc" });

  const [openDialog, setOpenDialog] = useState<{
    applicantId: Id<"results">;
    commissionerField: string;
  } | null>(null);

  // Ensure user is loaded
  if (!userLoaded) {
    return <p>Loading user data...</p>;
  }

  const isCommissioner = user?.publicMetadata?.role === "commissioner";
  const isCAO = user?.publicMetadata?.role === "cao";
  const isAdmin = user?.publicMetadata?.role === "admin";
  const isTechnical = user?.publicMetadata?.role === "technical";
  const isCommissioner1 = user?.publicMetadata?.title === "commissioner1";
  const isCommissioner2 = user?.publicMetadata?.title === "commissioner2";
  const isCommissioner3 = user?.publicMetadata?.title === "commissioner3";
  const isCommissioner4 = user?.publicMetadata?.title === "commissioner4";
  const isCommissioner5 = user?.publicMetadata?.title === "commissioner5";

  if (!isCommissioner && !isCAO && !isAdmin && !isTechnical) {
    router.push("/");
    return null;
  }

  if (!results) {
    return <p>Loading results...</p>;
  }

  // Filter results based on search query
  const filteredResults = results
    .filter(
      (result) =>
        result?.applicantName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        result?.jobPost?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      //@ts-ignore
      const fieldA = a[sortConfig.key];
      //@ts-ignore
      const fieldB = b[sortConfig.key];
      if (fieldA === fieldB) return 0;
      const modifier = sortConfig.direction === "asc" ? 1 : -1;
      return fieldA > fieldB ? modifier : -modifier;
    });

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const handleOpenDialog = (
    applicantId: Id<"results">,
    commissionerField: string
  ) => {
    setOpenDialog({ applicantId, commissionerField });
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-6">Applicant Results</h1>

      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search by applicant name or job post..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full max-w-lg"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>
            Aptitude
            </TableHead>
            <TableHead>Comm1</TableHead>
            <TableHead>Comm2</TableHead>
            <TableHead>Comm3</TableHead>
            <TableHead>Comm4</TableHead>
            <TableHead>Comm5</TableHead>
            <TableHead>Technical</TableHead>
            <TableHead>
            Interview Avg
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <h2>Overall Avg</h2>
                
                <button className="text-xs" onClick={() => handleSort("overallAverageScore")}>
                {sortConfig?.key === "overallAverageScore" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp />
                    ) : (
                      <ArrowDown />
                    ))}
                </button>
              </div>
            </TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Appoint</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResults.map((result) => (
            <TableRow key={result._id}>
              <TableCell>{result.applicantName}</TableCell>
              <TableCell>{result.jobPost}</TableCell>
              <TableCell>{result.aptitudetestscore}%</TableCell>
              <TableCell>{result.commOne ?? "0"}%</TableCell>
              <TableCell>{result.commTwo ?? "0"}%</TableCell>
              <TableCell>{result.commThree ?? "0"}%</TableCell>
              <TableCell>{result.commFour ?? "0"}%</TableCell>
              <TableCell>{result.commFive ?? "0"}%</TableCell>
              <TableCell>{result.technical ?? "0"}%</TableCell>
              <TableCell>{result.oralInterviewAverage ?? "0"}%</TableCell>
              <TableCell>{result.overallAverageScore ?? "0"}%</TableCell>
              <TableCell>
                {isCommissioner1 && result.commOne === undefined && (
                  <Button
                    onClick={() => handleOpenDialog(result._id, "commOne")}
                  >
                    Add Score
                  </Button>
                )}
                {isCommissioner2 && result.commTwo === undefined && (
                  <Button
                    onClick={() => handleOpenDialog(result._id, "commTwo")}
                  >
                    Add Score
                  </Button>
                )}
                {isCommissioner3 && result.commThree === undefined && (
                  <Button
                    onClick={() => handleOpenDialog(result._id, "commThree")}
                  >
                    Add Score
                  </Button>
                )}
                {isCommissioner4 && result.commFour === undefined && (
                  <Button
                    onClick={() => handleOpenDialog(result._id, "commFour")}
                  >
                    Add Score
                  </Button>
                )}
                {isCommissioner5 && result.commFive === undefined && (
                  <Button
                    onClick={() => handleOpenDialog(result._id, "commFive")}
                  >
                    Add Score
                  </Button>
                )}
                {isTechnical && result.technical === undefined && (
                  <Button
                    onClick={() => handleOpenDialog(result._id, "technical")}
                  >
                    Add Score
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {isCommissioner && (
                  <Button
                    onClick={() => {
                      toggleAppointed({ userId: result.userId });
                      toast({
                        variant: "success",
                        title: "Applicant appointed",
                        description:
                          "You can now view the appointed applicants in the appointed table",
                      });
                    }}
                  >
                    Appoint
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    onClick={() => {
                      toggleAppointed({ userId: result.userId });
                      toast({
                        variant: "success",
                        title: "Applicant appointed",
                        description:
                          "You can now view the appointed applicants in the appointed table",
                      });
                    }}
                  >
                    Appoint
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {openDialog && (
        <AddScoreDialog
          applicantId={openDialog.applicantId}
          commissionerField={openDialog.commissionerField}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default ResultsPage;
