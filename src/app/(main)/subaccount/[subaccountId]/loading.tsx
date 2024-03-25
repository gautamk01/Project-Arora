import Loading from "@/components/global/loading";
import React from "react";

//this is maninly for loading icon
// when ever it load it shows the spinner

const LoadingAgencyPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Loading></Loading>
    </div>
  );
};

export default LoadingAgencyPage;
