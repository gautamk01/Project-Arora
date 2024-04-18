import Unauthorized from "@/components/unauthorized";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

const SubAccountMainPage = async () => {
  const agencyId = await verifyAndAcceptInvitation();
  //agency id is returned from the function

  //if there is no agency id then return unathorized component
  if (!agencyId) {
    return <Unauthorized />;
  }

  //user get user auth
  const user = await getAuthUserDetails();
  if (!user) return; //no user return

  const getFirstSubaccountWithAccess = user.Permission.find(
    (permission) => permission.access === true
  ); //Checking the permission access from the agency

  if (getFirstSubaccountWithAccess) {
    //redirected to the subaccount id
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }

  return <Unauthorized />;
};

export default SubAccountMainPage;
