"use server";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { redirect } from "next/navigation";
import { Agency, Plan, User } from "@prisma/client";

//then only this will become a server action file

/******************************GETAUTHUSERDETAILS *********************** */
/**
 * Get the User Detailes after the Auth
 */
export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) {
    return;
  }

  /**
   * findUnique in Prisma is used to retrieve a single user record based on a unique criterion.
   *  find the user whose email field matches the first email address
   * (user.emailAddresses[0].emailAddress) within a presumably existing user object.
   * The include clause lets you selectively control which related data you want to load, enabling you to tailor your queries
   * to fetch only the necessary information.
   * Mainly to avoid N+1 problem to change the sidebaroption true we needed to write another queiry
   * but here using include your queries are added with a single query
   */
  const userData = await db.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permission: true,
    },
  });

  return userData;
};

/**************SAVEACTIVITYLOGNOTIFICATION***************** */

type saveactivityProps = {
  agencyId?: string;
  description: string;
  subaccountId?: string;
};

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: saveactivityProps) => {
  const authUser = await currentUser();
  let userData;

  //we are doing this because let's say we are creating a activity log when a Contact(Ticket)comes
  //that time we needed to find the subaccount which made this contact , and assigne this notification
  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    });

    if (response) {
      userData = response;
    }
  } else {
    userData = await db.user.findUnique({
      where: { email: authUser?.emailAddresses[0].emailAddress },
    });
  }

  //If there is no userData
  if (!userData) {
    console.log("Could not find a user");
    return;
  }

  //Agency id
  let foundAgencyId = agencyId;

  //sometimes notification are assigned to subaccount
  //inside subaccount , we have not access the agency id
  //so for that we needed to find the agenecy Id from subaccount
  if (!foundAgencyId) {
    //No Agency Id and Also Sub account Id Throw an error to the developer
    if (!subaccountId) {
      throw new Error(
        "You need to provide atleast an agency Id or subaccount Id"
      );
    }

    //if there is Subaccount id
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });
    //if there is response then from subaccount we can find the agencyID
    if (response) {
      foundAgencyId = response.agencyId;
    }
  }

  //Subaccount id
  if (subaccountId) {
    //this will create a notification by connecting user,Agency and subaccount
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: { id: subaccountId },
        },
      },
    });
  } else {
    //this will create a notification by connecting userid and Agency id
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

/*************************CreateTeamUser************************* */
/**Mainly to Createa a New User, unless they are not a Agency Owner  */

//here the parameter User type comes from Prisma Client
export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null; //you already have the access
  //create the user from the parameter and return the response
  const response = await db.user.create({ data: { ...user } }); //create the a new user
  return response;
};

/**************************VerifyAnd ACceptInvitation******************* */
/**Function used : -
 * 1. currentUser
 * 2. createTeamUser -if the Invited account is not regiester this will help to resgister
 */

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  //in this part when a agenecy ower or subaccount user give a email to person who can access the account
  // So they don't wanted to register as a new Agency correct ,
  // They just wanted to go that Agency account or that sub account dashbord
  // for that they needed to veryify first , here we are assigning that specific email , Status as "PENDING"

  const invitationExists = await db.invitation.findUnique({
    where: { email: user.emailAddresses[0].emailAddress, status: "PENDING" },
  });

  //if they are invited
  if (invitationExists) {
    //Creating a User
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updateAt: new Date(),
    });
    //notification to the agency
    await saveActivityLogsNotification({
      agencyId: invitationExists.agencyId,
      description: "Joined ",
      subaccountId: undefined,
    });

    //if detail do exisite we will give them a role  to the Metadata of clerClient
    //by default "SUBACCOUNT_USER"
    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });
      await db.invitation.delete({
        where: { email: userDetails.email },
      });
      return userDetails.agencyId; // we need agencyid to reroute the user
    } else return null;
  } else {
    //Check they have a agency id
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    //if agency existe
    return agency ? agency.agencyId : null;
  }

  // Then we needed to Perform Activity logs
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  const response = await db.agency.update({
    where: { id: agencyId },
    data: { ...agencyDetails },
  });
  return response;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({ where: { id: agencyId } });
  return response;
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  return userData;
};

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  if (!agency.companyEmail) return null;
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });
    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};