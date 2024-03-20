"use client";

import { Media } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
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
import Image from "next/image";
import { useToast } from "../ui/use-toast";
import { deleteMedia, saveActivityLogsNotification } from "@/lib/queries";

type Props = { file: Media };

const MediaCard = ({ file }: Props) => {
  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  return (
    <AlertDialog>
      <DropdownMenu>
        <article className="border w-full rounded-lg bg-slate-900">
          <div className="relative w-full h-40">
            {/* show the image */}
            <Image
              src={file.link}
              alt="preview image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {/* name of the image */}
          <p className="opacity-0 h-0 w-0">{file.name}</p>
          <div className="p-4 relative">
            {/* created at time and file name */}
            <p className="text-muted-foreground">
              {file.createdAt.toDateString()}
            </p>
            <p>{file.name}</p>
            <div className="absolute top-4 right-4 p-[1px] cursor-pointer ">
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
            </div>
          </div>

          {/* when you click the MoreHorizontal the below drop down meanu will be visible */}
          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* For copying the Image link */}
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(file.link);
                toast({ title: "Copied To Clipboard" });
              }}
            >
              <Copy size={15} /> Copy Image Link
            </DropdownMenuItem>

            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
          {/* this is the end of Dropdown Menu */}
        </article>
      </DropdownMenu>

      {/* when the alert is triggered the AlertDialog is given */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={Loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              const response = await deleteMedia(file.id);
              await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Deleted a media file | ${response?.name}`,
                subaccountId: response.subAccountId,
              });
              toast({
                title: "Deleted File",
                description: "Successfully deleted the file",
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

export default MediaCard;
