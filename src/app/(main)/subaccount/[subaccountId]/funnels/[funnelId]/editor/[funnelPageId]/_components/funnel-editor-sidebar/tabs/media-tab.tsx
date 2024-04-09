"use client";

import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import { GetMediaFiles } from "@/lib/type";
import React, { useEffect, useState } from "react";

type Props = {
  subaccountId: string;
};

const MediaTab = ({ subaccountId }: Props) => {
  const [data, setdata] = useState<GetMediaFiles>(null);
  //when the component render first it will call useEffect
  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(subaccountId);
      setdata(response);
    };
    fetchData();
  }, [subaccountId]);

  return (
    <div className=" h-[900px] overflow-scroll p-4">
      <MediaComponent data={data} subaccountId={subaccountId} />
    </div>
  );
};

export default MediaTab;
