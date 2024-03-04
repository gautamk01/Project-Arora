import React from "react";

type Props = {
  params: {
    agencyid: string;
  };
};

const page = ({ params }: Props) => {
  return <div>{params.agencyid}</div>;
};

export default page;
