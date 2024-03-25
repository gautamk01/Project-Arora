import BlurPage from "@/components/global/blur-page";
import { InfoBar } from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
  getAuthUserDetails,
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { subaccountId: string };
};

const SubaccountLayout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAcceptInvitation(); // verifying the inivtaiton
  if (!agencyId) return <Unauthorized />; //no id  return to Unauthorized

  const user = await currentUser(); //no user

  if (!user) {
    return redirect("/"); //redirected to the home
  }

  let notifications: any = [];

  if (!user.privateMetadata.role) {
    //no private metadata role then return unath
    return <Unauthorized />;
  } else {
    const allPermissions = await getAuthUserDetails(); //collect the user details
    //permission access is true and subaccount id is same as the params and from the permission

    const hasPermission = allPermissions?.Permission.find(
      (permissions) =>
        permissions.access && permissions.subAccountId === params.subaccountId
    );
    //no permission
    if (!hasPermission) {
      return <Unauthorized />;
    }

    //get the notification fo the agency Id
    const allNotifications = await getNotificationAndUser(agencyId);

    // if the role is agency admin and agency Owner then you can view all notification

    if (
      user.privateMetadata.role === "AGENCY_ADMIN" ||
      user.privateMetadata.role === "AGENCY_OWNER"
    ) {
      notifications = allNotifications;
    } else {
      //if not we can filter out the notification for that specific subaccount
      // we can track the activity in that subaccount
      const filteredNoti = allNotifications?.filter(
        (item) => item.subAccountId === params.subaccountId
      );

      if (filteredNoti) {
        notifications = filteredNoti;
      }
    }
  }
  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.subaccountId} type="subaccount" />

      <div className="md:pl-[300px]">
        <InfoBar
          notifications={notifications}
          role={user.privateMetadata.role as Role}
          subAccountId={params.subaccountId as string}
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default SubaccountLayout;
