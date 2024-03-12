import {
  deleteSubAccount,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  subaccountId: string;
};

const DeleteButton = (props: Props) => {
  const router = useRouter();
  return (
    <div
      onClick={async () => {
        const response = await getSubaccountDetails(props.subaccountId);
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Deleted a subaccount| ${response?.name}`,
          subaccountId: props.subaccountId,
        });
        await deleteSubAccount(props.subaccountId);
        router.refresh();
      }}
    >
      Delete SubAccount
    </div>
  );
};

export default DeleteButton;
