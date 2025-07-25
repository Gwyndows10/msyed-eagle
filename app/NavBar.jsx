"use client";
import Link from 'next/link';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NavBar() {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <h1 className="text-3xl font-bold">Eagle Project</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl text-center">Please sign in to continue.</p>
        <SignInButton mode="modal">
          <button className="px-6 py-3 rounded bg-neutral-800 text-white font-semibold hover:bg-neutral-900 transition">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <nav className="w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
      {/* Left: Avatar with dropdown */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User'} />
              <AvatarFallback>{user?.fullName?.[0] || user?.primaryEmailAddress?.emailAddress?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </div>
            <SignOutButton>
              <DropdownMenuItem className="text-red-600 cursor-pointer">Sign Out</DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Center: Dashboard title links to dashboard */}
      <Link href="/dashboard" className="text-xl font-bold tracking-tight hover:underline">Dashboard</Link>
      {/* Right: Reports button */}
      <div>
        <Link href="/reports" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Reports</Link>
      </div>
    </nav>
  );
} 