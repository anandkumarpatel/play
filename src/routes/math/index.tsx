import { createFileRoute } from '@tanstack/react-router'
import GameBoard, { BaseCard } from '../../components/GameBoard'
import React from 'react'

const answersMap: Record<number, string[]> = generateAnswerMap()

const MathMatch: React.FC = () => {
  const cardsInfo: BaseCard[] = []
  const picked = new Set()
  for (let i = 0; i < 6; i++) {
    const options = Object.keys(answersMap)
    const selected = parseInt(options[Math.floor(Math.random() * options.length)])
    if (picked.has(selected)) continue
    picked.add(selected)
    // pick two distinct and random options from selected
    const [option1, option2] = answersMap[selected].sort(() => Math.random() - 0.5).slice(0, 2)
    cardsInfo.push({ id: i, img: option1, backgroundColor: 'yellow', fontSize: 10 })
    cardsInfo.push({ id: i, img: option2, backgroundColor: 'yellow', fontSize: 10 })
  }

  return <GameBoard baseCards={cardsInfo} faceUp={true} />
}

function generateAnswerMap() {
  const answersMap: Record<number, string[]> = {}
  for (let i = 1; i < 10; i++) {
    for (let j = 1; j < 10; j++) {
      for (const op of ['+', '-', '*', '/']) {
        let ans = 0
        switch (op) {
          case '+':
            ans = i + j
            break
          case '-':
            ans = i - j
            break
          case '*':
            ans = i * j
            break
          case '/':
            ans = i / j
            if (!Number.isInteger(ans)) ans = 0
            break
        }
        if (!ans) continue
        if (!answersMap[ans]) answersMap[ans] = []
        answersMap[ans].push(`${i} ${op} ${j}`)
      }
    }
  }
  for (const key in answersMap) {
    if (answersMap[key].length < 2) delete answersMap[key]
  }
  return answersMap
}
export const Route = createFileRoute('/math/')({
  component: MathMatch,
})
