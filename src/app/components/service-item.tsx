"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { format, isPast, isToday, set } from "date-fns"
import { useSession } from "next-auth/react"
import { createBooking } from "../actions/create-booking"
import { toast } from "sonner"
import { getBookings } from "../actions/get-bookings"
import SignInDialog from "./sign-in-dialog"
import { Dialog, DialogContent } from "./ui/dialog"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const getTimeList = (bookings: Booking[], selectedDay: Date | undefined) => {
  const timelist = TIME_LIST.filter((time) => {
    const hour = time.split(":")[0]
    const minutes = time.split(":")[1]
    const timeIsOnThePast = isPast(
      set(new Date(), { hours: Number(hour), minutes: Number(minutes) }),
    )

    if (timeIsOnThePast && isToday(selectedDay!)) {
      return false
    }

    const hasBooking = bookings.some(
      (booking) =>
        booking.date.getHours() === Number(hour) &&
        booking.date.getMinutes() === Number(minutes),
    )
    if (hasBooking) {
      return false
    }
    return true
  })
  return timelist
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false)

  const { data } = useSession()

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  useEffect(() => {
    if (!selectedDay) {
      return
    }
    const fetch = async () => {
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    }
    fetch()
  }, [selectedDay, service.id])

  const handleSetBookingSheetOpen = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetOpen(false)
  }

  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDay(day)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) {
        return
      }
      const hours = selectedTime?.split(":")[0]
      const minutes = selectedTime?.split(":")[1]
      const newDate = set(selectedDay, {
        hours: Number(hours),
        minutes: Number(minutes),
        seconds: 0,
        milliseconds: 0,
      })
      await createBooking({
        serviceId: service.id,
        date: newDate,
      })
      toast.success("Agendamento criado com sucesso")
      handleSetBookingSheetOpen()
    } catch (error) {
      console.log(error)
      toast.error("Erro ao criar agendamento")
    }
  }

  const timeList = useMemo(
    () => getTimeList(dayBookings, selectedDay),
    [dayBookings, selectedDay],
  )

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt=""
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Sheet
                open={bookingSheetOpen}
                onOpenChange={handleSetBookingSheetOpen}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBookingClick()}
                >
                  Agendar
                </Button>
                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="flex justify-center border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDaySelect}
                      hidden={{ before: new Date() }}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {timeList.length > 0 ? (
                        timeList.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p>Nenhum horário disponível nesse dia</p>
                      )}
                    </div>
                  )}

                  {selectedDay && selectedTime && (
                    <div className="p-5">
                      <Card>
                        <CardContent className="space-y-3 p-3">
                          <div className="flex items-center justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <p className="text-sm font-bold">
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(service.price))}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Horário</h2>
                            <p className="text-sm">
                              {format(selectedDay, "d 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Data</h2>
                            <p className="text-sm">{selectedTime}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Barbearia</h2>
                            <p className="text-sm">{barbershop?.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <SheetFooter className="px-5">
                    <Button
                      type="submit"
                      onClick={handleCreateBooking}
                      disabled={!selectedDay || !selectedTime}
                      className="mt-4 w-full"
                    >
                      Confirmar Agendamento
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%] max-w-sm">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
