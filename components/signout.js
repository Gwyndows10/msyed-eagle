"use client"
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabaseSetup";

export default function SignOut(){
    const router = useRouter()

    const signout = async () => {
        const { error } = await supabase.auth.signOut()
if (error){
alert("an error happened")
console.error(error)
}

else{
    router.push("login")
}
    }


    return (
        <button
          onClick={signout}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      );
}


