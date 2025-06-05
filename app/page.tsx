"use client"

import { useRouter } from 'next/navigation'
import Component from "../vercel-logo-particles"

export default function SyntheticV0PageForDeployment() {
  const router = useRouter()

  const handleClick = () => {
    // Navigate to the quantum wallet analyzer project
    window.location.href = '/quantum-wallet-analyzer'
  }

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Component />
    </div>
  )
}