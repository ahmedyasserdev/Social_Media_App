'use client'
import { useEffect, useRef, useState, useTransition } from 'react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/lib/actions/login.actions';
import { loginSchema, LoginValues } from '@/lib/validation';

import FormError from '@/components/shared/FormError';
import FormSuccess from '@/components/shared/FormSuccess';
import LoadingButton from '@/components/shared/LoadingButton';
import { PasswordInput } from '@/components/shared/PasswordInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormAnimation } from '@/hooks/useFormAnimation';

const LoginForm = () => {
  const formRef = useRef(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Use the animation hook
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      const response = await login(values);
      if (response.error) setError(response.error);
      if (response.success) {
        setSuccess(response.success);
        form.reset();
        router.refresh();
        router.push('/');
      }
    });
  }


  useFormAnimation(formRef, inputsRef, buttonsRef);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <FormError message={error} />}
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                //@ts-ignore
                  ref={(el) => (inputsRef.current[1] = el)}
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
            Log in
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;


