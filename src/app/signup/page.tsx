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
      
    } finally{
      setSubmitLoader(false)
    }
  }

  return (
    <div>page</div>
  )
}
export default page