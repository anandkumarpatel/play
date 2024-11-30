import { createFileRoute } from '@tanstack/react-router'
import GameBoard, { BaseCard } from '../../components/GameBoard'
import React from 'react'

const cardsInfo: BaseCard[] = [
  { id: 1, img: '1', backgroundColor: '#white' },
  { id: 2, img: '2', backgroundColor: '#white' },
  { id: 3, img: '3', backgroundColor: '#white' },
  { id: 4, img: '4', backgroundColor: '#white' },
  { id: 5, img: '5', backgroundColor: '#white' },
  { id: 6, img: '6', backgroundColor: '#white' },
]

const NumberMatch: React.FC = () => {
  return <GameBoard baseCards={cardsInfo.concat(cardsInfo)} />
}

export const Route = createFileRoute('/number/')({
  component: NumberMatch,
})
