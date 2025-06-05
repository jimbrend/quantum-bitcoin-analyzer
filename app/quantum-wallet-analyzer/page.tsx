"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function QuantumWalletAnalyzer() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the bitcoin wallet analyzer
    router.push('/bitcoin-wallet-analyzer')
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Redirecting to Bitcoin Wallet Analyzer...</p>
    </div>
  )
} 