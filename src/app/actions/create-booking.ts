"use server"

import { db } from "@/app/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "../lib/auth"

interface CreateBookingParams {
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions)
  if (!user) {
    throw new Error("Unauthorized")
  }
  await db.booking.create({
    data: { ...params, userId: (user.user as any).id },
  })

  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
}
