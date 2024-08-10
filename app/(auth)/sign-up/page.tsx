import { Metadata } from 'next'
import React from 'react'
import signUpImage from "@/assets/signup-image.jpg"
import Image from 'next/image'
import Link from 'next/link'
import SignUpForm from './_components/SignUpForm'
export const metadata : Metadata = {
    title : "Sign up"
}
const SignUpPage = () => {
  return (
    <section className = "flex-center h-screen p-5" >
        <div className="shadow-2xl  flex h-full max-h-[40rem] max-w-[64rem] rounded-2xl overflow-hidden bg-card ">
        <div className='md:w-1/2 w-full space-y-10 overflow-y-auto p-10' >
            <div className="space-y-1 text-center ">
              <h1 className="h2-bold">Sign up to bugbook</h1>

        <p className="text-muted-foreground">A Place where even <span className='italic' >you</span> can find a friend.</p>

            </div>


            <div className="space-y-5">
             <SignUpForm/>
              <Link href = "/login" className = "block text-center hover:underline" >
                Already have an account? Login
              </Link>
            </div>

        </div>
      
      
      
      
      
      
      
      
        <Image src={signUpImage} alt="sign up image" className = "w-1/2 hidden md:block object-cover" />
        </div>
    </section>
  )
}

export default SignUpPage