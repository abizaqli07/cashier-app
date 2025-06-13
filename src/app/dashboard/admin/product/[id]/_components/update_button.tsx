"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil } from "@tabler/icons-react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Editor } from "~/components/ui/editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { UploadDropzone } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { UpdateProductSchema } from "~/server/validator/product";
import { api, type RouterOutputs } from "~/trpc/react";

interface UpdateDataPropsInterface {
  data: RouterOutputs["adminRoute"]["product"]["getOne"];
  categories: RouterOutputs["adminRoute"]["category"]["getAll"];
}

const UpdateButton = ({ data, categories }: UpdateDataPropsInterface) => {
  const context = api.useUtils();

  const updateProduct = api.adminRoute.product.update.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Success updating product",
      });
      await context.adminRoute.product.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof UpdateProductSchema>>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      description: data?.description ?? "",
      isPublished: data?.isPublished ?? true,
      price: data?.price,
      image: data?.image,
      categoryId: data?.categoryId ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof UpdateProductSchema>) => {
    updateProduct.mutate(values);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-primary/20 absolute top-2 right-2 z-20 flex gap-2 rounded-md p-2 cursor-pointer">
            <IconPencil />
          </div>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
            <DialogDescription>Updating product for employee</DialogDescription>
          </DialogHeader>

          {/* Forms Registration */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Message Form */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="e.g. 'Americano'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isSubmitting}
                        placeholder="Price"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Price for this course</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload image product</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        className="ut-button:bg-primary ut-button:px-2 ut-button:mb-2 ut-label:text-primary"
                        endpoint="productImage"
                        onClientUploadComplete={(res) => {
                          toast("Upload Complete", {
                            description: "Image successfully uploaded",
                          });

                          form.setValue("image", res[0]?.ufsUrl ?? "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? categories.find(
                                  (category) => category.id === field.value,
                                )?.name
                              : "Select category"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search category..." />
                          <CommandList>
                            <CommandEmpty>No categories found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  value={category.name ?? ""}
                                  key={category.id}
                                  onSelect={() => {
                                    form.setValue("categoryId", category.id);
                                  }}
                                >
                                  {category.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      category.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the category that will be used in the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publish for employee?</FormLabel>
                      <FormDescription>
                        Check this if you want to make this product available
                        for customer
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit">Update</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateButton;
