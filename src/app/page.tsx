import Header from "./components/header"
import { Button } from "./components/ui/button"
import Image from "next/image"
import { db } from "./lib/prisma"
import BarbershopItem from "./components/barbershop-item"
import { quickSearchOptions } from "./constants/search"
import BookingItem from "./components/booking-item"
import Search from "./components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Home = async () => {
  const barbershops = await db.barbershop.findMany({})
  const session = await getServerSession(authOptions)
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  const bookings = session?.user
    ? await db.booking.findMany({
        where: {
          userId: (session.user as any).id,
          date: {
            gte: new Date(),
          },
        },
        include: {
          service: {
            include: {
              barbershop: true,
            },
          },
        },
        orderBy: { date: "asc" },
      })
    : []

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "Bem-vindo"}
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span> de</span>
          <span className="capitalize">
            {format(new Date(), "  MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </p>

        <div className="mt-6">
          <Search />
        </div>

        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              key={option.title}
              className="gap-2"
              variant="secondary"
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  src={option.imageUrl}
                  alt={option.title}
                  width={16}
                  height={16}
                />
                {option.title}
              </Link>
            </Button>
          ))}
        </div>
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/Banner Pizza.png"
            alt="Banner 01"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Agendamentos
        </h2>
        <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="min-w-[300px] flex-shrink-0">
                <BookingItem booking={booking} />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Nenhum agendamento encontrado
            </p>
          )}
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}
export default Home
