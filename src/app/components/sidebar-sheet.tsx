"use client"

import { Calendar1Icon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react"
import Image from "next/image"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { quickSearchOptions } from "../constants/search"
import Link from "next/link"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { signIn, useSession, signOut } from "next-auth/react"
import { Avatar, AvatarImage } from "./ui/avatar"

const SidebarSheet = () => {
  const handleLoginWithGoogle = () => {
    signIn("google")
  }

  const { data } = useSession()

  const handleSignOut = () => signOut()

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>
      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={data?.user?.image ?? undefined} alt="Avatar" />
            </Avatar>
            <div>
              <p className="font-bold">{data.user.name}</p>
              <p className="text-xs">{data.user.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-bold">Olá, faça seu login!</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon">
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%]">
                <DialogHeader>
                  <DialogTitle>Faca login em nossa plataforma</DialogTitle>
                  <DialogDescription>
                    Conecte-se usando sua conta Google.
                  </DialogDescription>
                </DialogHeader>
                <Button
                  variant="outline"
                  className="gap-2 font-bold"
                  onClick={handleLoginWithGoogle}
                >
                  <Image
                    src="/Google.svg"
                    width={18}
                    height={18}
                    alt=""
                  ></Image>
                  Google
                </Button>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 border-b border-solid p-5 py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant={"ghost"} asChild>
            <Link href="/">
              {" "}
              <HomeIcon size={18} /> Inicio{" "}
            </Link>
          </Button>
        </SheetClose>
        <Button className="justify-start gap-2" variant={"ghost"} asChild>
          <Link href="/">
            {" "}
            <Calendar1Icon size={18} /> Agendamentos{" "}
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2 border-b border-solid p-5 py-5">
        {quickSearchOptions.map((option) => (
          <SheetClose asChild key={option.title}>
            <Button
              key={option.title}
              className="justify-start gap-2"
              variant="ghost"
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  src={option.imageUrl}
                  height={18}
                  width={18}
                  alt={option.title}
                />
                {option.title}
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-b border-solid p-5 py-5">
        <Button
          variant="ghost"
          className="justify-start"
          onClick={handleSignOut}
          disabled={!data?.user}
        >
          <LogOutIcon size={18} />
          Sair da conta
        </Button>
      </div>
    </SheetContent>
  )
}

export default SidebarSheet
