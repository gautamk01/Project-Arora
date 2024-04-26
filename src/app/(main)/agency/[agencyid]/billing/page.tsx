import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PricingCard from "./_components/pricing-card";
import { pricingCards } from "@/lib/constants";

type Props = {
  params: { agencyId: string };
};

const page = async ({ params }: Props) => {
  return (
    <>
      <h1 className="text-4xl p-4">Billing</h1>
      <Separator className=" mb-6" />
      <h2 className="text-2xl p-4">Current Plan</h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8">
        <PricingCard
          title={pricingCards[0].title}
          description={pricingCards[0].description}
          amt={pricingCards[0].price}
          highlightTitle={pricingCards[0].highlight}
          features={pricingCards[0].features}
          duration={pricingCards[0].duration}
          highlightDescription="Free for e "
          buttonCta="selected"
        />
        <PricingCard
          title={pricingCards[2].title}
          description={pricingCards[2].description}
          amt={pricingCards[2].price}
          highlightTitle={pricingCards[2].highlight}
          features={pricingCards[2].features}
          duration={pricingCards[2].duration}
          highlightDescription="Hello there is a group "
          buttonCta="Buy"
        />
        <PricingCard
          title={pricingCards[1].title}
          description={pricingCards[1].description}
          amt={pricingCards[1].price}
          highlightTitle={pricingCards[1].highlight}
          features={pricingCards[1].features}
          duration={pricingCards[1].duration}
          highlightDescription="Hello there is a group "
          buttonCta="Buy"
        />
      </div>
      <h2 className="text-2xl p-4">Payment History</h2>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead className="w-[200px]">Invoice Id</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
            <TableHead className="w-[200px]">Paid</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate"></TableBody>
      </Table>
    </>
  );
};

export default page;
