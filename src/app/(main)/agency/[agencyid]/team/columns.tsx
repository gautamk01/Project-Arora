"use client";

import clsx from "clsx";
import { ColumnDef } from "@tanstack/react-table";
import {
  Agency,
  AgencySidebarOption,
  Permissions,
  Prisma,
  Role,
  SubAccount,
  User,
} from "@prisma/client";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { deleteUser, getUser } from "@/lib/queries";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { UsersWithAgencySubAccountPermissionsSidebarOptions } from "@/lib/type";
import CustomModal from "@/components/global/custom-modal";
import { useModal } from "@/provider/modal-provider";
import UserDetails from "@/components/form/user-details";

export const columns: ColumnDef<UsersWithAgencySubAccountPermissionsSidebarOptions>[] =
  [
    //This is an hidden item no header
    {
      accessorKey: "id",
      header: "",
      cell: () => {
        return null;
      },
    },
    //{Name Column} we are using a custom component
    // we are returning a custom component
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const avatarUrl = row.getValue("avatarUrl") as string; //collecting avatar url from row
        return (
          //Some style how this row should look like
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 relative flex-none">
              <Image
                src={avatarUrl}
                fill
                className="rounded-full object-cover"
                alt="avatar image"
              />
            </div>
            <span>{row.getValue("name")}</span>
          </div>
        );
      },
    },
    //ANother Hidden item
    {
      accessorKey: "avatarUrl",
      header: "",
      cell: () => {
        return null;
      },
    },
    //Email row
    { accessorKey: "email", header: "Email" },
    //SubAccount Row
    {
      accessorKey: "SubAccount",
      header: "Owned Accounts",
      cell: ({ row }) => {
        const isAgencyOwner = row.getValue("role") === "AGENCY_OWNER"; //checking the role

        const ownedAccounts = row.original?.Permission.filter(
          (per) => per.access
        );

        if (isAgencyOwner)
          return (
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-2">
                <Badge className="bg-slate-600 whitespace-nowrap">
                  Agency - {row?.original?.Agency?.name}
                </Badge>
              </div>
            </div>
          );

        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              {ownedAccounts?.length ? (
                ownedAccounts.map((account) => (
                  <Badge
                    key={account.id}
                    className="bg-slate-600 w-fit whitespace-nowrap"
                  >
                    Sub Account - {account.SubAccount.name}
                  </Badge>
                ))
              ) : (
                <div className="text-muted-foreground">No Access Yet</div>
              )}
            </div>
          </div>
        );
      },
    },
    //Column of role
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role: Role = row.getValue("role");
        return (
          <Badge
            className={clsx({
              "bg-emerald-500": role === "AGENCY_OWNER",
              "bg-orange-400": role === "AGENCY_ADMIN",
              "bg-primary": role === "SUBACCOUNT_USER",
              "bg-muted": role === "SUBACCOUNT_GUEST",
            })}
          >
            {role}
          </Badge>
        );
      },
    },
    //Column for the actions
    {
      id: "actions",
      cell: ({ row }) => {
        const rowData = row.original;

        return <CellActions rowData={rowData} />;
      },
    },
  ];

interface CellActionsProps {
  rowData: UsersWithAgencySubAccountPermissionsSidebarOptions;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { data, setOpen } = useModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!rowData) return;
  if (!rowData.Agency) return;

  //Alert Dialog section meaning for managing the subaccount for each row
  return (
    <AlertDialog>
      {/* Dropdown meanu for copy email, edit the details  */}
      <DropdownMenu>
        {/* Dropdown meanu trigger point  */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown meanu content => open the Drop down menu */}
        <DropdownMenuContent align="end">
          {/* Action  Heading for the drop down  */}
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* Item inside the dropdown menu */}
          {/* item number 1 */}
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              navigator.clipboard.writeText(rowData?.email);
              toast({
                title: "Selected the Email",
                description: "Email is copied",
              });
            }}
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          {/* item number 2 Edit Details */}
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              //WHen you open Edit user this will redirected to the component of UserDetails
              setOpen(
                <CustomModal
                  subheading="You can change permissions only when the user has an owned subaccount"
                  title="Edit User Details"
                >
                  {/* adding userDetails component  */}
                  <UserDetails
                    type="agency"
                    id={rowData?.Agency?.id || null}
                    subAccounts={rowData?.Agency?.SubAccount}
                  />
                </CustomModal>,
                async () => {
                  return { user: await getUser(rowData?.id) };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>

          {/* if the role is not a Agency Owner then you can remove User :- Todo remove User  */}
          {rowData.role !== "AGENCY_OWNER" && (
            // THis is inside the ALert Dialog Trigger so this will Trigger the alert Dialog
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => {
                  <div>Delete your account</div>;
                }}
              >
                <Trash size={15} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Opening the Alert Box mainly for deleting the subaccount  */}
      <AlertDialogContent>
        {/* Header of the Delete Box */}
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the user
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* This section deals with 1.Cancel and 2.Deletionaction button */}
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              await deleteUser(rowData.id);
              toast({
                title: "Deleted User",
                description:
                  "The user has been deleted from this agency they no longer have access to the agency",
              });
              setLoading(false);
              router.refresh();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
