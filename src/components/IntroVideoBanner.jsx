import { useEffect, useRef } from 'react'
import introVideo from '../assets/video/chaoqian-intro.mp4'
import introPoster from '../assets/video/chaoqian-intro-poster.jpg'

const ENTRY_DELAY = 1500
const SCROLL_DURATION = 2000

const easeInOutCubic = (progress) => (
  progress < 0.5
    ? 4 * progress ** 3
    : 1 - ((-2 * progress + 2) ** 3) / 2
)

export default function IntroVideoBanner({ targetRef, onReveal }) {
  const videoRef = useRef(null)
  const waitTimerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const hasStartedRef = useRef(false)

  useEffect(() => () => {
    window.clearTimeout(waitTimerRef.current)
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const startEntry = () => {
    if (hasStartedRef.current || !targetRef.current) return

    hasStartedRef.current = true
    window.clearTimeout(waitTimerRef.current)
    onReveal()

    const startY = window.scrollY
    const targetY = startY + targetRef.current.getBoundingClientRect().top
    let startTime = null

    const step = (time) => {
      if (startTime === null) startTime = time

      const progress = Math.min((time - startTime) / SCROLL_DURATION, 1)
      const nextY = startY + (targetY - startY) * easeInOutCubic(progress)
      window.scrollTo(0, nextY)

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(step)
      }
    }

    animationFrameRef.current = window.requestAnimationFrame(step)
  }

  const handleEnded = () => {
    if (hasStartedRef.current) return
    window.clearTimeout(waitTimerRef.current)
    waitTimerRef.current = window.setTimeout(startEntry, ENTRY_DELAY)
  }

  const handleSkip = () => {
    videoRef.current?.pause()
    startEntry()
  }

  return (
    <section className="intro-video-banner" aria-label="潮嵌守艺视频序章区域">
      <video
        ref={videoRef}
        aria-label="潮嵌守艺视频序章"
        autoPlay
        muted
        playsInline
        poster={introPoster}
        src={introVideo}
        onEnded={handleEnded}
      />
      <button
        type="button"
        className="intro-video-banner__skip"
        onClick={handleSkip}
      >
        跳过序章
      </button>
    </section>
  )
}
