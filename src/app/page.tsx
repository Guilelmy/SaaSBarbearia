import { SearchIcon } from "lucide-react"
import Header from "./components/header"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import Image from "next/image"

export default function Home() {
  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Guilhermy</h2>
        <p>Hoje é Quinta-feira, 04 de Setembro</p>

        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Pesquisar" />
          <Button>
            <SearchIcon />
          </Button>
        </div>
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/Banner Pizza.png"
            alt="Banner 01"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </div>
  )
}
