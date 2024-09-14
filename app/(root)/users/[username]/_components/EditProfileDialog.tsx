"use client"
import { UserData } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { UpdateUserProfileValues } from '@/lib/validation';
import { useUpdateUserMutation } from '@/hooks/useUpdateUserMutation';
import LoadingButton from '@/components/shared/LoadingButton';
import { StaticImageData } from 'next/image';



type EditProfileDialogProps = {
    user: UserData;
    open: boolean;
    onOpenChange: (open: boolean) => void
}
const EditProfileDialog = ({ user, open, onOpenChange }: EditProfileDialogProps) => {
    const form = useForm<UpdateUserProfileValues>({
        defaultValues: {
            displayName: user.displayName,
            bio: user.bio || "",
        }
    });

    const mutation = useUpdateUserMutation();

    async function onSubmit(values: UpdateUserProfileValues) {
        mutation.mutate({ values, }, {
            onSuccess: () => onOpenChange(false)
        })
    }



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent >
                <DialogHeader>
                    Edit Profile
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your display name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <LoadingButton type="submit" loading={mutation.isPending}>
                                Save
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileDialog


type AvatarInputProps =  {
    src : string | StaticImageData ;
    onImageCropped : (blob : Blob | null) => void
}

function AvatarInput ({onImageCropped , src} : AvatarInputProps) {}