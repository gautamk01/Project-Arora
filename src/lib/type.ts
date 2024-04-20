import {
  Contact,
  Lane,
  Notification,
  Prisma,
  Role,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import { getAuthUserDetails, getMedia, getUserPermissions } from "./queries";
import { db } from "./db";
import { z } from "zod";
import { getFunnels } from "./queries/funnelqueries";
import {
  _getTicketsWithAllRelations,
  getPipelineDetails,
  getTicketsWithTags,
} from "./queries/pipelinequeries";

export type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatarUrl: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: Role;
        agencyId: string | null;
      };
    } & Notification)[]
  | undefined;

//exporting the type of getUserPermissions
export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

//exporting  getAuthUserDetails types
export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;

//This is used in the Team section
const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permission: { include: { SubAccount: true } },
    },
  });
};

//This is mainly doing is to export the type of data it is returning from the above function in prisma
export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
  >;

//collecting the type of return files from GetMediaFiles
export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>;

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput;

/******************Pipeline section**********************/
export type TicketAndTags = Ticket & {
  Tags: Tag[];
  Assigned: User | null;
  Customer: Contact | null;
};

export type LaneDetail = Lane & {
  Tickets: TicketAndTags[];
};

export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
});

export const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
});

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>;

export const LaneFormSchema = z.object({
  name: z.string().min(1),
});

export type TicketWithTags = Prisma.PromiseReturnType<
  typeof getTicketsWithTags
>;

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price.",
  }),
});

export type TicketDetails = Prisma.PromiseReturnType<
  typeof _getTicketsWithAllRelations
>;

export const ContactUserFormSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
});

export type FunnelsForSubAccount = Prisma.PromiseReturnType<
  typeof getFunnels
>[0];

export const FunnelPageSchema = z.object({
  name: z.string().min(1),
  pathName: z.string().optional(),
});

export type UpsertFunnelPage = Prisma.FunnelPageCreateWithoutFunnelInput;

export const agencyFormSchema = z.object({
  name: z.string().min(2, { message: "Agency name must be atleast 2 chars." }),
  companyEmail: z.string().email(),
  companyPhone: z.string().regex(/^\+?[0-9]{10,14}$/),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),
});
