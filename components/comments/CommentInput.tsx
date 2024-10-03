"use client"
import { useSubmitCommentMutation } from '@/hooks/useSubmitCommentMutation'
import { PostData } from '@/lib/types'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2, SendHorizonal } from 'lucide-react'

type CommentInputProps = {
    post : PostData
}
const CommentInput = ({post } : CommentInputProps) => {
    const [input, setInput] = useState("");
    const mutation = useSubmitCommentMutation(post.id)
    const onSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        if (!input) return ;
        mutation.mutate(
            {
                content : input ,
                post  ,
            
            },
            {
                onSuccess() {

                    setInput("")
                },
            }
            
        )

    }

  return (
    <form onSubmit={onSubmit}  className='flex w-full items-center gap-2'>
        <Input placeholder='Write a comment' value = {input} onChange ={(e) => setInput(e.target.value)} autoFocus />

        <Button variant={"ghost"} size = "icon" type = "submit" disabled = {!input.trim() || mutation.isPending } >

             {
                !mutation.isPending ? (<SendHorizonal/>):(<Loader2  className = "animate-spin" />)
             }

        </Button>
    </form>
  )
}

export default CommentInput