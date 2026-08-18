"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, LayoutDashboard, FileText, LogOut, Menu, X } from "lucide-react"

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="ml-4 font-bold text-lg text-gray-900 tracking-tight">Admin</span>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-200 hidden md:block">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-16 md:mt-0">
          <Link 
            href="/admin" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/admin") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard className={`h-5 w-5 ${isActive("/admin") ? "text-gray-900" : "text-gray-400"}`} />
            Dashboard
          </Link>
          <Link 
            href="/admin/users" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/admin/users") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users className={`h-5 w-5 ${isActive("/admin/users") ? "text-gray-900" : "text-gray-400"}`} />
            Users & CRM
          </Link>
          <Link 
            href="/admin/wraps" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/admin/wraps") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileText className={`h-5 w-5 ${isActive("/admin/wraps") ? "text-gray-900" : "text-gray-400"}`} />
            Wraps
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-md hover:bg-gray-100 text-red-600 transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
