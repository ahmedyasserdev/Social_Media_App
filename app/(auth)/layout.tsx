import { Spotlight } from '@/components/ui/spotlight'
import React from 'react'

const AuthLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <>
         <Spotlight  className='h-screen top-0 left-[160px]  md:left-20 md:-top-20 ' fill = "rgb(22, 163, 74)"  />
         <Spotlight  className='h-screen top-10 left-[170px]  md:left-30 md:-top-20 ' fill = "rgb(22, 163, 74 ,.5)"  />
         <Spotlight  className='h-screen top-10 left-[170px]  md:left-30 md:-top-20 ' fill = "rgb(22, 163, 74 ,.3)"  />
        {children}
    </>
  )
}

export default AuthLayout