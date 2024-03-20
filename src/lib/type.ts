import { Notification, Prisma, Role } from "@prisma/client";
import { getAuthUserDetails, getMedia, getUserPermissions } from "./queries";
import { db } from "./db";

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