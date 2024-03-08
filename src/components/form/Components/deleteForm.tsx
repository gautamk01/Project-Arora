import React from "react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
type Props = {
  deletingAgency: any;
  handleDeleteAgency: any;
};

const Delete_section = (props: Props) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-left">
          Are you absolutely sure?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-left">
          This action cannot be undone. This will permanently delete the Agency
          account and all related sub accounts.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex items-center">
        <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={props.deletingAgency}
          className="bg-destructive hover:bg-destructive"
          onClick={props.handleDeleteAgency}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default Delete_section;
