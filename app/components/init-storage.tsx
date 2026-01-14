"use client"

import { useEffect } from "react"
import { initStorage } from "@/lib/storage"

export function InitStorage() {
  useEffect(() => {
    initStorage()
  }, [])

  return null
}
