import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="z-50 w-full max-w-lg scale-100 opacity-100 transition-all duration-200">
        <div className="relative flex flex-col w-full bg-card text-card-foreground shadow-lg rounded-xl border p-6 glass">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="rounded-full p-1 hover:bg-muted transition-colors focus:outline-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="overflow-y-auto max-h-[70vh] pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
