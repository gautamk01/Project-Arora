"use client";
import { Funnel } from "@prisma/client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../global/loading";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  upsertFunnelPage,
  upsertFunnelProduct,
} from "@/lib/queries/funnelqueries";
import { v4 } from "uuid";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useModal } from "@/Provider/modalProvider";

type Props = {
  funnelDetails: Funnel;
};

const formSchema = z.object({
  name: z.string(),
  live: z.boolean(),
  image: z.string(),
  Interval: z.string(),
  price: z.string().transform((str) => str),
});

const FunnelProductDetails = ({ funnelDetails }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const { setClose } = useModal();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await upsertFunnelProduct({
        id: v4(),
        name: values.name,
        live: values.live,
        Image: values.image,
        Intervel: values.Interval,
        price: Number(values.price),
        funnelId: funnelDetails.id,
      });
      toast({
        title: "Created a Subaccount 🎉 ",
        description: "Successfully saved your subaccount details.",
      });
      setClose();
      window.dispatchEvent(new CustomEvent("productAdded"));
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save sub account details.",
      });
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Please enter Product details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image of product</FormLabel>
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
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Your Subaccount name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="price"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex md:flex-row gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="live"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make this Product Live</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="Interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="One time">One time </SelectItem>
                      <SelectItem value="Recuring">Recuring</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loading /> : "Save Product Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelProductDetails;
