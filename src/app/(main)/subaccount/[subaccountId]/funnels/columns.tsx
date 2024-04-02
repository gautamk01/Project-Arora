"use client";
import { Badge } from "@/components/ui/badge";
import { FunnelsForSubAccount } from "@/lib/type";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<FunnelsForSubAccount>[] = [
  //These are different column in the table
  {
    //1. Name of the website
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      //this column is consiste of a link
      return (
        <Link
          className="flex gap-2 items-center"
          href={`/subaccount/${row.original.subAccountId}/funnels/${row.original.id}`}
        >
          {/* name of the website */}
          {row.getValue("name")}
          {/* icon */}
          <ExternalLink size={15} />
        </Link>
      );
    },
  },
  {
    //2.updatedAt (shows the last time this website is updated at)
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = ` ${row.original.updatedAt.toDateString()} ${row.original.updatedAt.toLocaleTimeString()} `;
      return <span className="text-muted-foreground">{date}</span>;
    },
  },
  {
    //3, shows the status of the website  (1.Draft or 2.live)
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.published;
      return status ? (
        <Badge variant={"default"}>Live - {row.original.subDomainName}</Badge>
      ) : (
        <Badge variant={"secondary"}>Draft</Badge>
      );
    },
  },
];
