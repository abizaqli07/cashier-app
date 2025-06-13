"use client";

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import QuantityInputBasic from "~/components/ui/quantity-input";
import { api } from "~/trpc/react";

const AddQuantity = ({ productId }: { productId: string }) => {
  const [quantity, setQuantity] = useState(1);

  const context = api.useUtils();

  const addAmount = api.adminRoute.product.addQuantity.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Success update inventory",
      });
      await context.adminRoute.product.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const onSubmitPlus = () => {
    addAmount.mutate({
      id: productId,
      isPlus: true,
      quantity: quantity,
    });
  };
  const onSubmitMinus = () => {
    addAmount.mutate({
      id: productId,
      isPlus: false,
      quantity: quantity,
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size={"lg"}>
            Add Quantity <IconPlus className="mr-2 size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">Change Inventory</DialogTitle>
            <DialogDescription className="text-center">
              Change inventory for products
            </DialogDescription>
          </DialogHeader>

          {/* Forms Registration */}
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <QuantityInputBasic
              quantity={quantity}
              onChange={handleQuantityChange}
            />

            <div className="space-x-4">
              <Button variant={"destructive"} onClick={() => onSubmitMinus()}>
                Decrease
              </Button>
              <Button onClick={() => onSubmitPlus()}>Increase</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddQuantity;
