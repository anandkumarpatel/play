import { SimpleGrid } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import FlipCard from './Card'

export type BaseCard = {
  id: number
  img: string
  backgroundColor: string
  fontSize?: number
}

type Card = {
  isMatched: boolean
} & BaseCard

type GameBoardProps = {
  baseCards: BaseCard[]
  faceUp?: boolean
}
const GameBoard: React.FC<GameBoardProps> = ({ baseCards, faceUp = false }) => {
  const navigate = useNavigate()

  const newCards: Card[] = baseCards
    .sort(() => Math.random() - 0.5)
    .map((cardInfo) => ({
      ...cardInfo,
      isMatched: false,
    }))
  const [cards, setCards] = useState<Card[]>(newCards)
  const [selectedCard1Index, setSelectedCard1] = useState<number | null>(null)
  const [selectedCard2Index, setSelectedCard2] = useState<number | null>(null)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

  const handleCardPress = (index: number) => {
    if (!isGameStarted) return
    const isPaused = selectedCard1Index !== null && selectedCard2Index !== null
    if (isPaused) return
    if (index === selectedCard1Index) return
    if (cards[index].isMatched) return

    if (selectedCard1Index === null) {
      setSelectedCard1(index)
    } else {
      checkForMatch(index)
    }
  }

  const checkForMatch = (selectedCard2Index: number) => {
    const selectedCard1 = selectedCard1Index !== null ? cards[selectedCard1Index] : null
    const selectedCard2 = selectedCard2Index !== null ? cards[selectedCard2Index] : null
    if (selectedCard1Index === null) return
    const didMatch = selectedCard1!.id === selectedCard2!.id
    const timeout = 1200
    setTimeout(() => {
      if (didMatch) {
        const updatedCards = [...cards]
        updatedCards[selectedCard1Index].isMatched = true
        updatedCards[selectedCard2Index].isMatched = true
        setCards(updatedCards)
      }
      setSelectedCard1(null)
      setSelectedCard2(null)
    }, timeout)

    setSelectedCard2(selectedCard2Index)
  }

  const isGameComplete = cards.every((card) => card.isMatched)
  useEffect(() => {
    if (isGameComplete) {
      setTimeout(() => {
        navigate({ to: '/win' })
      }, 1000)
    }
  }, [isGameComplete, navigate])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGameStarted(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <SimpleGrid cols={3} h='100%' p='xs'>
      {cards.map((card, index) => (
        <FlipCard
          fontSize={card.fontSize}
          color={card.backgroundColor}
          key={index}
          img={card.img}
          onPress={() => handleCardPress(index)}
          isMatched={card.isMatched}
          faceUp={faceUp}
          isFlipped={isGameStarted ? selectedCard1Index === index || selectedCard2Index === index : true}
        />
      ))}
    </SimpleGrid>
  )
}

export default GameBoard
