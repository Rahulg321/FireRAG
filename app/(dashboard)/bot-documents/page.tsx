import { Metadata } from "next";
import React from "react";
import DocumentsDashboard from "./documents-dashboard";

export const metadata: Metadata = {
  title: "Bot Documents",
  description: "Bot Documents",
};

const BotDocumentsPage = () => {
  return (
    <div>
      <DocumentsDashboard />
    </div>
  );
};

export default BotDocumentsPage;
