"use client";

import { useEffect, useState, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const particles = useRef<Particle[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Add new particle
      particles.current.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: 1
      })

      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement
      const isClickable = target.closest('a, button, [role="button"]')
      setIsPointer(!!isClickable)
    }

    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.current = particles.current.filter(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.opacity -= 0.02

        if (particle.opacity <= 0) return false

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 165, 0, ${particle.opacity})`
        ctx.fill()

        return true
      })

      // Draw atom
      const centerX = position.x
      const centerY = position.y
      const radius = isPointer ? 15 : 10
      const electronCount = 3
      const electronRadius = radius * 1.5

      // Draw nucleus
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius / 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'
      ctx.fill()

      // Draw electron orbits and electrons
      for (let i = 0; i < electronCount; i++) {
        const angle = (Date.now() / 1000 + i * (Math.PI * 2 / electronCount)) % (Math.PI * 2)
        const electronX = centerX + Math.cos(angle) * electronRadius
        const electronY = centerY + Math.sin(angle) * electronRadius

        // Draw orbit
        ctx.beginPath()
        ctx.arc(centerX, centerY, electronRadius, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)'
        ctx.stroke()

        // Draw electron
        ctx.beginPath()
        ctx.arc(electronX, electronY, radius / 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 165, 0, 0.8)'
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    // Set canvas size
    const updateCanvasSize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('resize', updateCanvasSize)
    updateCanvasSize()
    animate()

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  )
} 