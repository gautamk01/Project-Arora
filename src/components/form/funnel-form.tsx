"use client";
import React, { useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Funnel } from "@prisma/client";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { Button } from "../ui/button";
import Loading from "../global/loading";
import { CreateFunnelFormSchema } from "@/lib/type";
import { saveActivityLogsNotification } from "@/lib/queries";
import { v4 } from "uuid";
import { toast } from "../ui/use-toast";
import { useModal } from "@/Provider/modalProvider";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "../global/file-upload";
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
} from "../ui/alert-dialog";
import { DeleteFunnel, upsertFunnel } from "@/lib/queries/funnelqueries";

interface CreateFunnelProps {
  defaultData?: Funnel;
  subAccountId: string;
}

//Todo-page : Use favicons
const FunnelForm: React.FC<CreateFunnelProps> = ({
  defaultData,
  subAccountId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateFunnelFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CreateFunnelFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
      description: defaultData?.description || "",
      favicon: defaultData?.favicon || "",
      subDomainName: defaultData?.subDomainName || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        description: defaultData.description || "",
        favicon: defaultData.favicon || "",
        name: defaultData.name || "",
        subDomainName: defaultData.subDomainName || "",
      });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const handleDeleteFunnel = async () => {
    if (!defaultData?.id) return;
    try {
      const response = await DeleteFunnel(subAccountId, defaultData.id);
      //Toast will be like a Nofication above the Screen
      toast({
        title: "Deleted Funnal",
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
  };

  const onSubmit = async (values: z.infer<typeof CreateFunnelFormSchema>) => {
    if (!subAccountId) return;
    const response = await upsertFunnel(
      subAccountId,
      { ...values, liveProducts: defaultData?.liveProducts || "[]" },
      defaultData?.id || v4()
    );
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Created a funnel | ${response.name}`,
      subaccountId: subAccountId,
    });
    if (response)
      toast({
        title: "Success",
        description: "Saved funnel details",
      });
    else
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save funnel details",
      });
    setClose();
    router.refresh();
  };
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Funnel Details</CardTitle>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funnel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funnel Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit more about this funnel."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="subDomainName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub domain</FormLabel>
                    <FormControl>
                      <Input placeholder="Sub domain for funnel" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="favicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="subaccountLogo"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex  items-center gap-8">
                <Button
                  className="w-20 mt-4"
                  disabled={isLoading}
                  type="submit"
                >
                  {form.formState.isSubmitting ? <Loading /> : "Save"}
                </Button>
                {defaultData?.id && (
                  <AlertDialogTrigger>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-20 mt-4"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                )}
              </div>
            </form>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-left">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left">
                  This action cannot be undone. This will permanently delete the
                  Agency account and all related sub accounts.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex items-center">
                <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteFunnel}
                  className="mb-2 bg-destructive hover:bg-destructive"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </Form>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default FunnelForm;
