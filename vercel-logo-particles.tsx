'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { AWS_LOGO_PATH } from './aws-logo-path'

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768) // Set mobile breakpoint
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
      isAWS: boolean
    }[] = []

    let textImageData: ImageData | null = null

    function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = 'white'
      ctx.save()
      
      const fontSize = isMobile ? 80 : 160 // Much larger text
      const line1 = "Are you a"
      const line2 = "safe Bitcoiner?"
      const quantumText = "quantum"
      
      // Draw all text for particles
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Draw all text for particles
      ctx.fillText(line1, canvas.width / 2, canvas.height / 2 - fontSize)
      ctx.fillText(quantumText, canvas.width / 2, canvas.height / 2)
      ctx.fillText(line2, canvas.width / 2, canvas.height / 2 + fontSize)
      
      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return fontSize
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data
      const particleGap = 2

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          // Check if this particle is in the "quantum" text area
          const isQuantum = y > canvas.height / 2 - 20 && y < canvas.height / 2 + 20
          
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1 + 0.5,
            color: 'white',
            scatteredColor: isQuantum ? '#FF9900' : '#FF9900',
            isAWS: false,
            life: Math.random() * 100 + 50
          }
        }
      }

      return null
    }

    function createInitialParticles(scale: number) {
      const baseParticleCount = 15000 // Increased for more background particles
      const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      
      // Create quantum gate pattern particles
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) {
          // Add quantum gate pattern
          const angle = (i / particleCount) * Math.PI * 2
          const radius = Math.min(canvas.width, canvas.height) * 0.4
          particle.baseX = canvas.width / 2 + Math.cos(angle) * radius
          particle.baseY = canvas.height / 2 + Math.sin(angle) * radius
          particle.x = particle.baseX
          particle.y = particle.baseY
          particle.size = Math.random() * 0.5 + 0.2 // Smaller particles for background
          particle.color = 'rgba(255, 255, 255, 0.3)' // More transparent
          particle.scatteredColor = 'rgba(255, 153, 0, 0.3)' // More transparent orange
          particles.push(particle)
        }
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 240

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 60
          const moveY = Math.sin(angle) * force * 60
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
          
          ctx.fillStyle = p.scatteredColor
        } else {
          // Add quantum gate rotation effect
          const time = Date.now() * 0.001
          const angle = time + (i / particles.length) * Math.PI * 2
          const radius = Math.min(canvas.width, canvas.height) * 0.4
          p.baseX = canvas.width / 2 + Math.cos(angle) * radius
          p.baseY = canvas.height / 2 + Math.sin(angle) * radius
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          ctx.fillStyle = p.color
        }

        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createTextImage()
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      const newScale = createTextImage()
      particles = []
      createInitialParticles(newScale)
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-black">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute top-0 left-0 touch-none cursor-pointer"
        aria-label="Interactive particle effect with Vercel and AWS logos"
        onClick={() => setShowSplash(false)}
      />
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer z-20"
        style={{ pointerEvents: 'auto' }}
      >
        <h1 className="text-2xl md:text-3xl font-mono text-white hover:text-orange-400 transition-colors duration-300">
          Are you a Quantum Safe<br />
          <span className="invisible">quantum</span><br />
          Bitcoiner?
        </h1>
      </div>
      <div className="absolute bottom-[100px] text-center z-10">
        <p className="font-mono text-gray-400 text-xs sm:text-base md:text-sm ">
          {' '}
          <a 
            href="https://github.com/jimbrend/quantum-bitcoin-analyzer"
            target="_blank"
            className="invite-link text-gray-300 hover:text-cyan-400 transition-colors duration-300"
          >
            Click here to see the source code available for this project,
          </a>{' '}
          <span>and always remember,</span>
          <span className="seed-warning transition-colors duration-300">
            {' '}never give out your seed phrase. 
          </span> <br /><a href="https://www.x.com/usernameisjim" className="text-gray-500 text-xs mt-2.5 inline-block" target="_blank">(x.com/usernameisjim)</a>
          <style>{`
            a.invite-link:hover ~ .seed-warning {
              color: #FF9900;
            }
          `}</style>
        </p>
      </div>
    </div>
  )
}

