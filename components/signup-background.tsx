"use client"

import { useEffect, useRef } from "react"

/* ── Particle system on canvas ───────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let raf: number
    let w = 0, h = 0

    function resize() {
      w = canvas!.width  = window.innerWidth
      h = canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // ── Particles ──────────────────────────────────────────────────────────
    const N = 120
    interface P { x:number; y:number; vx:number; vy:number; r:number; a:number; va:number; color:string }
    const COLORS = ["#7c3aed","#6366f1","#8b5cf6","#a78bfa","#60a5fa","#c084fc"]
    const pts: P[] = Array.from({length:N}, () => ({
      x:  Math.random()*1920,
      y:  Math.random()*1080,
      vx: (Math.random()-0.5)*0.4,
      vy: (Math.random()-0.5)*0.4,
      r:  1 + Math.random()*2.5,
      a:  Math.random(),
      va: (Math.random()-0.5)*0.006,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
    }))

    // ── Shooting stars ─────────────────────────────────────────────────────
    interface S { x:number; y:number; len:number; speed:number; angle:number; a:number; life:number; maxLife:number }
    const stars: S[] = []
    function spawnStar() {
      stars.push({
        x: Math.random()*w, y: Math.random()*h*0.5,
        len: 80+Math.random()*120, speed: 4+Math.random()*4,
        angle: Math.PI/4 + (Math.random()-0.5)*0.3,
        a: 1, life: 0, maxLife: 60+Math.random()*40,
      })
    }
    let starTimer = 0

    // ── Hex grid overlay ───────────────────────────────────────────────────
    function drawHexGrid() {
      const size = 55, rows = Math.ceil(h/size/1.5)+2, cols = Math.ceil(w/size/Math.sqrt(3))+2
      ctx.strokeStyle = "rgba(139,92,246,0.06)"
      ctx.lineWidth = 1
      for (let r = -1; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const cx = c * size * Math.sqrt(3) + (r%2)*size*Math.sqrt(3)/2
          const cy = r * size * 1.5
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const ang = Math.PI/3*i - Math.PI/6
            const px = cx + size*Math.cos(ang)
            const py = cy + size*Math.sin(ang)
            i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py)
          }
          ctx.closePath()
          ctx.stroke()
        }
      }
    }

    function tick() {
      ctx.clearRect(0,0,w,h)

      // Background
      const bg = ctx.createRadialGradient(w*0.5,0,0, w*0.5,h*0.5,w*0.8)
      bg.addColorStop(0,  "rgba(20,10,40,1)")
      bg.addColorStop(0.5,"rgba(8,6,20,1)")
      bg.addColorStop(1,  "rgba(2,2,8,1)")
      ctx.fillStyle = bg
      ctx.fillRect(0,0,w,h)

      // Aurora
      const t = Date.now()/1000
      for (let i=0;i<3;i++) {
        const ax = w*(0.3+i*0.2) + Math.sin(t*0.3+i)*100
        const ay = h*(0.1+i*0.08) + Math.cos(t*0.25+i)*60
        const rad = w*(0.35+i*0.05)
        const g = ctx.createRadialGradient(ax,ay,0, ax,ay,rad)
        const alphas = [0.18,0.12,0.14]
        const colors = ["124,58,237","99,102,241","168,85,247"]
        g.addColorStop(0, `rgba(${colors[i]},${alphas[i]})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.fillRect(0,0,w,h)
      }

      // Hex grid
      drawHexGrid()

      // Connect nearby particles
      for (let i=0;i<N;i++) {
        for (let j=i+1;j<N;j++) {
          const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y
          const d=Math.sqrt(dx*dx+dy*dy)
          if (d<120) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x,pts[i].y)
            ctx.lineTo(pts[j].x,pts[j].y)
            ctx.strokeStyle=`rgba(139,92,246,${0.18*(1-d/120)})`
            ctx.lineWidth=0.6
            ctx.stroke()
          }
        }
      }

      // Draw & update particles
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.a += p.va
        if (p.x<0) p.x=w; if (p.x>w) p.x=0
        if (p.y<0) p.y=h; if (p.y>h) p.y=0
        if (p.a<0.1||p.a>0.9) p.va*=-1
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3)
        g.addColorStop(0,p.color.replace(")",`,${p.a})`).replace("rgb","rgba"))
        g.addColorStop(1,"transparent")
        ctx.beginPath()
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=p.color
        ctx.globalAlpha=p.a
        ctx.fill()
        ctx.globalAlpha=1
      })

      // Shooting stars
      starTimer++
      if (starTimer > 80 && Math.random()<0.04) { spawnStar(); starTimer=0 }
      for (let i=stars.length-1;i>=0;i--) {
        const s=stars[i]
        s.life++
        s.x += Math.cos(s.angle)*s.speed
        s.y += Math.sin(s.angle)*s.speed
        s.a = Math.sin(Math.PI*s.life/s.maxLife)
        const ex=s.x-Math.cos(s.angle)*s.len
        const ey=s.y-Math.sin(s.angle)*s.len
        const sg=ctx.createLinearGradient(ex,ey,s.x,s.y)
        sg.addColorStop(0,"transparent")
        sg.addColorStop(1,`rgba(200,180,255,${s.a*0.9})`)
        ctx.beginPath(); ctx.moveTo(ex,ey); ctx.lineTo(s.x,s.y)
        ctx.strokeStyle=sg; ctx.lineWidth=1.5; ctx.stroke()
        if (s.life>=s.maxLife) stars.splice(i,1)
      }

      // Floating orbs
      for (let i=0;i<4;i++) {
        const ox = w*(0.15+i*0.23)+Math.sin(t*0.2+i*1.5)*60
        const oy = h*(0.25+i*0.18)+Math.cos(t*0.15+i*1.2)*50
        const or = 80+i*30
        const og = ctx.createRadialGradient(ox,oy,0,ox,oy,or)
        const oc = ["rgba(124,58,237","rgba(99,102,241","rgba(79,70,229","rgba(168,85,247"][i]
        og.addColorStop(0,`${oc},0.20)`)
        og.addColorStop(0.5,`${oc},0.08)`)
        og.addColorStop(1,"transparent")
        ctx.fillStyle=og; ctx.fillRect(0,0,w,h)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize) }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />
}

/* ── Static CSS decorations on top of canvas ─────────────────────────────── */
export function SignupBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <ParticleCanvas />

      {/* Floating code badges */}
      {[
        { t:"<Code/>",   x:"6%",  y:"18%", delay:"0s",   rot:"-8deg"  },
        { t:"{...}",     x:"87%", y:"22%", delay:"1.2s", rot:"6deg"   },
        { t:"→ match",   x:"4%",  y:"65%", delay:"2.4s", rot:"-5deg"  },
        { t:"# AI",      x:"88%", y:"60%", delay:"0.8s", rot:"10deg"  },
        { t:"git push",  x:"12%", y:"85%", delay:"3s",   rot:"-7deg"  },
        { t:"npm run",   x:"78%", y:"82%", delay:"1.8s", rot:"5deg"   },
        { t:"LeetCode",  x:"42%", y:"6%",  delay:"0.4s", rot:"-3deg"  },
        { t:"</>",       x:"70%", y:"10%", delay:"2s",   rot:"8deg"   },
      ].map((b,i)=>(
        <div key={i} style={{
          position:"absolute", left:b.x, top:b.y,
          transform:`rotate(${b.rot})`,
          animation:`badgeFloat 5s ease-in-out ${b.delay} infinite`,
          background:"rgba(139,92,246,0.08)",
          border:"1px solid rgba(139,92,246,0.2)",
          borderRadius:8,
          padding:"3px 8px",
          fontSize:11,
          fontFamily:"monospace",
          color:"rgba(167,139,250,0.6)",
          backdropFilter:"blur(4px)",
          whiteSpace:"nowrap",
        }}>{b.t}</div>
      ))}

      {/* Neon glow rings */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:900, height:900, borderRadius:"50%",
        border:"1px solid rgba(139,92,246,0.07)",
        boxShadow:"0 0 120px rgba(139,92,246,0.05)",
        animation:"ringRotate 30s linear infinite",
      }}/>
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:600, height:600, borderRadius:"50%",
        border:"1px solid rgba(99,102,241,0.09)",
        animation:"ringRotate 20s linear infinite reverse",
      }}/>
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:350, height:350, borderRadius:"50%",
        border:"1px solid rgba(168,85,247,0.12)",
        animation:"ringRotate 12s linear infinite",
      }}/>

      {/* Top glow bar */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:"linear-gradient(90deg,transparent 0%,rgba(124,58,237,0.8) 30%,rgba(99,102,241,1) 50%,rgba(124,58,237,0.8) 70%,transparent 100%)",
        boxShadow:"0 0 20px rgba(124,58,237,0.6), 0 0 60px rgba(124,58,237,0.3)",
      }}/>

      {/* Bottom fade */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:120,
        background:"linear-gradient(to bottom,transparent,rgba(2,2,8,0.4))"}}/>

      <style>{`
        @keyframes badgeFloat {
          0%,100%{transform:translateY(0) rotate(var(--r,0deg));}
          50%{transform:translateY(-10px) rotate(var(--r,0deg));}
        }
        @keyframes ringRotate {
          from{transform:translate(-50%,-50%) rotate(0deg);}
          to{transform:translate(-50%,-50%) rotate(360deg);}
        }
      `}</style>
    </div>
  )
}
