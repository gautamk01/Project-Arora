"use client";
import { Agency } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form"; // to set up a form.
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
// employed to link the Zod schema with React Hook Form for validation purposes.

import * as z from "zod"; //zod is schema validation librery
import FileUpload from "../global/file-upload";

import { NumberInput } from "@tremor/react";
import {
  deleteAgency,
  initUser,
  saveActivityLogsNotification,
  updateAgencyDetails,
  upsertAgency,
} from "@/lib/queries";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { v4 } from "uuid";
type Props = {
  //find Partial in Chatgpt
  data?: Partial<Agency>; // this means that we are assigning a generic type to data as Agency
};

import { FormSchema } from "./Components/zod_form";
import Formp from "./Components/Formp1";
import Delete_section from "./Components/deleteForm";
// Here using zod we are just assigning the validation to the form

// Agency Form
const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast(); // to show the notification
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);
  type FormField = z.infer<typeof FormSchema>;

  const form_validation = useForm<FormField>({
    // this line of code initializes a form state manager using the useForm hook
    //  with a TypeScript type inferred from a Zod schema named FormSchema.
    mode: "onChange", //This tells react-hook-form to trigger validation and form re-rendering every time the value of any form field changes.
    resolver: zodResolver(FormSchema), // This sets up Zod as your validation engine This going to connect Schema to useForm hook

    // They are the inital values
    //These values are populated based on the data prop passed into your component.
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    },
  });

  // when the form is Submiting it needed to be isLoading -> boolean is the return type
  const isLoading = form_validation.formState.isSubmitting;

  // we useEffect the default the react hook will caches the data
  useEffect(() => {
    //if data exsiste it will reset the value
    if (data) {
      form_validation.reset();
    }
  }, [data]);

  const handleSubmit_here = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserData;
      let custId;
      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          },
        };
      }
      newUserData = await initUser({ role: "AGENCY_OWNER" });

      if (!data?.id) {
        await upsertAgency({
          id: data?.id ? data.id : v4(),
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectAccountId: "",
          goal: 5,
        });
        toast({
          title: "Created Agency",
        });

        return router.refresh();
      }
    } catch (error) {
      toast({
        title: "!Opps",
        variant: "destructive",
        description: "Could not Create ",
      });
    }
  };

  //DeleteAgency Handler
  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    try {
      const response = await deleteAgency(data.id);
      //Toast will be like a Nofication above the Screen
      toast({
        title: "Deleted Agency",
        description: "Deleted your agency and all subaccounts",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not delete your agency ",
      });
    }
    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for you business. You can edit agency settings
            later from the agency settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* we are giving ...form_input for to connect form type from   */}
          <Form {...form_validation}>
            <form
              onSubmit={form_validation.handleSubmit(handleSubmit_here)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading} //isLoading comes from form state
                //if isLoading is true then field will be disabled
                control={form_validation.control}
                name="agencyLogo"
                //render input is comming from the value given to the controller
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Formp isLoading={isLoading} form_validation={form_validation} />
              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for your agency. As your business grows
                    your goals grow too so dont forget to set the bar higher!
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val) => {
                      if (!data?.id) return;
                      //passing the goal val to that specific id
                      await updateAgencyDetails(data.id, { goal: val });
                      //we needed to give the notification to the agency
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Updated the agency goal to | ${val} Sub Account`,
                        subaccountId: undefined,
                      });
                      router.refresh();
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Sub Account Goal"
                  />
                </div>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Agency Infomation"}
              </Button>
            </form>
          </Form>

          {/* Delete section in the form  */}
          {data?.id && (
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <div>Danger Zone</div>
              </div>
              <div className="text-muted-foreground">
                Deleting your agency cannpt be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to funnels, contacts etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAgency ? "Deleting..." : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}
          <Delete_section
            deletingAgency={deleteAgency}
            handleDeleteAgency={handleDeleteAgency}
          />
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetails;
