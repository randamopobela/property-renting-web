"use client";

import { useEffect, useState } from "react";
import { getAllPropertiesService } from "@/services/property.service"; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { MapPin, Users, Building2, Loader2 } from "lucide-react";
import BookNowButton from "@/components/booking/BookNowButton";
import { toast } from "sonner";
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";   

// FIX: Sesuaikan interface dengan field database (gunakan basePrice)
interface Room {
    id: string;
    type: string;
    basePrice: number; // FIX: Ganti price jadi basePrice sesuai schema Prisma
    price?: number;    // Opsional untuk jaga-jaga
    capacity: number;
}

interface Property {
    id: string;
    name: string;
    description: string;
    city: string;
    pictures: { url: string }[];
    rooms: Room[]; 
}

export default function PropertyListPage() {
  const { data: session, status } = useSession(); 
  const router = useRouter();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- HARDCODE TANGGAL DEMO (Besok s/d Lusa) ---
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(tomorrow.getDate() + 2);

  const checkInStr = tomorrow.toISOString().split('T')[0]; 
  const checkOutStr = dayAfterTomorrow.toISOString().split('T')[0];
  const defaultGuests = 1;
  // ----------------------------------------------

  useEffect(() => {
    if (status === "loading") return; 

    if (status === "unauthenticated") {
        toast.error("Anda harus login untuk melihat daftar properti.");
        router.push("/"); 
        return;
    }

    if (status === "authenticated") {
        const fetchData = async () => {
          try {
            const result = await getAllPropertiesService();
            // Handle jika result dibungkus dalam { data: ... } atau langsung array
            const data = result.data || result;
            setProperties(Array.isArray(data) ? data : []);
          } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data properti");
          } finally {
            setIsLoading(false);
          }
        };

        fetchData();
    }
  }, [status, router]);

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            <span className="ml-2 text-gray-500">Memuat data...</span>
        </div>
    );
  }

  if (status === "unauthenticated") {
      return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Penginapan Tersedia</h1>
        <p className="text-gray-500 mt-2">Halo, {session?.user?.name || "Guest"}! Pilih kamar dan langsung checkout.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-md flex flex-col">
            
            {/* Gambar Properti */}
            <div className="relative h-48 w-full bg-gray-200">
               {/* FIX: Gunakan img tag biasa untuk menghindari error hostname next/image jika belum dikonfigurasi */}
               <img 
                 src={property.pictures?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                 alt={property.name}
                 className="object-cover w-full h-full absolute inset-0"
               />
               <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-teal-700 shadow-sm">
                  {property.city}
               </div>
            </div>

            <CardHeader className="pb-2">
               <CardTitle className="text-xl line-clamp-1" title={property.name}>
                 {property.name}
               </CardTitle>
               <div className="flex items-center text-gray-500 text-sm gap-1">
                 <MapPin className="h-3 w-3" /> {property.city}
               </div>
            </CardHeader>

            <CardContent className="grow space-y-4">
               <p className="text-sm text-gray-600 line-clamp-2">
                 {property.description || "Nikmati pengalaman menginap terbaik bersama kami."}
               </p>

               <div className="space-y-3 mt-4">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pilih Kamar:</h4>
                 
                 {property.rooms && property.rooms.length > 0 ? (
                    property.rooms.map((room) => (
                      <div key={room.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center group hover:border-teal-200 transition">
                         <div>
                            <div className="font-semibold text-gray-800 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-teal-500" />
                                {room.type}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                <Users className="h-3 w-3" /> Max {room.capacity} Tamu
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="font-bold text-teal-700 text-sm">
                                {/* FIX: Gunakan basePrice, dengan fallback 0 agar tidak error */}
                                Rp {(room.basePrice || room.price || 0).toLocaleString()}
                            </div>
                         </div>
                      </div>
                    ))
                 ) : (
                    <div className="text-sm text-red-400 italic bg-red-50 p-2 rounded text-center">
                        Tidak ada kamar tersedia
                    </div>
                 )}
               </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
               {property.rooms && property.rooms.length > 0 ? (
                   <BookNowButton 
                      roomId={property.rooms[0].id} 
                      checkIn={checkInStr}
                      checkOut={checkOutStr}
                      guests={defaultGuests}
                      className="w-full bg-teal-600 hover:bg-teal-700 font-bold"
                   >
                      Booking {property.rooms[0].type}
                   </BookNowButton>
               ) : (
                   <Button disabled className="w-full bg-gray-300">Penuh</Button>
               )}
            </CardFooter>

          </Card>
        ))}
      </div>
    </div>
  );
}