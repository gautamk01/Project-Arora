import { GetMediaFiles } from "@/lib/type";
import React from "react";
import MediaUploadButton from "./uploadbutton";

type Props = {
  data: GetMediaFiles;
  subaccountId: string;
};

const MediaComponent = ({ data, subaccountId }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-roy">Media Bucket</h1>
        <MediaUploadButton subaccountId={subaccountId} />
      </div>
    </div>
  );
};

export default MediaComponent;
