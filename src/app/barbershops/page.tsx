import BarbershopItem from "../components/barbershop-item"
import { db } from "../lib/prisma"

interface BarbershopsPageProps {
  searchParams: {
    search?: string
  }
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  })
  return (
    <div>
      <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
        Resultados para {searchParams.search}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {barbershops.map((barbershop) => (
          <BarbershopItem key={barbershop.id} barbershop={barbershop} />
        ))}
      </div>
    </div>
  )
}

export default BarbershopsPage
