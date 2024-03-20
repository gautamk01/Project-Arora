import BlurPage from "@/components/global/blur-page";
import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import { GetMediaFiles } from "@/lib/type";
import React from "react";

type Props = {
  params: { subaccountId: string };
};

const Mediapage = async (props: Props) => {
  const data = await getMedia(props.params.subaccountId);
  return (
    <BlurPage>
      <MediaComponent data={data} subaccountId={props.params.subaccountId} />
    </BlurPage>
  );
};

export default Mediapage;
