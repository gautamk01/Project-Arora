import Loading from "@/components/global/loading";
import React from "react";

//this is maninly for loading icon
// when ever it load it shows the spinner

const LoadingAgencyPage = () => {
  return (
    <div className=" h-[100%] w-full flex justify-center items-center">
      <Loading />
    </div>
  );
};

export default LoadingAgencyPage;
