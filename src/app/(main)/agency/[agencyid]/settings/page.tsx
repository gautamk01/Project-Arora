import AgencyDetails from "@/components/form/agency-detail";
import UserDetails from "@/components/form/user-details";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import React from "react";

type Props = {
  params: { agencyid: string };
};

const SettingsPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  });

  if (!userDetails) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyid,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return null;
  const subAccounts = agencyDetails.SubAccount;
  return (
    <div>
      <div className="flex lg:flex-row flex-col gap-4">
        <AgencyDetails data={agencyDetails} />
        <UserDetails
          type="agency"
          id={params.agencyid}
          subAccounts={subAccounts}
          userData={userDetails}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
