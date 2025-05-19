"use client"

import { Button } from "@workspace/ui/components/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber: string
  className?: string
}

export default function WhatsAppButton({ phoneNumber, className = "" }: WhatsAppButtonProps) {
  // Format the phone number by removing any non-digit characters
  const formattedNumber = phoneNumber.replace(/\D/g, "")

  const handleWhatsAppRedirect = () => {
    // WhatsApp API URL format
    const whatsappUrl = `https://wa.me/${formattedNumber}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      type="button"
      onClick={handleWhatsAppRedirect}
      className={`bg-green-600 hover:bg-green-700 text-white rounded-full px-6 flex items-center space-x-2 ${className}`}
    >
      <MessageCircle size={18} />
      <span>WhatsApp</span>
    </Button>
  )
}
