import { Metadata } from 'next'
import React from 'react'
import LoginForm from './_components/LoginForm'
import Link from 'next/link'
import LoginImage from "@/assets/login-image.jpg"
import Image from 'next/image'
export const metadata : Metadata = {
  title : "Login"
}

const LoginPage = () => {
  return (
    <section className = "flex-center h-screen p-5" >
           <div className="shadow-2xl  flex h-full max-h-[40rem] max-w-[64rem] rounded-2xl  bg-card ">
          <div className="w-full space-y-10 overflow-y-auto  p-10 md:w-1/2">
            <h1 className="h2-bold text-center ">Login to Bugbook</h1>
            <div className="space-y-5">
              <LoginForm/>
                <Link href = "/sign-up" className='block hover:underline text-center' >Don&apos;t have an account</Link>
            
            </div>
          </div>


      <Image src = {LoginImage} alt = "login image" className='object-cover  hidden md:block w-1/2'  />
    
           </div>
    </section>
  )
}

export default LoginPage