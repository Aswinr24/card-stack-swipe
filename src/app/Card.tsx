// Card.tsx
import React from 'react'
import { motion } from 'framer-motion'

interface CardData {
  id: string
  title: string
  description: string
}

interface CardProps {
  card: CardData
}

const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <motion.div
      className="card bg-slate-100"
      layoutId={card.id} // Assign unique layout ID for Framer Motion
    >
      <h2>{card.title}</h2>
      <p>{card.description}</p>
    </motion.div>
  )
}

export default Card
