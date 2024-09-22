'use client'

import { useCurrentUser } from "@/hooks/useCurrentUser"
import UserAvatar from "./UserAvatar"
import { useRef, useState } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { useSubmitPostMutation } from "@/hooks/useSubmitPostMutation"
import LoadingButton from "./LoadingButton"
import useMediaUpload, { Attachment } from "@/hooks/useMediaUpload"
import { ImageIcon, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
const PostEditor = () => {
  const user = useCurrentUser()
  const [text, setText] = useState("")
  const { mutate, isPending } = useSubmitPostMutation()
  const { attachments, isUploading, startUpload, removeAttachment, reset: resetMediaUpload, uploadProgress } = useMediaUpload()
  const onSubmit = () => {
    if (!text) return
    mutate({ content: text, mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[] }, {
      onSuccess: () => {
        setText("");
        resetMediaUpload();
      }
    })

  }



  return (
    <>
      { }
      <div className="flex flex-col bg-card gap-5 p-5 rounded-2xl shadow-sm w-full" >
        <div className="flex gap-5">
          <UserAvatar avatarUrl={user?.avatarUrl} className="hidden sm:inline" />
          <Textarea disabled={isPending} placeholder="Write a post" value={text} onChange={(e) => setText(e.target.value)}
            className="w-full max-h-[20rem] overflow-y-auto rounded-2xl bg-background px-5 py-3 " />
        </div>

        {
          !!attachments.length && (
            <AttachmentPreviews attachments={attachments} removeAttachment={removeAttachment} />
          )
        }

        <div className="flex-end gap-3">
          {isUploading && (
            <>
              <span className="text-sm text-foreground/50">Uploading {uploadProgress ?? 0}%</span>
              <Loader2 className="size-5 animate-spin text-primary" />
            </>
          )}
          <AddAttachmentButton onFilesSelected={startUpload} disabled={isUploading || isPending || attachments.length > 5} />
          <LoadingButton onClick={onSubmit} loading={isPending} className="min-w-20" disabled={!text.trim()} >Post</LoadingButton>
        </div>

      </div>
    </>
  )
}

export default PostEditor



type AddAttachmentsButtonProps = {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean,
}



function AddAttachmentButton({ onFilesSelected, disabled }: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button variant={'ghost'} size="icon" className="hover:text-primary text-primary" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
        <ImageIcon />
      </Button>

      <input type="file" accept='image/* , video/*' ref={fileInputRef} multiple onChange={(e) => {
        const files = Array.from(e.target.files || [])
        if (files.length) {
          onFilesSelected(files);
          e.target.value = ""
        }
      }}
        className='hidden sr-only' />
    </>
  )
}

type AttachmentPreviewsProps = {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void
}

function AttachmentPreviews({ attachments, removeAttachment }: AttachmentPreviewsProps) {

  return (
    <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm:grid-cols-2 ",)}>
      {
        attachments.map((attachment) => (
          <AttachmentPreview key={attachment.file.name} attachment={attachment} onRemoveClick={() => removeAttachment(attachment.file.name)} />
        ))
      }
    </div>
  )
}


type AttachmentPreviewProps = {
  attachment: Attachment;
  onRemoveClick: () => void;

}


function AttachmentPreview({ attachment: { file, isUploading, mediaId }, onRemoveClick }: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div className={cn("relative mx-auto size-fit", isUploading && "animate-pulse opacity-50")} >

      {
        file.type.startsWith("image") ? (
          <Image src={src} alt={"Attachment Preview"} width={500} height={500} className="size-fit max-h-[30rem] rounded-2xl" />
        ) : (
          <video controls className="size-fit max-h-[30rem] rounded-2xl">
            <source src={src} type={file.type} />
          </video>
        )
      }

      {
        !isUploading && (
          <button onClick={onRemoveClick}>
            <X size={20} className="absolute top-3  right-3 rounded-full bg-foreground p-1.5  text-background hover:text-primary transition-colors  hover:bg-background/60 " />
          </button>
        )
      }



    </div>
  )
}