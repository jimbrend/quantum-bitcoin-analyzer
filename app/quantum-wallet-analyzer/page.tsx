"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function QuantumWalletAnalyzer() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the actual quantum wallet analyzer project
    window.location.href = 'http://localhost:3001' // Assuming your quantum-wallet-analyzer runs on port 3001
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Redirecting to Quantum Wallet Analyzer...</p>
    </div>
  )
} 