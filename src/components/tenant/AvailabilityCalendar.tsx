"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isWithinInterval, parseISO, format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarDays, Home } from "lucide-react";

interface AvailabilityData {
  roomId: string;
  roomName: string;
  propertyName: string;
  bookedDates: {
    checkIn: string; 
    checkOut: string; 
    status: string;
  }[];
}

export default function AvailabilityCalendar({ data }: { data: AvailabilityData[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const bookedDays = (day: Date) => {
    return data.some((room) =>
      room.bookedDates.some((booking) =>
        isWithinInterval(day, {
          start: parseISO(booking.checkIn),
          end: parseISO(booking.checkOut),
        })
      )
    );
  };

  const activeBookingsOnSelectedDate = date
    ? data.flatMap((room) =>
        room.bookedDates
          .filter((booking) =>
            isWithinInterval(date, {
              start: parseISO(booking.checkIn),
              end: parseISO(booking.checkOut),
            })
          )
          .map((booking) => ({
            ...booking,
            roomName: room.roomName,
            propertyName: room.propertyName,
          }))
      )
    : [];

  return (
    <Card className="col-span-4 lg:col-span-3 border-0 shadow-sm ring-1 ring-gray-200">
      <CardHeader className="p-6 pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-teal-600" />
          Kalender Ketersediaan
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          
          {/* BAGIAN KIRI: KALENDER */}
          <div className="p-4 flex justify-center border-r border-gray-100 md:w-auto w-full">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0"
              modifiers={{ booked: bookedDays }}
              modifiersStyles={{
                booked: { 
                    fontWeight: "bold", 
                    color: "#0f766e", // Teal-700
                    backgroundColor: "#ccfbf1", // Teal-100
                    borderRadius: "100%"
                }
              }}
            />
          </div>

          {/* BAGIAN KANAN: DETAIL HARIAN */}
          <div className="flex-1 p-6 bg-gray-50/50 min-h-[350px]">
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
              Status Tanggal: 
              <span className="ml-2 text-teal-600">
                {date ? format(date, "eeee, dd MMMM yyyy", { locale: id }) : "Pilih Tanggal"}
              </span>
            </h4>

            {activeBookingsOnSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {activeBookingsOnSelectedDate.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <Home className="h-3 w-3 text-gray-400" />
                        {item.propertyName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{item.roomName}</p>
                    </div>
                    <Badge variant="outline" className={
                        item.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }>
                        Terisi
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-10">
                <CalendarDays className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">Tidak ada booking aktif pada tanggal ini.</p>
                <p className="text-xs mt-1 opacity-70">Semua kamar tersedia.</p>
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}