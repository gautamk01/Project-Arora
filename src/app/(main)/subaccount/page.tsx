import Unauthorized from "@/components/unauthorized";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams: { state: string; code: string };
};

const SubAccountMainPage = async ({ searchParams }: Props) => {
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

  if (searchParams.state) {
    //these code are manily from the strip state manegement
    const statePath = searchParams.state.split("___")[0];
    const stateSubaccountId = searchParams.state.split("___")[1];
    if (!stateSubaccountId) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    );
  }

  if (getFirstSubaccountWithAccess) {
    //redirected to the subaccount id
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }

  return <Unauthorized />;
};

export default SubAccountMainPage;
