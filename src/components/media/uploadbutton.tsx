"use client";
import { useModal } from "@/Provider/modalProvider";
import React from "react";
import { Button } from "../ui/button";
import CustomModal from "../global/custom-modal";
import UploadMediaForm from "../form/upload-media";

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
            <UploadMediaForm subaccountId={subaccountId}></UploadMediaForm>
          </CustomModal>
        );
      }}
    >
      upload
    </Button>
  );
};

export default MediaUploadButton;
