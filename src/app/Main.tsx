'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'
interface DataObject {
  title: string
  description: string
  primary_color: string
  secondary_color: string
}

const Main: React.FC = () => {
  const [data, setData] = useState<DataObject[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataObject[]>(
          'http://localhost:5050/card/data'
        )
        const responseData: DataObject[] = response.data
        setData(responseData)
        console.log(responseData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [pcol, setPcol] = useState('')
  const [scol, setScol] = useState('')

  const Title: string[] = []
  const Desc: string[] = []
  const Pcol: string[] = []
  const Scol: string[] = []
  return (
    <>
      <div>
        <h1>Data from Backend</h1>
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <div>Title: {item.title}</div>
              <div>Description: {item.description}</div>
              <div>Primary Color: {item.primary_color}</div>
              <div>Secondary Color: {item.secondary_color}</div>
              {Title.push(item.title)}
              {Desc.push(item.description)}
              {Pcol.push(item.primary_color)}
              {Scol.push(item.secondary_color)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          onSwiper={(swiper) => console.log(swiper, Pcol)}
          onSlideChange={() => console.log('slide change', Pcol)}
          className="text-lg w-[240px] h-[320px]"
        >
          {Title.map((item) => {
            return (
              <SwiperSlide className="flex items-center justify-center rounded-[18px] bg-slate-100">
                {item}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </>
  )
}

export default Main
