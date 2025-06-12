"use client";

import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

const DeleteButton = ({ productId }: { productId: string }) => {
  const context = api.useUtils();

  const deleteProduct = api.adminRoute.product.delete.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Success deleting product",
      });
      await context.adminRoute.product.getAll.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const onSubmit = (values: { id: string }) => {
    deleteProduct.mutate(values);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"destructive"}>
            <IconTrash className="text- size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure want to delete this product?
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              className="w-fit justify-self-end"
              onClick={() => onSubmit({ id: productId })}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteButton;
