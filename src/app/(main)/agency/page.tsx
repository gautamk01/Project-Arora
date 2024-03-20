import AgencyDetails from "@/components/form/agency-detail";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

/**
 * A new user can come to login
 * A Current user can come to login
 * A Subaccount Guest or Agency Guest can come to login
 * what if a user get a invitation
 */

//search params exsiste we needed to send them to the billing page
//state and code is mainly for the strip content
const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  //what if user is sent an invitation
  const agencyId = await verifyAndAcceptInvitation();
  //get user details
  const user = await getAuthUserDetails();
  //if there is no data we need to promopt with create the agency account
  //if they have the agencyid then they wanted to pass to agency page

  if (agencyId) {
    //if the user is Subaccount user or Guest then rediect to subaccount page
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    }
    //if the user is agency ower then we needed to do something else
    else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      // we are redirecting them to the Builling plan
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }

      //Strip integration work ......
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];
        if (!stateAgencyId) return <div>Not authorized</div>;
        //this is mainly for the connection logic in the strip
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else return redirect(`/agency/${agencyId}`); // return to the agency page
    } else {
      return <div>Not authorized</div>;
    }
  }

  //if the user don't have anything they will redirected to the create user page
  const authUser = await currentUser();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl"> Create An Agency</h1>
        {/* we  passes the props which is the emailAddress */}
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default Page;
