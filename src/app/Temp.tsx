'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import _ from 'lodash'
import { CSSProperties } from 'react'
import axios from 'axios'
import { Work_Sans, Changa_One } from 'next/font/google'

const work_sans = Work_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-work_sans',
})

const changa_one = Changa_One({
  weight: '400',
  subsets: ['latin'],
})

interface Card {
  title: string
  description: string
  primary_color: string
  secondary_color: string
}

const INDEX = [1, 2, 3, 4, 5]
const CARD_OFFSET = 10
const SCALE_FACTOR = 0.06

const Temp = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [titles, setTitles] = useState<string[]>([])
  const [descriptions, setDescriptions] = useState<string[]>([])
  const [primaryColors, setPrimaryColors] = useState<string[]>([])
  const [secondaryColors, setSecondaryColors] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Card[]>(
          'http://localhost:5050/card/data'
        )
        const responseData = response.data

        responseData.forEach((card) => {
          setTitles((prevTitles) => [...prevTitles, card.title])
          setDescriptions((prevDescriptions) => [
            ...prevDescriptions,
            card.description,
          ])
          setPrimaryColors((prevPrimaryColors) => [
            ...prevPrimaryColors,
            card.primary_color,
          ])
          setSecondaryColors((prevSecondaryColors) => [
            ...prevSecondaryColors,
            card.secondary_color,
          ])
        })
        setIsLoading(false)
        console.log('data recieved')
      } catch (error) {
        setIsLoading(false)
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const cardStyle: CSSProperties = {
    position: 'absolute',
    width: '240px',
    height: '320px',
    borderRadius: '16px',
    transformOrigin: 'top center',
    listStyle: 'none',
  }

  function moveToEnd<T>(array: T[], from: number) {
    const newArray = [...array]
    const movedElement = newArray.splice(from, 1)[0]
    newArray.push(movedElement)
    return newArray
  }

  const [cards, setCards] = useState(INDEX)

  const handleDragEnd = (index: number) => {
    const newCards = moveToEnd(cards, index)
    const newTitles = moveToEnd(titles, index)
    const newDesc = moveToEnd(descriptions, index)
    const newPcol = moveToEnd(primaryColors, index)
    const newScol = moveToEnd(secondaryColors, index)
    setCards(newCards)
    setTitles(newTitles)
    setDescriptions(newDesc)
    setPrimaryColors(newPcol)
    setSecondaryColors(newScol)
  }

  const getTextColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 125 ? '#1A1A1A' : '#FFFFFF'
  }

  return (
    <div className="flex justify-center items-center pr-20 mr-40 px-50">
      {!isLoading ? (
        <ul
          className="relative"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        >
          {cards.map((color, index) => {
            const canDrag = index === 0

            return (
              <motion.li
                key={color}
                className="absolute"
                style={{
                  ...cardStyle,
                  backgroundColor: primaryColors[index],
                  cursor: canDrag ? 'grab' : 'auto',
                  height: '320px',
                  width: '240px',
                  border: '3px solid black',
                }}
                animate={{
                  top: index * CARD_OFFSET,
                  scale: 1 - index * SCALE_FACTOR,
                  zIndex: INDEX.length - index,
                  transformOrigin: 'top right',
                  rotate: index > 0 ? -2 - index * 1.5 : 0,
                }}
                drag={canDrag ? 'x' : false}
                dragConstraints={
                  canDrag ? { top: 0, bottom: 0, left: 0, right: 0 } : false
                }
                dragElastic={1}
                dragMomentum={false}
                onDragEnd={(event, info) => {
                  if (info.offset.x < 0) {
                    handleDragEnd(index)
                  }
                }}
              >
                <div className="relative w-full h-full overflow-hidden border-8 border-yellow-100 rounded-xl">
                  <div
                    className={`${changa_one.className} border-b-8 border-yellow-100`}
                  >
                    <div
                      className="py-2 px-3 h-full w-full border-t-7 border-b-7 border-black border-2 text-2xl"
                      style={{ color: getTextColor(primaryColors[index]) }}
                    >
                      {titles[index]}
                    </div>
                  </div>
                  <div className="h-[calc(100%-59px)] overflow-y-auto">
                    <div
                      className={`${work_sans.className} p-4 h-full w-full border-t-6 border-b-6 border-black border-2 font-custom text-md font-semibold`}
                      style={{
                        backgroundColor: secondaryColors[index],
                        color: getTextColor(secondaryColors[index]),
                      }}
                    >
                      {descriptions[index]}
                    </div>
                    <div className="bottom-right flex items-center space-x-1 absolute right-0 bottom-0 p-2">
                      <div className="circle w-3 h-3 bg-yellow-100 rounded-full"></div>
                      <div className="cube w-3 h-3 bg-yellow-100"></div>
                    </div>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default Temp
