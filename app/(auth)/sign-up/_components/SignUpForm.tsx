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
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import FormError from "@/components/shared/FormError";
import FormSuccess from "@/components/shared/FormSuccess";
import { PasswordInput } from "@/components/shared/PasswordInput";
import LoadingButton from "@/components/shared/LoadingButton";
import { useFormAnimation } from "@/hooks/useFormAnimation";
const SignUpForm = () => {
  const [isError, setIsError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Use the animation hook
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
  useFormAnimation(formRef, inputsRef, buttonsRef);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {isError && <FormError message={isError} />}
        {success && <FormSuccess message={success} />}

      
        {/* Inputs */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                //@ts-ignore
                  ref={(el) => (inputsRef.current[0] = el)}
                  disabled={isPending}
                  placeholder="Username"
                  {...field}
                />
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
                //@ts-ignore
                  ref={(el) => (inputsRef.current[1] = el)}
                  disabled={isPending}
                  placeholder="Email"
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
                <PasswordInput
                //@ts-ignore
                  ref={(el) => (inputsRef.current[2] = el)}
                  disabled={isPending}
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div>
          <LoadingButton

              //@ts-ignore
            ref={(el) => (buttonsRef.current[0] = el)}
            disabled={isPending}
            loading={isPending}
            type="submit"
            className="w-full"
          >
            Sign Up
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
