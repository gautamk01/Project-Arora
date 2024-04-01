"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { saveActivityLogsNotification } from "@/lib/queries";
import { Funnel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateFunnelProducts } from "@/lib/queries/funnelqueries";

interface FunnelProductsTableProps {
  defaultData: Funnel;
}

const FunnelProductsTable: React.FC<FunnelProductsTableProps> = ({
  defaultData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [liveProducts, setLiveProducts] = useState<
    { productId: string; recurring: boolean }[] | []
  >(JSON.parse(defaultData.liveProducts || "[]"));

  const handleSaveProducts = async () => {
    setIsLoading(true);
    const response = await updateFunnelProducts(
      JSON.stringify(liveProducts),
      defaultData.id
    );
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel products | ${response.name}`,
      subaccountId: defaultData.subAccountId,
    });
    setIsLoading(false);
    router.refresh();
  };

  const handleAddProduct = async () => {};
  return (
    <>
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            <Table className="bg-card border-[1px] border-border rounded-md">
              <TableHeader className="rounded-md">
                <TableRow>
                  <TableHead>Live</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="font-medium truncate">
                {/* Needed to work on the product section  */}
                {/* {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Input
                  defaultChecked={
                    !!liveProducts.find(
                      //@ts-ignore
                      (prod) => prod.productId === product.default_price.id
                    )
                  }
                  onChange={() => handleAddProduct(product)}
                  type="checkbox"
                  className="w-4 h-4"
                />
              </TableCell>
              <TableCell>
                <Image
                  alt="product Image"
                  height={60}
                  width={60}
                  src={product.images[0]}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {
                  //@ts-ignore
                  product.default_price?.recurring ? "Recurring" : "One Time"
                }
              </TableCell>
              <TableCell className="text-right">
                $
                {
                  //@ts-ignore
                  product.default_price?.unit_amount / 100
                }
              </TableCell>
            </TableRow>
          ))} */}
              </TableBody>
            </Table>
            <Button
              disabled={isLoading}
              onClick={handleSaveProducts}
              className="mt-4"
            >
              Save Products
            </Button>
            {/* {subaccountDetails.connectAccountId ? (
              
            ) : (
              'Connect your stripe account to sell products.'
            )} */}
          </>
        </CardContent>
      </Card>
    </>
  );
};

export default FunnelProductsTable;
