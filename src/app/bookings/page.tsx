import { getServerSession } from "next-auth"
import Header from "../components/header"
import { db } from "../lib/prisma"
import { authOptions } from "../lib/auth"
import { redirect } from "next/navigation"
import BookingItem from "../components/booking-item"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/") // Redirect to home if not authenticated
  }
  const confirmedBookings = await db.booking.findMany({
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

  const concludedBookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
      date: {
        lt: new Date(),
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

  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        <h1 className="text-xl font-bold">Agendamentos</h1>
        {confirmedBookings.length === 0 && concludedBookings.length === 0 && (
          <p className="text-sm text-gray-500">Você não possui agendamentos.</p>
        )}

        {confirmedBookings.length > 0 && (
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Confirmados
          </h2>
        )}
        {confirmedBookings.map((booking) => (
          <BookingItem key={booking.id} booking={booking} />
        ))}
        {concludedBookings.length > 0 && (
          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Concluídos
          </h2>
        )}
        {concludedBookings.map((booking) => (
          <BookingItem key={booking.id} booking={booking} />
        ))}
      </div>
    </>
  )
}

export default Bookings
