"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/actions/signup.actions";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import FormError from "@/components/shared/FormError";
import FormSuccess from "@/components/shared/FormSuccess";
import { PasswordInput } from "@/components/shared/PasswordInput";
import LoadingButton from "@/components/shared/LoadingButton";
const SignUpForm = () => {
  const [isError, setIsError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    setIsError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      const { error, success } = await signUp(values);
      if (error) setIsError(error);
      if (success) {
        setSuccess(success);
        form.reset();
        router.refresh()
        router.push("/");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {isError && <FormError message={isError} />}
        {success && <FormSuccess message={success} />}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input disabled={isPending} placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Password" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading = {isPending} disabled={isPending} type="submit" className="w-full">
          Create an account
        </LoadingButton>
      </form>
    </Form>
  );
};

export default SignUpForm;
