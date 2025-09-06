"use client"
import { SmartphoneIcon } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface PhoneItemProps {
  phone: string
}

const handleCopyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success("Número copiado para a área de transferência!")
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  return (
    <div key={phone} className="flex justify-between">
      <div className="flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCopyToClipboard(phone)}
        >
          Copiar
        </Button>
      </div>
    </div>
  )
}

export default PhoneItem
