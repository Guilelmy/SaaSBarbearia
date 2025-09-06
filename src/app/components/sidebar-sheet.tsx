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

const SidebarSheet = () => {
  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>
      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {/*<Avatar>
          <AvatarImage src="/image.png" alt="Avatar" />
        </Avatar>

        <div>
          <p className="font-bold">Guilhermy</p>
          <p className="text-xs">guilhermy@bugware.com.br</p>
        </div>*/}
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
            <Button variant="outline" className="gap-2 font-bold">
              <Image src="/Google.svg" width={18} height={18} alt=""></Image>
              Google
            </Button>
          </DialogContent>
        </Dialog>
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
          <Button
            key={option.title}
            className="justify-start gap-2"
            variant="ghost"
          >
            <Image
              src={option.imageUrl}
              height={18}
              width={18}
              alt={option.title}
            />
            {option.title}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-b border-solid p-5 py-5">
        <Button variant="ghost" className="justify-start">
          <LogOutIcon size={18} />
          Sair da conta
        </Button>
      </div>
    </SheetContent>
  )
}

export default SidebarSheet
