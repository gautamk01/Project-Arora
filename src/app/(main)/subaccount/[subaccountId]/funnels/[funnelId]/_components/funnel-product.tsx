"use client";
import React, { useEffect, useState } from "react";
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
import { Funnel, FunnelProduct } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getFunnelsProduct,
  updateFunnelProducts,
} from "@/lib/queries/funnelqueries";
import { useModal } from "@/Provider/modalProvider";
import CustomModal from "@/components/global/custom-modal";
import FunnelProductDetails from "@/components/form/funnel-product-detail";

interface FunnelProductsTableProps {
  defaultData: Funnel;
}

const FunnelProductsTable: React.FC<FunnelProductsTableProps> = ({
  defaultData,
}) => {
  const router = useRouter();
  const { setOpen, setClose } = useModal();
  const [product, setProduct] = useState<FunnelProduct[]>([]);
  useEffect(() => {
    const fetchingProduct = async () => {
      const getproduct = await getFunnelsProduct(defaultData.id);
      setProduct(getproduct);
    };
    fetchingProduct();
    // Event listener for the custom 'productAdded' event
    const handleProductAdded = () => {
      fetchingProduct(); // Re-fetch products on event
    };

    window.addEventListener("productAdded", handleProductAdded);

    // Cleanup
    return () => {
      window.removeEventListener("productAdded", handleProductAdded);
    };
  }, [defaultData.id]);

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

  const HandleAddProduct = () => {
    setOpen(
      <CustomModal title="Add a Product" subheading="You can switch bettween">
        <FunnelProductDetails funnelDetails={defaultData} />
      </CustomModal>
    );
  };
  return (
    <>
      <Card className="flex-1 flex-shrink relative">
        <div className=" absolute top-0 right-4 max-sm:hidden  ">
          <Button
            disabled={isLoading}
            onClick={HandleAddProduct}
            className="mt-4"
          >
            + Add Products
          </Button>
        </div>

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
                {product.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Input
                        defaultChecked={product.live}
                        // onChange={() => handleAddProduct(product)}
                        type="checkbox"
                        className="w-4 h-4"
                      />
                    </TableCell>
                    <TableCell>
                      <Image
                        alt="product Image"
                        height={60}
                        width={60}
                        src={product.Image}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {
                        //@ts-ignore
                        product.Intervel
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{product.price}
                    </TableCell>
                  </TableRow>
                ))}
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
