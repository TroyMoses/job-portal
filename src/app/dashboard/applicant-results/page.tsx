"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { AddScoreDialog } from "@/components/Dialog";
import { Id } from "../../../../convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
// import { AddScoreDialog } from "./AddScoreDialog";

const ResultsPage = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  // Fetch all results
  const results = useQuery(api.results.getAllResults);

  const toggleAppointed = useMutation(api.results.toggleAppointed);
  
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
  const isCommissioner1 = user?.publicMetadata?.title === "commissioner1";
  const isCommissioner2 = user?.publicMetadata?.title === "commissioner2";
  const isCommissioner3 = user?.publicMetadata?.title === "commissioner3";
  const isCommissioner4 = user?.publicMetadata?.title === "commissioner4";

  if (!isCommissioner && !isCAO && !isAdmin) {
    router.push("/");
    return null;
  }

  if (!results) {
    return <p>Loading results...</p>;
  }

  const handleOpenDialog = (applicantId: Id<"results">, commissionerField: string) => {
    setOpenDialog({ applicantId, commissionerField });
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-6">Applicant Results</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Aptitude</TableHead>
            <TableHead>Com{"("}i{")"}</TableHead>
            <TableHead>Com{"("}ii{")"}</TableHead>
            <TableHead>Com{"("}iii{")"}</TableHead>
            <TableHead>Com{"("}iv{")"}</TableHead>
{/*             <TableHead>Interview Average</TableHead> */}
{/*             <TableHead>Overall Average</TableHead> */}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result._id}>
              <TableCell>{result.applicantName}</TableCell>
              <TableCell>{result.jobPost}</TableCell>
              <TableCell>{result.aptitudetestscore}%</TableCell>
              <TableCell>{result.commOne ?? '0'}%</TableCell>
              <TableCell>{result.commTwo ?? '0'}%</TableCell>
              <TableCell>{result.commThree ?? '0'}%</TableCell>
              <TableCell>{result.commFour ?? '0'}%</TableCell>
{/*               <TableCell>{result.oralInterviewAverage ?? '0'}%</TableCell> */}
{/*               <TableCell>{result.overallAverageScore ?? '0'}%</TableCell> */}
              <TableCell>
                {isCommissioner1 && result.commOne === undefined && (
                  <Button onClick={() => handleOpenDialog(result._id, "commOne")}>
                    Add Score
                  </Button>
                )}
                {isCommissioner2 && result.commTwo === undefined && (
                  <Button onClick={() => handleOpenDialog(result._id, "commTwo")}>
                    Add Score
                  </Button>
                )}
                {isCommissioner3 && result.commThree === undefined && (
                  <Button onClick={() => handleOpenDialog(result._id, "commThree")}>
                    Add Score
                  </Button>
                )}
                {isCommissioner4 && result.commFour === undefined && (
                  <Button onClick={() => handleOpenDialog(result._id, "commFour")}>
                    Add Score
                  </Button>
                )}
              <Button onClick={() => {
                    toggleAppointed({
                      userId: result.userId,
                    });
                    toast({
                      variant: "success",
                      title: "Applicant appointed",
                      description: "You can now view the appointed applicants in the appointed table",
                    });
                  }}>
                    Appoint
                  </Button>
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
