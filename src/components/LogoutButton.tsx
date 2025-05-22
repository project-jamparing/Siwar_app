'use client'
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton(){
    const route = useRouter()

    const handleLogout = async () => {
        const req = await fetch('/api/logout', {
            method: 'POST',
          });
      
          if (req.ok) {
             route.replace('/login')
          }
    }

    return (
        <button type="button" onClick={handleLogout} className="flex items-center space-x-2 text-red-500 hover:text-red-600">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
    )
}