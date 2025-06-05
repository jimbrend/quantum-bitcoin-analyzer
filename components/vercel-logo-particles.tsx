import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
}

export default function VercelLogoParticles({ onStart }: { onStart: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const particles = useRef<Particle[]>([])
  const scatteredParticles = useRef<Particle[]>([])
  const animationFrameId = useRef<number>()
  const cursor = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const rotatingDot = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const fontSize = window.innerWidth < 768 ? 80 : 160

    // Initialize particles
    const initParticles = () => {
      particles.current = []
      scatteredParticles.current = []

      // Create background particles with horizontal bias
      for (let i = 0; i < 15000; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2 + 0.5
        // Bias movement horizontally
        const speedX = (Math.random() - 0.5) * 1.5
        const speedY = (Math.random() - 0.5) * 0.5
        const color = `rgba(255, 153, 0, ${Math.random() * 0.1})`
        particles.current.push({ x, y, size, color, speedX, speedY })
      }

      // Create scattered particles with horizontal flow
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 2 + 0.5
        // Stronger horizontal movement
        const speedX = (Math.random() - 0.5) * 3
        const speedY = (Math.random() - 0.5) * 0.3
        const color = 'rgba(255, 153, 0, 0.3)'
        scatteredParticles.current.push({ x, y, size, color, speedX, speedY })
      }
    }

    initParticles()

    const draw = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.current.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen edges with horizontal bias
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Update and draw scattered particles
      scatteredParticles.current.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen edges with horizontal bias
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Draw text
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = 'rgba(255, 153, 0, 0.1)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Are you a', centerX, centerY - fontSize * 0.8)
      ctx.fillText('quantum', centerX, centerY)
      ctx.fillText('safe Bitcoiner?', centerX, centerY + fontSize * 0.8)

      requestAnimationFrame(draw)
    }

    draw()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update cursor position for main particles
      if (cursor.current) {
        cursor.current.x = x;
        cursor.current.y = y;
      }
      
      // Update cursor position for rotating dot
      if (rotatingDot.current) {
        rotatingDot.current.x = x;
        rotatingDot.current.y = y;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onClick={onStart}
      />
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={onStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`text-center transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
          <p className="text-orange-200 font-courier text-sm">
            Are you a quantum safe Bitcoiner?
          </p>
        </div>
      </div>
    </div>
  )
} 