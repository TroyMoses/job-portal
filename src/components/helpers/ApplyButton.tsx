import Link from "next/link";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  id: string;
}

const ApplyButton = ({ id }: Props) => {
  const applyHandler = () => toast.success("Application Successful");

  return (
    <div>
      <Link href={`/jobs/application/${id}`}
        className="px-10 rounded-lg py-3 bg-blue-600 text-white font-semibold transition-all duration-500 hover:bg-blue-900"
      >
        Apply Now
      </Link>
      <ToastContainer position="top-center"/>
    </div>
  );
};

export default ApplyButton;
