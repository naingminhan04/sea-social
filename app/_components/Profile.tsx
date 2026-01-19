'use client'

import { getUserAction } from "../_actions/user"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

const Profile = ({userId}:{userId:string}) => {

    const { data: user, isLoading, error, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const result = await getUserAction(userId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    })

    if (isLoading) return <div>Loading</div>
    if (error) return <div>Error{error.message} <button onClick={()=>refetch()}>Retry</button> </div>

  return (
    <div>
      {user?.name}
    </div>
  )
}

export default Profile
