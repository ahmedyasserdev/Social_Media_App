'use client'
import FormError from "@/components/shared/FormError";
import FormSuccess from "@/components/shared/FormSuccess";
import LoadingButton from "@/components/shared/LoadingButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/login.actions";
import { loginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
const LoginForm = () => {
  const router = useRouter()
    const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
    const [isPending, startTransition] = useTransition();
  
    const form = useForm<LoginValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    });
  
    async function onSubmit(values: LoginValues) {
      setError(undefined);
      setSuccess(undefined);
      startTransition(async () => {
        const { error  , success } = await login(values);
        if (error) setError(error);
        if(success) {
          setSuccess(success)
          form.reset()
          router.refresh()
          router.push('/')
          
        }
     
      });
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <FormError message = {error} /> }
        {success && <FormSuccess message={success} />}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input disabled = {isPending} placeholder="Username" {...field} />
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
                <PasswordInput disabled = {isPending} placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton   disabled = {isPending} loading={isPending} type="submit" className="w-full">
          Log in
        </LoadingButton>
      </form>
    </Form>
  )
}

export default LoginForm