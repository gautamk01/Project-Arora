import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import React from "react";

type Props = {
  isLoading: boolean;
  form_validation: any;
};

const Formp = (props: Props) => {
  return (
    <>
      <div className="flex md:flex-row gap-4">
        <FormField
          disabled={props.isLoading}
          control={props.form_validation.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Agency Name</FormLabel>
              <FormControl>
                <Input placeholder="Your agency name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form_validation.control}
          name="companyEmail"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Agency Email</FormLabel>
              <FormControl>
                <Input readOnly placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex md:flex-row gap-4">
        <FormField
          disabled={props.isLoading}
          control={props.form_validation.control}
          name="companyPhone"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Agency Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        disabled={props.isLoading}
        control={props.form_validation.control}
        name="whiteLabel"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
              <div>
                <FormLabel>Whitelabel Agency</FormLabel>
                <FormDescription>
                  Turning on whilelabel mode will show your agency logo to all
                  sub accounts by default. You can overwrite this functionality
                  through sub account settings.
                </FormDescription>
              </div>

              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          );
        }}
      />
      <FormField
        disabled={props.isLoading}
        control={props.form_validation.control}
        name="address"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="123 st..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex md:flex-row gap-4">
        <FormField
          disabled={props.isLoading}
          control={props.form_validation.control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={props.isLoading}
          control={props.form_validation.control}
          name="state"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={props.isLoading}
          control={props.form_validation.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Zipcpde</FormLabel>
              <FormControl>
                <Input placeholder="Zipcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        disabled={props.isLoading}
        control={props.form_validation.control}
        name="country"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input placeholder="Country" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default Formp;
