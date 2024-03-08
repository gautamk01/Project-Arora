import { getAuthUserDetails } from "@/lib/queries";
import React from "react";
import MenuOptions from "./menu-option";

//we are using same side bar for both Agency user and Subaccount
//we pass the props of id and type
type Props = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  //Check the user
  const user = await getAuthUserDetails();
  if (!user) return null;
  if (!user.Agency) return;

  //collect the details from agency and subaccount specifically
  //if type is "agency" then collect user.Agency  or subaccount that is this specific id
  const details =
    type === "agency"
      ? user?.Agency
      : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id);

  //ensure that it is whiteLabeled or not
  const isWhiteLabeledAgency = user.Agency.whiteLabel;

  // if any details are not found then you can say that return null
  if (!details) return;

  //SideBar Logo selection
  //Normally collect the Logo from
  let sideBarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg";

  // if we mention the whiteLabelAgency off then subaccount user needed to use Agency logo
  // if it is On then Subaccount user not needed to use Agency instead they can use Their own logo
  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sideBarLogo =
        user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.Agency.agencyLogo;
    }
  }

  //SideBar Options
  //we are collecting the Sidebar Option accounding to the type
  //
  const sidebarOpt =
    type === "agency"
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || [];

  //The code filters the user.Agency.SubAccount array.
  //For each subaccount, it tries to find a corresponding permission within the user Permission array.
  // A subaccount is included in the subaccounts result only if a permission exists where the subaccount IDs
  // match and the user has the access property set.
  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permission.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
      />
      {/* The is going to be Mobil Nav */}
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
