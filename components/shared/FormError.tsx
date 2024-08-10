import { TriangleAlert } from "lucide-react";

const FormError = ({message } : {message?: string}) => {
    if (!message) return null;
  return (
    <div className = "bg-destructive/15 p-3 flex rounded-md items-center gap-x-2 text-sm text-destructive" >
        <TriangleAlert className  = {'size-5'} />
            <p  >{message}</p>
    </div>
  )
}

export default FormError