import { createFileRoute } from '@tanstack/react-router'
import GameBoard, { BaseCard } from '../../components/GameBoard'
import React from 'react'

const cardsInfo: BaseCard[] = [
  { id: 1, img: '', backgroundColor: '#FFFF00' },
  { id: 2, img: '', backgroundColor: '#0000FF' },
  { id: 3, img: '', backgroundColor: '#00C78C' },
  { id: 4, img: '', backgroundColor: '#FF0000' },
  { id: 5, img: '', backgroundColor: '#8E44AD' },
  { id: 6, img: '', backgroundColor: '#FFA500' },
]

const ColorMatch: React.FC = () => {
  return <GameBoard baseCards={cardsInfo.concat(cardsInfo)} />
}

export const Route = createFileRoute('/color/')({
  component: ColorMatch,
})
