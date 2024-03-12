import BlurPage from "@/components/global/blur-page";
import { InfoBar } from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { agencyid: string };
};

const Layout = async (props: Props) => {
  //To Verify the user
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();

  //if the user is not identified
  if (!user) {
    return redirect("/");
  }

  // if there is no agencyId it will redirected to Agency form
  if (!agencyId) {
    return redirect("/agency");
  }

  //If they are PrivateMetadata.role is not AGENCY_OWNER Or AGENCY_ADMIN then you can say that
  //it move to Unautharised page
  //This is doing why because when Subaccount user or their guest try to access the data then
  //we should not allow the user to activate that
  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  ) {
    return <Unauthorized />;
  }

  let allNoti: any = [];
  //Collect the notification from the agency
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) {
    allNoti = notifications;
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={props.params.agencyid} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} role={allNoti.User?.role} />
        <div className="relative">
          <BlurPage>{props.children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default Layout;
