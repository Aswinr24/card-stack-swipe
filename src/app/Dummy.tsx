'use client'
import React, { useState, useRef, useEffect } from 'react'
import Card from './Card' // Import the Card component
import cardsData from './cards.json' // Import the card data file
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion'

interface CardDeckProps {} // No need for props if using imported data

const Dummy: React.FC<CardDeckProps> = () => {
  const cards = cardsData // Use the imported data
  const scrollY = useMotionValue(0) // Create a MotionValue for scroll position

  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY)
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollY]) // Add scrollY as dependency to rerun on scroll changes

  // ... rest of the component logic

  const cardVariants = {
    // ... same card variants as before
  }

  return (
    <div className="card-deck">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            // ... same props and variants as before
            style={{
              transform: `translateX(${useSpring(
                scrollY.get() * -0.1
              ).get()}px)`,
            }} // Apply scroll-based transform, using get()
          >
            <Card card={card} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Dummy
