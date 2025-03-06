'use client'

import {HeroUIProvider} from "@heroui/react"
import {ToastProvider} from "@heroui/toast";


export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider  />
      {children}
    </HeroUIProvider>
  )
}