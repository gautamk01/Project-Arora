import Navigation from "@/components/navigation";
import React from "react";

const homelayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full">
      <Navigation />
      {children}
    </main>
  );
};

export default homelayout;
