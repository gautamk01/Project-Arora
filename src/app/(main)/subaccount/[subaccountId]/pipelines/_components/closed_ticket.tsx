import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { Delete, RecycleIcon, ShieldClose } from "lucide-react";
import React, { MouseEventHandler } from "react";

type Props = { pipelineId: string };
type TicketinfoType = {
  id: string;
  name: string;
  email: string | undefined;
  Status: "CLOSE" | "OPEN";
  assigned: string | undefined;
  createdAt: Date;
  value: number | null;
};

const ClosedTickets = async ({ pipelineId }: Props) => {
  const Ticketinfo = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
    include: {
      Lane: {
        include: {
          Tickets: {
            include: {
              Customer: true, // Assuming you want customer details
              Assigned: true, // Assuming you want assigned user details
            },
          }, // Include all tickets within each lane
        },
      },
    },
  });

  let data1: TicketinfoType[] = [];

  Ticketinfo?.Lane.forEach((l) => {
    l.Tickets.forEach((t) => {
      const valueInCents = t.value ? +t.value.toString() * 100 : 0;
      data1.push({
        id: t.id,
        name: t.name,
        email: t.Customer?.email,
        assigned: t.Assigned?.name,
        Status: t.status,
        createdAt: t.createdAt,
        value: valueInCents,
      });
    });
  });

  const handleDelete = (sessionId: string): any => {
    // Prevents the default button behavior, which might be unnecessary depending on your use case
    console.log(`Deleting ticket with ID: ${sessionId}`);
    // Add your delete logic here
  };

  return (
    <Table>
      <TableHeader className="!sticky !top-0">
        <TableRow>
          <TableHead>name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Assigned</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="font-medium truncate">
        {data1
          ? data1.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.name || "unknown user "}</TableCell>
                <TableCell>{session.email || "Unknown email"}</TableCell>
                <TableCell>{session.assigned || "Assigned unknown"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      session.Status === "OPEN"
                        ? "bg-orange-500 dark:text-black"
                        : "bg-emerald-500 dark:text-black"
                    }
                  >
                    {session.Status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(session.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-emerald-500">{session.value}</span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={handleDelete(session.id)}
                    className="text-red-500"
                  >
                    <ShieldClose />
                  </button>
                </TableCell>
              </TableRow>
            ))
          : "No Data"}
      </TableBody>
    </Table>
  );
};

export default ClosedTickets;
