'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-mesh"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background floating geometric shapes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <circle
          cx="160"
          cy="160"
          r="75"
          stroke="var(--brand-primary)"
          strokeWidth="1.5"
          opacity="0.4"
          className="animate-shape-float-slow"
        />
        <polygon
          points="1060,120 1110,210 1010,210"
          stroke="var(--brand-accent)"
          strokeWidth="1.5"
          opacity="0.45"
          className="animate-shape-float-fast"
        />
        <polygon
          points="1080,560 1110,578 1110,614 1080,632 1050,614 1050,578"
          stroke="var(--brand-secondary)"
          strokeWidth="1.5"
          opacity="0.4"
          className="animate-shape-spin-slow"
        />
        <circle
          cx="150"
          cy="600"
          r="50"
          stroke="var(--brand-primary)"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          opacity="0.35"
          className="animate-shape-spin-slow"
        />
        <g className="animate-shape-float-fast" opacity="0.5">
          <line x1="250" y1="330" x2="250" y2="356" stroke="var(--brand-accent)" strokeWidth="2" />
          <line x1="237" y1="343" x2="263" y2="343" stroke="var(--brand-accent)" strokeWidth="2" />
        </g>
        <g className="animate-shape-float-slow" opacity="0.6">
          <circle cx="1000" cy="380" r="5" fill="var(--brand-secondary)" />
          <circle cx="1030" cy="400" r="3.5" fill="var(--brand-accent)" />
          <circle cx="975" cy="405" r="3" fill="var(--brand-primary)" />
        </g>
        <rect
          x="920"
          y="640"
          width="30"
          height="30"
          stroke="var(--brand-primary)"
          strokeWidth="1.5"
          opacity="0.4"
          transform="rotate(15 935 655)"
          className="animate-shape-float-fast"
        />
        <line
          x1="80"
          y1="650"
          x2="220"
          y2="560"
          stroke="var(--brand-accent)"
          strokeWidth="1.5"
          opacity="0.3"
          className="animate-shape-float-slow"
        />
      </svg>

      {/* 404 number illustration */}
      <div className="relative w-full max-w-[580px] mb-4 select-none">
        <svg
          viewBox="0 0 900 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            <linearGradient id="numGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-primary)" />
              <stop offset="100%" stopColor="var(--brand-secondary)" />
            </linearGradient>
          </defs>

          {/* First "4" */}
          <g transform="translate(0, 5)">
            <path
              d="M150 0 L20 180 L150 180 Z M150 210 L0 210 L0 180 L150 0 L200 0 L200 180 L240 180 L240 210 L200 210 L200 290 L150 290 Z"
              fill="url(#numGrad)"
              fillRule="evenodd"
            />
            <circle
              cx="205"
              cy="70"
              r="10"
              stroke="var(--brand-accent)"
              strokeWidth="2"
              opacity="0.6"
              className="animate-shape-spin-slow"
            />
            <circle cx="60" cy="235" r="5" fill="var(--brand-accent)" opacity="0.5" className="animate-shape-float-fast" />
          </g>

          {/* Middle "0" */}
          <g transform="translate(330, 5)">
            <circle
              cx="150"
              cy="145"
              r="117.5"
              stroke="url(#numGrad)"
              strokeWidth="55"
              fill="none"
            />
            {/* 3 slow-moving geometric accents inside the hollow center */}
            <circle
              cx="150"
              cy="105"
              r="6"
              fill="var(--brand-accent)"
              opacity="0.55"
              className="animate-shape-float-slow"
            />
            <polygon
              points="185,155 195,172 175,172"
              stroke="var(--brand-primary)"
              strokeWidth="1.8"
              opacity="0.5"
              className="animate-shape-float-fast"
            />
            <rect
              x="118"
              y="165"
              width="14"
              height="14"
              stroke="var(--brand-secondary)"
              strokeWidth="1.8"
              opacity="0.5"
              transform="rotate(12 125 172)"
              className="animate-shape-spin-slow"
            />
          </g>

          {/* Second "4" */}
          <g transform="translate(660, 5)">
            <path
              d="M150 0 L20 180 L150 180 Z M150 210 L0 210 L0 180 L150 0 L200 0 L200 180 L240 180 L240 210 L200 210 L200 290 L150 290 Z"
              fill="url(#numGrad)"
              fillRule="evenodd"
            />
            <polygon
              points="35,50 50,58 35,66 20,58"
              fill="var(--brand-accent)"
              opacity="0.55"
              className="animate-shape-float-slow"
            />
            <circle cx="215" cy="230" r="5" fill="var(--brand-secondary)" opacity="0.5" className="animate-shape-float-fast" />
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h1
          className="text-2xl md:text-3xl font-heading font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Page Not Found
        </h1>
        <p className="mb-10 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all duration-250 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--brand-primary) 30%, transparent)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              '0 10px 30px color-mix(in srgb, var(--brand-primary) 45%, transparent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              '0 4px 16px color-mix(in srgb, var(--brand-primary) 30%, transparent)'
          }}
        >
          <ArrowLeft
            size={17}
            strokeWidth={1.9}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Return Home
        </Link>
      </div>

      <style>{`
        @keyframes shapeFloatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shapeFloatFast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes shapeSpinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shape-float-slow {
          animation: shapeFloatSlow 5s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-shape-float-fast {
          animation: shapeFloatFast 3.5s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-shape-spin-slow {
          animation: shapeSpinSlow 18s linear infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  )
}