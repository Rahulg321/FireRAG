import React from "react";
import { auth } from "@/app/(main-site)/(auth)/auth";
import AnalyticsDashboard from "./analytics-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analytics",
};

const page = async () => {
  return (
    <div>
      <AnalyticsDashboard />
    </div>
  );
};

export default page;
