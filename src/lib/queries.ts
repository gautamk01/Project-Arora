"use server";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { redirect } from "next/navigation";
import {
  Agency,
  Lane,
  Prisma,
  Role,
  SubAccount,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import { v4 } from "uuid";
import {
  CreateFunnelFormSchema,
  CreateMediaType,
  CreatePipelineFormSchema,
} from "./type";
import { z } from "zod";
import { sendMail } from "./mail";
import LinearLoginCodeEmail, { AroraInviteUserEmail } from "../../emails";
import { render } from "@react-email/render";

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

//For UdateAgencyDetails mainly used in Agency Formss
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

//For Deleting the Agency mainly used in Agency Forms
export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({ where: { id: agencyId } });
  return response;
};

//
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

//Creating the Agencu Side bar
export const upsertAgency = async (agency: Agency) => {
  if (!agency.companyEmail) return null;
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      //Here starts the Create agency section
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

//Getting Notification of a specific Agency
export const getNotificationAndUser = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: { agencyId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

/***********************upsertSubAccount*****************/
export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null;
  //finding the Agency Owner for subaccount
  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: "AGENCY_OWNER",
    },
  });
  if (!agencyOwner) return console.log("🔴Erorr could not create subaccount");
  //permission librey
  const permissionId = v4();
  const response = await db.subAccount.upsert({
    where: { id: subAccount.id },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: "Lead Cycle" },
      },
      SidebarOption: {
        create: [
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/subaccount/${subAccount.id}/launchpad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/subaccount/${subAccount.id}/settings`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/subaccount/${subAccount.id}/funnels`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/subaccount/${subAccount.id}/media`,
          },
          {
            name: "Pipelines",
            icon: "flag",
            link: `/subaccount/${subAccount.id}/pipelines`,
          },
          {
            name: "Contacts",
            icon: "person",
            link: `/subaccount/${subAccount.id}/contacts`,
          },
          {
            name: "Dashboard",
            icon: "category",
            link: `/subaccount/${subAccount.id}`,
          },
        ],
      },
    },
  });
  return response;
};

//going to going to Database -> user -> findUnique ->userId ->select Permission
//select all the subaccount that the use has the permission to access
export const getUserPermissions = async (userId: string) => {
  const response = await db.user.findUnique({
    where: { id: userId },
    select: { Permission: { include: { SubAccount: true } } },
  });

  return response;
};

export const updateUser = async (user: Partial<User>) => {
  const response = await db.user.update({
    where: { email: user.email },
    data: { ...user },
  });

  //update the role
  await clerkClient.users.updateUserMetadata(response.id, {
    privateMetadata: {
      role: user.role || "SUBACCOUNT_USER",
    },
  });

  return response;
};

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean
) => {
  try {
    const response = await db.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    });
    return response;
  } catch (error) {
    console.log("🔴Could not change persmission", error);
  }
};

//Collect subAccount Details
export const getSubaccountDetails = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });
  return response;
};

export const deleteSubAccount = async (subaccountId: string) => {
  const response = await db.subAccount.delete({
    where: {
      id: subaccountId,
    },
  });
  return response;
};

//Mainly for team section for the agency
export const deleteUser = async (userId: string) => {
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      role: undefined,
    },
  });
  const deletedUser = await db.user.delete({ where: { id: userId } });

  return deletedUser;
};
export const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

//Parameters are Role, email and agencyId
export const sendInvitation = async (
  role: Role,
  email: string,
  name: string,
  agencyId: string,
  agencyName: string,
  agencyImage: string,
  userName: string
) => {
  //this will create a record in the invitation table
  const resposne = await db.invitation.create({
    data: { email, agencyId, role },
  });
  //when we store invivtation whenever thay are new to this invitation
  //check if they have an invitaiton
  // our entire saas application only allow one agency per email address

  try {
    //Cleck auth has an actuall as an email secuences
    //sending email  using clerk auth

    const url = process.env.NEXT_PUBLIC_URL;
    await sendMail({
      to: email,
      name: "Team Arora",
      subject: `Invitation Mail Form Agency ${agencyName}`,
      body: render(
        AroraInviteUserEmail({
          username: name,
          invitedByUsername: userName,
          teamName: agencyName,
          teamImage: agencyImage,
          inviteLink: url,
          role: role,
        })
      ),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

  return resposne;
};

export const getMedia = async (subaccountId: string) => {
  //get the details  of media info
  const mediafiles = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    include: { Media: true },
  });
  return mediafiles;
};

//for the media section in subaccount
// For uploading the Media
export const createMedia = async (
  subaccountId: string,
  mediafiles: CreateMediaType
) => {
  const response = await db.media.create({
    data: {
      link: mediafiles.link,
      name: mediafiles.name,
      subAccountId: subaccountId,
    },
  });
  return response;
};

//for Deleting the Media
export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  });
  return response;
};

//++++++++++++++++++++++++++++++++++Pipeline query section/+++++++++++++++++++++++++++++++++++++

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  });
  return response;
};

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const response = await db.lane.findMany({
    where: {
      pipelineId,
    },
    orderBy: { order: "asc" },
    include: {
      Tickets: {
        orderBy: {
          order: "asc",
        },
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  });
  return response;
};

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
  const response = await db.pipeline.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  });

  return response;
};

export const deletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: { id: pipelineId },
  });
  return response;
};

//Pipeline -- Lanes section ---------
export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateTrans = lanes.map((lane) =>
      db.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      })
    );

    await db.$transaction(updateTrans);
  } catch (error) {
    console.log(error, "ERROR UPDATE LANES ORDER");
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      })
    );

    await db.$transaction(updateTrans);
  } catch (error) {
    console.log(error, "🔴 ERROR UPDATE TICKET ORDER");
  }
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;

  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    });

    order = lanes.length;
  } else {
    order = lane.order;
  }

  const response = await db.lane.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: { ...lane, order },
  });

  return response;
};

export const deleteLane = async (laneId: string) => {
  const resposne = await db.lane.delete({ where: { id: laneId } });
  return resposne;
};

export const getTicketsWithTags = async (pipelineId: string) => {
  const response = await db.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: { Tags: true, Assigned: true, Customer: true },
  });
  return response;
};

export const _getTicketsWithAllRelations = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: { laneId: laneId },
    include: {
      Assigned: true,
      Customer: true,
      Lane: true,
      Tags: true,
    },
  });
  return response;
};

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  //all the user who is under this specific subaccount and role : - subaccount id
  const subaccountUsersWithAccess = await db.user.findMany({
    where: {
      Agency: {
        SubAccount: {
          some: {
            id: subaccountId,
          },
        },
      },
      role: "SUBACCOUNT_USER",
      Permission: {
        some: {
          subAccountId: subaccountId,
          access: true,
        },
      },
    },
  });
  return subaccountUsersWithAccess;
};

export const searchContacts = async (searchTerms: string) => {
  const response = await db.contact.findMany({
    where: {
      name: {
        contains: searchTerms,
      },
    },
  });
  return response;
};

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  let order: number;
  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: { laneId: ticket.laneId },
    });
    order = tickets.length;
  } else {
    order = ticket.order;
  }

  const response = await db.ticket.upsert({
    where: {
      id: ticket.id || v4(),
    },
    update: { ...ticket, Tags: { set: tags } },
    create: { ...ticket, Tags: { connect: tags }, order },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Lane: true,
    },
  });

  return response;
};

export const deleteTicket = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return response;
};

//+++++++++++++++++++++++/Pipeline section Tag /+++++++++++++++++++++++++
export const upsertTag = async (
  subaccountId: string,
  tag: Prisma.TagUncheckedCreateInput
) => {
  const response = await db.tag.upsert({
    where: { id: tag.id || v4(), subAccountId: subaccountId },
    update: tag,
    create: { ...tag, subAccountId: subaccountId },
  });

  return response;
};

export const getTagsForSubaccount = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: { id: subaccountId },
    select: { Tags: true },
  });
  return response;
};

export const deleteTag = async (tagId: string) => {
  const response = await db.tag.delete({ where: { id: tagId } });
  return response;
};

export const upsertContact = async (
  contact: Prisma.ContactUncheckedCreateInput
) => {
  const response = await db.contact.upsert({
    where: { id: contact.id || v4() },
    update: contact,
    create: contact,
  });
  return response;
};

export const getPipelines = async (subaccountId: string) => {
  const response = await db.pipeline.findMany({
    where: { subAccountId: subaccountId },
    include: {
      Lane: {
        include: { Tickets: true },
      },
    },
  });
};
