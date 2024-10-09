'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import axios, { AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/schemas/signupSchema'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

function page() {
  
  const [username, setUsername] = useState("")
  const [checkLoader, setCheckLoader] = useState(false)
  const [submitLoader, setSubmitLoader] = useState(false)
  const [message, setMessage] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const debounced = useDebounceCallback(setUsername, 300)

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const validateUsername = async () => {
      setCheckLoader(true)
      setMessage("")
      try {
        const response = await axios.post("/api/verify-username", debounced)
        setMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setMessage(axiosError.response?.data?.message || "username could not be verified")
      } finally{
        setCheckLoader(false)
      }
    }
    validateUsername()
  }, [debounced])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setSubmitLoader(true)
    try {
      const response: ApiResponse = await axios.post("/api/signup",data)
      if(response.success){
        toast({
          title: "Signup Successfull",
          description: "Please verify yourself with the code sent to your mail"
        })
        router.push(`/user-verification/${data.username}`)
      }
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

    } finally{
      setSubmitLoader(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {checkLoader&& <Loader2 className="animate-spin" />}
                  {!checkLoader && message && (
                    <p
                      className={`text-sm ${
                        message === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {message}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={submitLoader}>
              {submitLoader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default page