"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface BookNowButtonProps {
  roomId?: string; 
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

export default function BookNowButton({ 
  roomId, 
  checkIn,
  checkOut,
  guests,
  className, 
  children, 
  variant = "default",
  disabled = false
}: BookNowButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = () => {
    setIsLoading(true);
    
    const params = new URLSearchParams();
    
    if (roomId) params.append("roomId", roomId);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (guests) params.append("guests", guests.toString());

    const queryString = params.toString();
    const url = queryString ? `/booking/checkout?${queryString}` : "/booking/checkout";

    router.push(url);
  };

  return (
    <Button 
      onClick={handleCheckout} 
      className={className || "bg-teal-600 hover:bg-teal-700 text-white shadow-sm"}
      variant={variant}
      disabled={disabled || isLoading}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children || "Booking Sekarang"}
    </Button>
  );
}