"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { CreateServiceSchema } from "~/server/validator/service";
import { api } from "~/trpc/react";

const CreateButton = () => {
  const context = api.useUtils();

  const createService = api.adminRoute.service.create.useMutation({
    async onSuccess() {
      toast("Success", {
        description: "Success creating service",
      });
      await context.adminRoute.service.getAll.invalidate();
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof CreateServiceSchema>>({
    resolver: zodResolver(CreateServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublished: true,
      price: "0",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof CreateServiceSchema>) => {
    createService.mutate(values);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Service
          </Button>
        </DialogTrigger>
        <DialogContent className="scrollbar-hide max-h-[90vh] overflow-auto overflow-y-scroll sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Service</DialogTitle>
            <DialogDescription>Creating service for store 2</DialogDescription>
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
                      <Input placeholder="e.g. 'Reguler'" {...field} />
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
                        Check this if you want to make this service available
                        for customer
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                Create
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateButton;
