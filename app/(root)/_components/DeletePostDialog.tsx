'use client'
import LoadingButton from '@/components/shared/LoadingButton'
import Modal from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { useDeletePostMutation } from '@/hooks/useDeletePostMutation'
import { PostData } from '@/lib/types'
import React from 'react'

type DeletePostProps = {
    post : PostData ;
    open : boolean ;
    onClose : () => void
}
const DeletePostDialog = ({post , open , onClose} : DeletePostProps) => {
    const  {isPending ,mutate} = useDeletePostMutation()
  return (
    <Modal
        title = "Delete post?"
        description = "Are you sure you want to delete this? this action can not be undo"
        isOpen = {open}
        onClose = {onClose}
    >

        <div className = "flex-end gap-x-4" >
        <LoadingButton variant = "destructive" loading ={isPending} disabled = {isPending}
            onClick  = {() => mutate(post.id , {onSuccess : onClose})}
        >
            Delete
        </LoadingButton>

        <Button variant = "outline" onClick = {onClose} disabled = {isPending} >Cancel</Button>

        </div>

    </Modal>
  )
}

export default DeletePostDialog