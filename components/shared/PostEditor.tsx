'use client'

import { useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { createPost } from "@/lib/actions/post.actions"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import UserAvatar from "./UserAvatar"
import { useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
const PostEditor = () => {
    const user = useCurrentUser()
    const [text , setText] = useState("")    


    const onSubmit = async () => {
        if (!text) return
        await createPost(text)
        setText("")
    }

  

  return (
    <div className="flex flex-col bg-card gap-5 p-5 rounded-2xl shadow-sm w-full" >
        <div className="flex gap-5">
           <UserAvatar   avatarUrl={user?.avatarUrl} className="hidden sm:inline" />
          <Textarea placeholder = "Write a post" value={text} onChange={(e) => setText(e.target.value)} 
           className = "w-full max-h-[20rem] overflow-y-auto rounded-2xl bg-background px-5 py-3 " />
        </div>

    <div className="flex justify-end">
      <Button onClick={onSubmit}   className="min-w-20" disabled = {!text.trim()} >Post</Button>
    </div>

    </div>
  )
}

export default PostEditor