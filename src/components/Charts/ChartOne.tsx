"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { api } from "../../../convex/_generated/api";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Applicant {
  _creationTime: number;
}

interface ProcessedData {
  [key: string]: number;
}

const options: ApexOptions = {
  legend: { show: false, position: "top", horizontalAlign: "left" },
  colors: ["#3C50E0", "#80CAEE", "#08D35DFF"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: { enabled: true, color: "#623CEA14", top: 10, blur: 4, left: 0, opacity: 0.1 },
    toolbar: { show: false },
  },
  responsive: [
    { breakpoint: 1024, options: { chart: { height: 300 } } },
    { breakpoint: 1366, options: { chart: { height: 350 } } },
  ],
  stroke: { width: [2, 2], curve: "smooth" },
  grid: {
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
  dataLabels: { enabled: false },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE", "#08D35DFF"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    fillOpacity: 1,
    hover: { size: undefined, sizeOffset: 5 },
  },
  xaxis: { type: "category", axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { title: { style: { fontSize: "0px" } }, min: 0 },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      title: {
        formatter: (seriesName) => seriesName,
      },
      formatter: (val) => `${val}: Entries`, // You can modify this if needed
    },
  },
};

const ChartOne = () => {
  const getAllRejected = useQuery(api.files.getAllRejected);
  const getAllShortListed = useQuery(api.files.getAllShortListed);
  const getFiles = useQuery(api.files.getFiles, {});

  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    { name: "Shortlisted", data: [] },
    { name: "Not Shortlisted", data: [] },
    { name: "Applicants", data: [] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<"hourly" | "daily" | "weekly" | "monthly">("hourly");

  useEffect(() => {
    const fetchData = async () => {
      const shortlistedData = getAllShortListed || [];
      const rejectedData = getAllRejected || [];
      const applicantsData = getFiles || [];

      let processedCategories: string[] = [];
      let hourlyShortlisted: ProcessedData; 
      let hourlyRejected: ProcessedData; 
      let hourlyApplicants: ProcessedData; 
      let dailyShortlisted: ProcessedData; 
      let dailyRejected: ProcessedData; 
      let dailyApplicants: ProcessedData; 

      switch (filter) {
        case "hourly":
          hourlyShortlisted = processData(shortlistedData, "hourly");
          hourlyRejected = processData(rejectedData, "hourly");
          hourlyApplicants = processData(applicantsData, "hourly");
          processedCategories = Object.keys(hourlyApplicants);
          break;
        case "daily":
          dailyShortlisted = processData(shortlistedData, "daily");
          dailyRejected = processData(rejectedData, "daily");
          dailyApplicants = processData(applicantsData, "daily");
          processedCategories = Object.keys(dailyApplicants);
          break;
        case "weekly":
          dailyShortlisted = processData(shortlistedData, "weekly");
          dailyRejected = processData(rejectedData, "weekly");
          dailyApplicants = processData(applicantsData, "weekly");
          processedCategories = Object.keys(dailyShortlisted);
          break;
        case "monthly":
          dailyShortlisted = processData(shortlistedData, "monthly");
          dailyRejected = processData(rejectedData, "monthly");
          dailyApplicants = processData(applicantsData, "monthly");
          processedCategories = Object.keys(dailyShortlisted);
          break;
      }

      if (filter === "hourly") {
        setCategories(processedCategories);
        setSeries([
          { name: "Shortlisted", data: processedCategories.map(date => hourlyShortlisted[date] || 0) },
          { name: "Not Shortlisted", data: processedCategories.map(date => hourlyRejected[date] || 0) },
          { name: "Applicants", data: processedCategories.map(date => hourlyApplicants[date] || 0) },
        ]);
      } else {
        setCategories(processedCategories);
        setSeries([
          { name: "Shortlisted", data: processedCategories.map(date => dailyShortlisted[date] || 0) },
          { name: "Not Shortlisted", data: processedCategories.map(date => dailyRejected[date] || 0) },
          { name: "Applicants", data: processedCategories.map(date => dailyApplicants[date] || 0) },
        ]);
      }
    };

    fetchData();
  }, [getAllRejected, getAllShortListed, getFiles, filter]);

  const processData = (data: Applicant[], filterType: "hourly" | "daily" | "weekly" | "monthly"): ProcessedData => {
    const result: ProcessedData = {};
    data.forEach((item) => {
      const dateKey = formatDate(item._creationTime, filterType);
      result[dateKey] = (result[dateKey] || 0) + 1; 
    });
    return result;
  };

  const formatDate = (timestamp: number, filterType: "hourly" | "daily" | "weekly" | "monthly"): string => {
    const date = new Date(timestamp);
    switch (filterType) {
      case "hourly":
        return date.toLocaleString("en-US", { hour: '2-digit', hour12: false });
      case "daily":
        return date.toLocaleString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' });
      case "weekly":
        return `Week ${getWeekNumber(date)} - ${date.getFullYear()}`;
      case "monthly":
        return date.toLocaleString("en-US", { month: "short", year: "numeric" });
    }
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Status Chart</p>
              <p className="text-sm font-medium">Double Line Chart</p>
            </div>
          </div>
        </div>
        <div className="flex h-10 items-center justify-end">
          <div className="flex items-center gap-2">
            <button onClick={() => setFilter("hourly")} className={`rounded px-3 py-1 text-xs font-medium ${filter === "hourly" ? "text-black" : "text-gray-500"} hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark`}>Hour</button>
            <button onClick={() => setFilter("daily")} className={`rounded px-3 py-1 text-xs font-medium ${filter === "daily" ? "text-black" : "text-gray-500"} hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark`}>Day</button>
            <button onClick={() => setFilter("weekly")} className={`rounded px-3 py-1 text-xs font-medium ${filter === "weekly" ? "text-black" : "text-gray-500"} hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark`}>Week</button>
            <button onClick={() => setFilter("monthly")} className={`rounded px-3 py-1 text-xs font-medium ${filter === "monthly" ? "text-black" : "text-gray-500"} hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark`}>Month</button>
          </div>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart options={{ ...options, xaxis: { ...options.xaxis, categories } }} series={series} type="area" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
