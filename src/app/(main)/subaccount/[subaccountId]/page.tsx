import React from "react";

type Props = {
  params: { subaccountId: string };
};

const Page = (props: Props) => {
  return <div>{`Welcome Subaccount user ${props.params.subaccountId}`}</div>;
};

export default Page;
