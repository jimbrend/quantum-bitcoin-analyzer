"use client";

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    const addParticle = (x: number, y: number) => {
      particles.current.push({
        x,
        y,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: 1
      })
    }

    const moveCursor = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY)
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.opacity -= 0.02

        if (particle.opacity <= 0) return false

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 153, 0, ${particle.opacity})`
        ctx.fill()

        return true
      })

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', moveCursor)
    animate()

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
      style={{
        width: '100vw',
        height: '100vh'
      }}
    />
  )
} 