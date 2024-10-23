"use client";

import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const Applicant = ({ params }: { params: { id: string } }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const toggleShortlisted = useMutation(api.files.toggleShortlisted);
  const toggleRejected = useMutation(api.files.toggleRejected);
  
  const shortlisted = useQuery(api.files.getAllShortListed);

  const files = useQuery(api.files.getFiles, {});
  const isLoading = files === undefined;

  // Filter files where the userId matches the params.id
  const filteredFiles =
    files?.filter((file: Doc<"files">) => file.userId === params.id) ?? [];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (filteredFiles.length === 0) {
    return <p>No files found for this applicant.</p>;
  }

  const file = filteredFiles[0]; 

  // Ensure user is loaded
  if (!userLoaded) {
    return <p>Loading user data...</p>;
  }

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isCommissioner = user?.publicMetadata?.role === "commissioner";
  const isCAO = user?.publicMetadata?.role === "cao";

  if (!isAdmin && !isCommissioner && !isCAO) {
    router.push("/");
    return null;
  }

  return (
    <div className="mx-auto p-10 w-[80%]">
      <h1 className="text-3xl font-semibold">Applicant Details</h1>
      <div className="mt-5">
        <div className="grid grid-col-2 gap-4 md:grid-cols-3">
          <p>
            <strong>Name:</strong> {file.name}
          </p>
          <p>
            <strong>Post Applied for:</strong> {file.post}
          </p>
          <p>
            <strong>Date of Birth:</strong> {file.dateOfBirth}
          </p>
          <p>
            <strong>Email:</strong> {file.email}
          </p>
          <p>
            <strong>Telephone:</strong> {file.telephone}
          </p>
          <p>
            <strong>Postal Address:</strong> {file.postalAddress}
          </p>
          <p>
            <strong>Nationality:</strong> {file.nationality}
          </p>
          <p>
            <strong>Home District:</strong> {file.homeDistrict}
          </p>
          <p>
            <strong>Subcounty:</strong> {file.subcounty}
          </p>
          <p>
            <strong>Village:</strong> {file.village}
          </p>
          <p>
            <strong>Residence Type:</strong> {file.residence}
          </p>
          <p>
            <strong>Present Ministry:</strong> {file.presentministry}
          </p>
          <p>
            <strong>Present Post:</strong> {file.presentpost}
          </p>
          <p>
            <strong>Present Salary:</strong> {file.presentsalary}
          </p>
          <p>
            <strong>Terms of Employment:</strong> {file.termsofemployment}
          </p>
          <p>
            <strong>Marital Status:</strong> {file.maritalstatus}
          </p>
          <p>
            <strong>Children:</strong> {file.children}
          </p>
        </div>

        {/* UCE and UACE Files */}
        <h2 className="mt-10 mb-1 text-2xl font-semibold">
          UCE and UACE Documents
        </h2>
        <div className=" grid grid-cols-2 gap-5">
          {file.uceFileUrl && (
            <div>
              <h3 className="text-base font-semibold">UCE Document:</h3>
              <Link href={file.uceFileUrl} target="_blank">
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  Open Document
                </button>
              </Link>
            </div>
          )}

          {file.uaceFileUrl && (
            <div>
              <h3 className="text-base font-semibold">UACE File:</h3>
              <Link href={file.uaceFileUrl} target="_blank">
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  Open Document
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Educational Record */}
        <h2 className="mt-10 mb-1 text-2xl font-semibold">Education Record</h2>
        <div className="">
          <h3 className="text-xl font-semibold">UCE Record:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3">
            {file.ucerecord?.map((record, index) => (
              <p key={index}>
                <strong>{record.subject}:</strong> {record.grade}
              </p>
            ))}
          </div>

          <h3 className="text-xl font-semibold mt-4">UACE Record:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3">
            {file.uacerecord?.map((record, index) => (
              <p key={index}>
                <strong>{record.subject}:</strong> {record.grade}
              </p>
            ))}
          </div>
        </div>

        {/* Employment Record */}
        <h2 className="mt-10 mb-1 text-2xl font-semibold">Employment Record</h2>
        <div className="grid grid-cols-2 md:grid-cols-3">
          {file.employmentrecord?.map((employment, index) => (
            <p key={index}>
              <strong>{employment.year}:</strong> {employment.position} at{" "}
              {employment.employer}
            </p>
          ))}
        </div>

        {/* References */}
        <h2 className="mt-6 mb-1 text-2xl font-semibold">References</h2>
        <div className="grid grid-cols-2 md:grid-cols-3">
          {file.referencerecord?.map((reference, index) => (
            <p key={index}>
              <strong>{reference.name}:</strong> {reference.address}
            </p>
          ))}
        </div>

        {/* Officer Record */}
        <h2 className="mt-6 mb-1 text-2xl font-semibold">Officer Record</h2>
        <div className="grid grid-cols-2 md:grid-cols-3">
          {file.officerrecord?.map((officer, index) => (
            <div key={index}>
              <strong>{officer.name}:</strong> {officer.title}, Contact:{" "}
              {officer.contact}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Additional Information</h2>
          <p>
            <strong>Conviction:</strong> {file.conviction}
          </p>
          <p>
            <strong>Available Date:</strong> {file.available}
          </p>
          <p>
            <strong>Consentment:</strong> {file.consentment}
          </p>
        </div>

        <div className="flex gap-5 mt-5">
          <Button
            onClick={() => {
              toggleShortlisted({
                userId: file.userId,
              });
              router.push("/dashboard/shortlist");
            }}
            type="button"
            className="text-sm px-2 py-1"
          >
            Approve Application
          </Button>
          <Button
            onClick={() => {
              toggleRejected({
                userId: file.userId,
              });
              router.push("/dashboard/rejected");
            }}
            variant={"destructive"}
            type="button"
            className="text-sm px-2 py-1"
          >
            Reject Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Applicant;
