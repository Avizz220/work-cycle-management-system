'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Compass, Sparkles, ChevronRight } from 'lucide-react';

interface DG5SplashIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export default function DG5SplashIntro({ onComplete, forceShow = false }: DG5SplashIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing DG5 Core Engine...');

  useEffect(() => {
    // If not forced and already shown in this tab session, we can skip or allow instant check
    const hasShown = typeof window !== 'undefined' ? sessionStorage.getItem('dg5_splash_seen') : null;
    if (hasShown && !forceShow) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Progress animation sequence
    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds total for cinematic feel

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 30) {
        setStatusText('Calibrating Architectural CAD Grid...');
      } else if (pct < 60) {
        setStatusText('Connecting Multidiscipline Systems (MEP, Civil, Arch)...');
      } else if (pct < 85) {
        setStatusText('Synchronizing Real-Time Drawing Deliverables...');
      } else if (pct < 100) {
        setStatusText('Securing Enterprise Access Environment...');
      } else {
        setStatusText('Workspace Ready. Welcome to DG5.');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('dg5_splash_seen', 'true');
        }
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 600);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [forceShow, onComplete]);

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dg5_splash_seen', 'true');
    }
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#090d16',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s ease',
        overflow: 'hidden',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      {/* Background Architectural Grid & Subtle Radial Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 45%, rgba(14, 165, 233, 0.15) 0%, rgba(99, 102, 241, 0.08) 35%, transparent 70%),
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          opacity: 0.85,
        }}
      />

      {/* Rotating Blueprint Technical Compass Rings */}
      <div
        style={{
          position: 'absolute',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          border: '1px dashed rgba(56, 189, 248, 0.2)',
          animation: 'dg5SpinClockwise 35s linear infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '680px',
          height: '680px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          animation: 'dg5SpinCounterClockwise 50s linear infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Corner Technical CAD Coordinates */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          left: '32px',
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          color: 'rgba(148, 163, 184, 0.6)',
          letterSpacing: '0.12em',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <span>PROJECT: DG5-ENTERPRISE-SYS</span>
        <span>LAT: 06°55&apos;55&quot;N • LON: 79°51&apos;52&quot;E</span>
        <span style={{ color: '#38bdf8' }}>STATUS: CORE ENGINE INITIALIZING</span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '28px',
          right: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={handleSkip}
          type="button"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#cbd5e1',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          <span>Skip Intro</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Center Cinematic Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '540px',
          padding: '0 24px',
          zIndex: 10,
        }}
      >
        {/* Glow Aura behind Logo */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            width: '260px',
            height: '140px',
            background: 'radial-gradient(ellipse, rgba(14, 165, 233, 0.35) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
        />

        {/* Animated Logo Container with Laser Scan Beam */}
        <div
          style={{
            position: 'relative',
            padding: '24px 38px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '24px',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.3)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            marginBottom: '28px',
            overflow: 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'dg5LogoPulse 2.8s ease-in-out infinite alternate',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/resources/Main-LOGO.png"
            alt="DG 5 The Design Group Five International"
            style={{
              height: '74px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
              position: 'relative',
              zIndex: 2,
            }}
          />

          {/* High-Tech Blueprint Laser Scanline Effect */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.9), #38bdf8, transparent)',
              boxShadow: '0 0 15px #38bdf8, 0 0 30px rgba(56, 189, 248, 0.8)',
              animation: 'dg5Scanline 2.2s ease-in-out infinite',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Brand Titles with Staggered Entrance */}
        <div style={{ marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={12} />
            <span>ESTABLISHED 1972 • 50+ YEARS EXCELLENCE</span>
          </div>

          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: '0 0 8px 0',
              lineHeight: 1.25,
            }}
          >
            The Design Group Five International
          </h1>

          <p
            style={{
              fontSize: '0.92rem',
              color: '#94a3b8',
              margin: 0,
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            Enterprise Multidisciplinary Work & Engineering Management System
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
            }}
          >
            <span style={{ color: '#38bdf8', fontWeight: 600, letterSpacing: '0.02em' }}>
              {statusText}
            </span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{progress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div
            style={{
              width: '100%',
              height: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0284c7, #38bdf8, #818cf8)',
                borderRadius: '999px',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.8)',
                transition: 'width 0.08s linear',
              }}
            />
          </div>
        </div>

        {/* Bottom Security / Architecture Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginTop: '28px',
            color: 'rgba(148, 163, 184, 0.7)',
            fontSize: '0.74rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Compass size={13} style={{ color: '#38bdf8' }} /> Architectural & Engineering Core
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={13} style={{ color: '#10b981' }} /> AES-256 Verified Security
          </span>
        </div>
      </div>

      {/* Global CSS animations for Splash */}
      <style jsx global>{`
        @keyframes dg5Scanline {
          0% {
            top: -10%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0;
          }
        }
        @keyframes dg5LogoPulse {
          0% {
            transform: scale(0.98);
            box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.2);
          }
          100% {
            transform: scale(1.02);
            box-shadow: 0 28px 70px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.45);
          }
        }
        @keyframes dg5SpinClockwise {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes dg5SpinCounterClockwise {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}
