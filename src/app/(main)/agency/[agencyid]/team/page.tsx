import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import DataTable from "./dataTable";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import SendInvitation from "@/components/form/send-invitation";

type Props = {
  params: { agencyid: string };
};

const Teamsection = async ({ params }: Props) => {
  const authUser = await currentUser();
  //users under the agency from user table
  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyid,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permission: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;

  //find the agency details
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyid,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return;
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    ></DataTable>
  );
};

export default Teamsection;
