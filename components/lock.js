"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/app/supabaseSetup";

export default function Lock({ showUI }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check for an active session
        const { data, error } = await supabase.auth.getSession();
          
        

        if (error) {
          console.error("Error checking session:", error);
          setLoggedIn(false);
          router.push("/") //send user to login page
          return;
        }

        const user = data?.session?.user; // if no error get the user from the session from the data

        if (user) {
          const metadata = user.user_metadata
          const role = metadata.role
          console.log(role)
          if (role == "admin"){
              setLoggedIn(true);
            }
          else{
            setLoggedIn(false);
          }
          
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        console.error("Unexpected error while checking session:", err);
        setLoggedIn(false);
      }
    };

    checkSession();

    // Optional: Listen for authentication state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Check for role in user metadata
        const { user } = session;
        const role = user?.user_metadata?.role;
    
        if (role === 'admin') {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          router.push('/');
        }
      } else {
        setLoggedIn(false);
        router.push('/');
      }
    });
    

    return () => {
      // Cleanup the listener
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {loggedIn ? (
        <div>{showUI}</div>
      ) : (
        <div>
          <h2>Loading...</h2>
        </div>
      )}
    </>
  );
}
