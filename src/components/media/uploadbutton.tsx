"use client";
import { useModal } from "@/provider/modal-provider";
import React from "react";
import { Button } from "../ui/button";
import CustomModal from "../global/custom-modal";

type Props = {
  subaccountId: string;
};

const MediaUploadButton = ({ subaccountId }: Props) => {
  const { isOpen, setOpen, setClose } = useModal();
  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Upload Media"
            subheading="Upload a file to your Media bucket"
          >
            <UploadMediaForm subaccount={subaccountId}></UploadMediaForm>
          </CustomModal>
        );
      }}
    >
      upload
    </Button>
  );
};

export default MediaUploadButton;
