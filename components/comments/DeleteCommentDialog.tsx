'use client'
import LoadingButton from '@/components/shared/LoadingButton'
import Modal from '@/components/shared/Modal'
import { Button } from '@/components/ui/button'
import { useDeleteCommentMutation } from '@/hooks/useDeleteCommentMutation'
import { CommentData,  } from '@/lib/types'
import { useRouter } from 'next/navigation'
import React from 'react'

type DeleteCommentProps = {
    comment: CommentData;
    open: boolean;
    onClose: () => void
}
const DeleteCommentDialog = ({ comment, open, onClose }: DeleteCommentProps) => {
    const { isPending, mutate } = useDeleteCommentMutation();
    const router = useRouter();

    const handleDelete = () => {
        mutate(comment.id, { onSuccess: onClose })
        router.refresh()
    }

    return (
        <Modal
            title="Delete Comment?"
            description="Are you sure you want to delete this? this action can not be undo"
            isOpen={open}
            onClose={onClose}
        >

            <div className="flex-end gap-x-4" >
                <LoadingButton variant="destructive" loading={isPending} disabled={isPending}
                    onClick={handleDelete}
                >
                    Delete
                </LoadingButton>

                <Button variant="outline" onClick={onClose} disabled={isPending} >Cancel</Button>

            </div>

        </Modal>
    )
}

export default DeleteCommentDialog