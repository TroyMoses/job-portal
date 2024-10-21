"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const ResultsPage = () => {

  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  
  // Fetch all results
  const results = useQuery(api.results.getAllResults);

  // Ensure user is loaded
  if (!userLoaded) {
    return <p>Loading user data...</p>;
  }

  const isCommissioner = user?.publicMetadata?.role === "commissioner";
  const isCommissioner1 = user?.publicMetadata?.title === "commissioner1";
  const isCommissioner2 = user?.publicMetadata?.title === "commissioner2";
  const isCommissioner3 = user?.publicMetadata?.title === "commissioner3";
  const isCommissioner4 = user?.publicMetadata?.title === "commissioner4";

  if (!isCommissioner) {
    router.push("/");
    return null;
  }

  if (!results) {
    return <p>Loading results...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-6">Applicant Results</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Aptitude</TableHead>
            <TableHead>Interview{"("}i{")"}</TableHead>
            <TableHead>Interview{"("}ii{")"}</TableHead>
            <TableHead>Interview{"("}iii{")"}</TableHead>
            <TableHead>Interview{"("}iv{")"}</TableHead>
            <TableHead>Interview Average</TableHead>
            <TableHead>Overall Average</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result._id}>
              <TableCell>{result.applicantName}</TableCell>
              <TableCell>{result.jobPost}</TableCell>
              <TableCell>{result.aptitudetestscore}%</TableCell>
              <TableCell>{result.commOne ?? 'Pending'}</TableCell>
              <TableCell>{result.commTwo ?? 'Pending'}</TableCell>
              <TableCell>{result.commThree ?? 'Pending'}</TableCell>
              <TableCell>{result.commFour ?? 'Pending'}</TableCell>
              <TableCell>{result.oralInterviewAverage ?? 'Pending'}</TableCell>
              <TableCell>{result.overallAverageScore ?? 'Pending'}</TableCell>
              <TableCell>
                {isCommissioner1 && result.commOne === undefined && <Button>Add Interview Score</Button>}
                {isCommissioner2 && result.commTwo === undefined && <Button>Add Interview Score</Button>}
                {isCommissioner3 && result.commThree === undefined && <Button>Add Interview Score</Button>}
                {isCommissioner4 && result.commFour === undefined && <Button>Add Interview Score</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultsPage;
