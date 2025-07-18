"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ChangePasswordSchema } from "~/server/validator/auth";
import { api } from "~/trpc/react";

const ChangePassword = ({ employeeId }: { employeeId: string }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const changePw = api.adminRoute.employee.changePassword.useMutation({
    onSuccess() {
      toast("Success", {
        description:
          "Password succesfully changed. Please login with new password",
      });
    },
    onError(error) {
      toast("Error", {
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
      id: employeeId,
    },
  });

  async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
    changePw.mutate(values);
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { isSubmitting } = form.formState;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="hover:bg-accent relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none">
            <Pencil className="mr-2 h-4 w-4" />
            Change password
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Change password for this employee
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl className="relative">
                      <div className="w-full">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Employee new password"
                          autoComplete="current-password"
                          {...field}
                        />
                        <div
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700 focus:outline-none"
                        >
                          {showPassword ? (
                            <IconEyeClosed className="h-5 w-5" />
                          ) : (
                            <IconEye className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-5">
                <button
                  type="submit"
                  className="bg-primary w-full rounded-lg p-2 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing.." : "Change"}
                </button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangePassword;
