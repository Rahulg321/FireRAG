"use client";

import { useSession } from "next-auth/react";
import React from "react";

const AnalyticsPage = () => {
  const session = useSession();
  console.log(session);
  return <div>AnalyticsPage</div>;
};

export default AnalyticsPage;
