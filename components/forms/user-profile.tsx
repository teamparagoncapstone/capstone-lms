"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../../components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface User {
  name: string;
  username: string;
  email: string;
  password: string; // Consider removing this for security
  createdAt: string;
  updatedAt: string;
}

export function UserProfile() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [userData, setUserData] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      console.log("Session:", session); // Log session object

      const username = session.user?.username;
      if (!username) {
        setError("User is not authenticated or username is missing.");
        return;
      }

      fetch("/api/fetchUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            setUserData(data.user);
            setName(data.user.name);
          } else {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error); // Log the error
          setError(error.message);
        });
    }
  }, [loading, session]);

  const handleSave = () => {
    // Implement save logic here
    console.log("Save button clicked. Implement save logic.");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-transparent border-none">
          Profile Settings
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          {error && <div className="text-red-500">{error}</div>}
          <Separator />
          <Avatar className="h-32 w-32">
            {session?.user?.image ? (
              <AvatarImage src={session.user.image} alt="@user" />
            ) : (
              <AvatarImage src="/assets/usericon.png" alt="@user" />
            )}
            <AvatarFallback>
              <Image
                src="/assets/usericon.png"
                alt="Fallback Image"
                width={200}
                height={200}
              />
            </AvatarFallback>
          </Avatar>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={session?.user?.username || ""}
              className="col-span-3 text-xs"
              readOnly
            />
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={userData?.email || ""}
              className="col-span-3"
              readOnly
            />
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={userData?.password || ""}
              className="col-span-3"
              readOnly
            />
          </div>
        </div>
        <SheetFooter className="flex items-center justify-center gap-4">
          <Button onClick={handleSave}>Save</Button>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
