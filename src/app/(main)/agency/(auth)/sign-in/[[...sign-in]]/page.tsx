import { SignIn } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className=" flex  flex-wrap flex-col justify-center items-center border border-red-300 p-20">
      <h1 className=" font-roy uppercase text-[100px]">Sign In</h1>
      <SignIn />
    </div>
  );
};

export default Page;
