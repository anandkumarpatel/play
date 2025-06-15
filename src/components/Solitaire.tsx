import React, { useState, useEffect, useRef } from 'react'

const suits = ['♥', '♦', '♣', '♠'] as const
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const
const rankValues: Record<string, number> = { A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13 }

type Suit = (typeof suits)[number]
type Rank = (typeof ranks)[number]

interface Card {
  suit: Suit
  rank: Rank
  faceUp: boolean
  id: string
}

interface SelectedCard {
  card: Card
  source: 'waste' | 'foundation' | 'tableau'
  pileIndex: number
  cardIndex: number
}

type Foundation = Card[]
type Tableau = Card[]

function createDeck(): Card[] {
  return suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank, faceUp: false, id: `${rank}${suit}` })))
}

const easyWin = true
function shuffle(deck: Card[]): Card[] {
  if (easyWin) return deck
  const arr = [...deck]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const getCardColor = (suit: Suit) => (suit === '♥' || suit === '♦' ? 'red' : 'black')

const Solitaire: React.FC = () => {
  // State
  const [stock, setStock] = useState<Card[]>([])
  const [waste, setWaste] = useState<Card[]>([])
  const [foundations, setFoundations] = useState<Foundation[]>([[], [], [], []])
  const [tableau, setTableau] = useState<Tableau[]>([[], [], [], [], [], [], []])
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)

  // For responsive card sizing
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Set card size on mount and resize
  useEffect(() => {
    function setCardSize() {
      const gameContainer = containerRef.current
      if (!gameContainer) return
      const availableWidth = gameContainer.clientWidth
      const gap = Math.max(4, Math.floor(availableWidth / 100))
      const cardWidth = Math.floor((availableWidth - gap * 8) / 7)
      const cardHeight = Math.floor(cardWidth * 1.4)
      const fontSizeCorner = Math.max(16, Math.floor(cardWidth * 0.5))
      const fontSizeCornerSuit = Math.max(16, Math.floor(cardWidth * 0.3))
      const cardOverlap = -Math.floor(cardHeight - (fontSizeCorner + 4))
      const root = document.documentElement
      root.style.setProperty('--card-width', `${cardWidth}px`)
      root.style.setProperty('--card-height', `${cardHeight}px`)
      root.style.setProperty('--font-size-corner', `${fontSizeCorner}px`)
      root.style.setProperty('--font-size-corner-suit', `${fontSizeCornerSuit}px`)
      root.style.setProperty('--card-overlap', `${cardOverlap}px`)
      root.style.setProperty('--gap', `${gap}px`)
    }
    setCardSize()
    window.addEventListener('resize', setCardSize)
    return () => window.removeEventListener('resize', setCardSize)
  }, [])

  // Start a new game
  const startGame = () => {
    const deck = shuffle(createDeck())
    const tableauInit: Tableau[] = [[], [], [], [], [], [], []]
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = deck.pop()!
        if (i === j) card.faceUp = true
        tableauInit[j].push(card)
      }
    }
    setStock(deck)
    setWaste([])
    setFoundations([[], [], [], []])
    setTableau(tableauInit)
    setSelectedCard(null)
    setShowMessage(false)
    setMessage('')
  }

  // On mount, start game
  useEffect(() => {
    startGame()
  }, [])

  // Card click handler
  const onCardClick = (card: Card, source: 'stock' | 'waste' | 'foundation' | 'tableau', pileIndex: number | null, cardIndex: number | null) => {
    if (source === 'stock') {
      drawFromStock()
      return
    }
    if (!card.faceUp) return

    // Auto-move to foundation if possible
    if (source === 'waste' || (source === 'tableau' && !selectedCard)) {
      for (let i = 0; i < 4; i++) {
        if (isValidFoundationMove(card, i)) {
          // Move this card to foundation
          if (source === 'waste') {
            moveCards('waste', 0, waste.length - 1, 'foundation', i, 1)
          } else if (source === 'tableau' && pileIndex !== null && cardIndex !== null && cardIndex === tableau[pileIndex].length - 1) {
            moveCards('tableau', pileIndex, cardIndex, 'foundation', i, 1)
          }
          return
        }
      }
    }

    if (!selectedCard) {
      selectCard(card, source as 'waste' | 'foundation' | 'tableau', pileIndex ?? 0, cardIndex ?? 0)
    } else {
      if (selectedCard.card.id === card.id) {
        deselectCard()
      } else {
        // Try to move selected card to this card's pile if valid
        if (source === 'tableau' && isValidTableauMove(selectedCard.card, card)) {
          moveSelectedCard('tableau', pileIndex ?? 0)
        } else {
          deselectCard()
          selectCard(card, source as 'waste' | 'foundation' | 'tableau', pileIndex ?? 0, cardIndex ?? 0)
        }
      }
    }
  }

  // Pile click handler (for empty piles)
  const onPileClick = (pileType: 'foundation' | 'tableau', pileIndex: number) => {
    if (!selectedCard) return
    moveSelectedCard(pileType, pileIndex)
  }

  // Select card
  const selectCard = (card: Card, source: 'waste' | 'foundation' | 'tableau', pileIndex: number, cardIndex: number) => {
    setSelectedCard({ card, source, pileIndex, cardIndex })
    // If top card, try auto-move to foundation
    const isTopCard = source === 'waste' || source === 'foundation' || (source === 'tableau' && cardIndex === tableau[pileIndex].length - 1)
    if (isTopCard && source !== 'foundation') {
      for (let i = 0; i < 4; i++) {
        if (isValidFoundationMove(card, i)) {
          moveSelectedCard('foundation', i)
          return
        }
      }
    }
  }

  // Deselect card
  const deselectCard = () => setSelectedCard(null)

  // Move selected card to target pile
  const moveSelectedCard = (targetSource: 'foundation' | 'tableau', targetPileIndex: number) => {
    if (!selectedCard) return
    const { card, source, pileIndex, cardIndex } = selectedCard
    if (targetSource === 'foundation') {
      if (isValidFoundationMove(card, targetPileIndex)) {
        moveCards(source, pileIndex, cardIndex, 'foundation', targetPileIndex, 1)
      }
    } else if (targetSource === 'tableau') {
      const targetPile = tableau[targetPileIndex]
      const topCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null
      if (isValidTableauMove(card, topCard)) {
        const numCardsToMove = source === 'tableau' ? tableau[pileIndex].length - cardIndex : 1
        moveCards(source, pileIndex, cardIndex, 'tableau', targetPileIndex, numCardsToMove)
      }
    }
    deselectCard()
  }

  // Move cards between piles
  const moveCards = (fromSource: 'waste' | 'foundation' | 'tableau', fromPile: number, fromIndex: number, toSource: 'foundation' | 'tableau', toPile: number, numCards: number) => {
    const newStock = [...stock]
    const newWaste = [...waste]
    const newFoundations = foundations.map((pile) => [...pile])
    const newTableau = tableau.map((pile) => [...pile])
    let cardsToMove: Card[] = []
    if (fromSource === 'waste') cardsToMove = [newWaste.pop()!]
    else if (fromSource === 'foundation') cardsToMove = [newFoundations[fromPile].pop()!]
    else if (fromSource === 'tableau') {
      cardsToMove = newTableau[fromPile].splice(fromIndex, numCards)
      if (newTableau[fromPile].length > 0) {
        newTableau[fromPile][newTableau[fromPile].length - 1].faceUp = true
      }
    }
    if (toSource === 'foundation') newFoundations[toPile].push(...cardsToMove)
    else if (toSource === 'tableau') newTableau[toPile].push(...cardsToMove)
    setStock(newStock)
    setWaste(newWaste)
    setFoundations(newFoundations)
    setTableau(newTableau)
    checkWinCondition()
  }

  // Foundation move validation
  const isValidFoundationMove = (card: Card, foundationIndex: number) => {
    if (!card) return false
    if (selectedCard && selectedCard.source === 'tableau' && selectedCard.cardIndex !== tableau[selectedCard.pileIndex].length - 1) return false
    const foundationPile = foundations[foundationIndex]
    if (foundationPile.length === 0) return card.rank === 'A'
    const topCard = foundationPile[foundationPile.length - 1]
    return card.suit === topCard.suit && rankValues[card.rank] === rankValues[topCard.rank] + 1
  }

  // Tableau move validation
  const isValidTableauMove = (card: Card, topCard: Card | null) => {
    if (!card) return false
    if (!topCard) return card.rank === 'K'
    const cardColor = getCardColor(card.suit)
    const topCardColor = getCardColor(topCard.suit)
    if (cardColor === topCardColor) return false
    return rankValues[card.rank] === rankValues[topCard.rank] - 1
  }

  // Draw from stock
  const drawFromStock = () => {
    if (stock.length > 0) {
      const newStock = [...stock]
      const newWaste = [...waste]
      const card = newStock.pop()!
      card.faceUp = true
      newWaste.push(card)
      setStock(newStock)
      setWaste(newWaste)
      deselectCard()
    } else if (waste.length > 0) {
      // Recycle waste to stock (classic Solitaire behavior)
      const newStock = waste
        .slice()
        .reverse()
        .map((c) => ({ ...c, faceUp: false }))
      setStock(newStock)
      setWaste([])
      deselectCard()
    }
  }

  // Win condition
  const checkWinCondition = () => {
    if (foundations.reduce((sum, pile) => sum + pile.length, 0) === 51) {
      setMessage('You Win!')
      setShowMessage(true)
    }
  }

  // Render card
  const renderCard = (card: Card, source: 'stock' | 'waste' | 'foundation' | 'tableau', pileIndex?: number | null, cardIndex?: number | null) => {
    const isSelected = selectedCard && selectedCard.card.id === card.id
    let classNames = 'card'
    if (card.faceUp) classNames += ' ' + getCardColor(card.suit)
    if (!card.faceUp) classNames += ' face-down'
    if (isSelected) classNames += ' selected'
    return (
      <div
        key={card.id}
        id={card.id}
        className={classNames}
        onClick={(e) => {
          e.stopPropagation()
          onCardClick(card, source, pileIndex ?? null, cardIndex ?? null)
        }}
        tabIndex={card.faceUp ? 0 : -1}
        aria-label={card.faceUp ? `${card.rank} of ${card.suit}` : 'Face down card'}
      >
        {card.faceUp && (
          <div className='card-corner-info card-flex-row'>
            <span className='card-rank'>{card.rank}</span>
            <span className='card-suit'>{card.suit}</span>
          </div>
        )}
      </div>
    )
  }

  // Render
  return (
    <>
      <style>{`
        :root {
            --card-width: 80px;
            --card-height: 112px;
            --card-border-radius: 6px;
            --font-size-corner: 20px;
            --gap: 5px;
            --card-overlap: -95px;
        }
        html, body {
            height: 100%;
            overflow: hidden;
        }
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #0a4d0a;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: var(--gap);
            box-sizing: border-box;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
        }
        .game-container {
            width: 95vw;
            max-width: 800px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .top-area {
            display: flex;
            justify-content: space-between;
            gap: var(--gap);
            margin-bottom: 10px;
            flex-shrink: 0;
        }
        .foundation-piles, .stock-waste-piles {
            display: flex;
            gap: var(--gap);
        }
        .tableau {
            flex-grow: 1;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: var(--gap);
            overflow-y: auto;
            padding-bottom: 15px;
        }
        .pile {
            position: relative;
            width: var(--card-width);
            height: var(--card-height);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: var(--card-border-radius);
            flex-shrink: 0;
        }
        .stock-waste-piles .pile {
            border: none;
        }
        .stock-waste-piles .pile.empty {
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .tableau-pile {
            width: 100%;
            height: auto;
            min-height: var(--card-height);
        }
        .pile-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.25);
            font-size: calc(var(--card-height) * 0.7);
            font-weight: bold;
            line-height: 1;
        }
        .card {
            width: 100%;
            height: var(--card-height);
            border-radius: var(--card-border-radius);
            background-color: #fefefe;
            border: 1px solid #ccc;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.2s;
            box-sizing: border-box;
            color: #000;
            position: relative;
            font-weight: bold;
        }
        .pile .card {
            position: absolute;
            top: 0;
            left: 0;
        }
        .card-corner-info {
            display: flex;
            justify-content: space-evenly;
            font-size: var(--font-size-corner);
        }
        .card-corner-info span {
            // flex: 1 1 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-width: 0;
            overflow: hidden;
        }
        .card-rank {
            justify-content: flex-start;
        }
        .card-suit {
            justify-content: flex-end;
            font-size: var(--font-size-corner-suit);
        }
        .tableau-pile .card:not(:first-child) {
            margin-top: var(--card-overlap);
        }
        .card.face-down {
            background-color: #2659a1;
            background-image:
                linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255,255,255,0.15) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.15) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.15) 75%);
            background-size: 20px 20px;
            border: 2px solid #fff;
        }
        .card.face-down > div {
             visibility: hidden;
        }
        .card.red { color: #d90000; }
        .card.black { color: #000; }
        .card.selected {
            transform: scale(1.05);
            box-shadow: 0 0 15px 5px #fffa00;
            z-index: 100;
        }
        .empty-pile-symbol { font-size: 1em; }
        #message-box {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.85);
            color: white; padding: 30px 40px;
            border-radius: 15px; text-align: center;
            z-index: 200; font-size: 24px;
            border: 3px solid #fff; display: none;
        }
        #message-box.show { display: block; }
        #message-box button { margin-top: 20px; }
      `}</style>
      <div className='game-container' ref={containerRef}>
        <div className='top-area'>
          <div className='foundation-piles'>
            {foundations.map((pile, i) => (
              <div key={i} className='pile foundation-pile' id={`foundation-${i}`} data-index={i} onClick={() => onPileClick('foundation', i)}>
                {pile.length > 0 ? renderCard(pile[pile.length - 1], 'foundation', i, pile.length - 1) : <div className='pile-placeholder'>A</div>}
              </div>
            ))}
          </div>
          <div className='stock-waste-piles'>
            <div id='waste' className={`pile${waste.length === 0 ? ' empty' : ''}`}>
              {waste.length > 0 && renderCard(waste[waste.length - 1], 'waste', null, waste.length - 1)}
            </div>
            <div id='stock' className={`pile${stock.length === 0 ? ' empty' : ''}`} onClick={drawFromStock} style={{ cursor: 'pointer' }}>
              {stock.length > 0 ? (
                renderCard({ suit: '♠', rank: 'A', faceUp: false, id: 'stock-card' }, 'stock')
              ) : (
                <div className='pile-placeholder' title='ReDraw'>
                  <div className='empty-pile-symbol'>⟳</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='tableau'>
          {tableau.map((pile, i) => (
            <div key={i} className='tableau-pile' id={`tableau-${i}`} data-index={i} onClick={() => (pile.length === 0 ? onPileClick('tableau', i) : undefined)}>
              {pile.length === 0 ? null : pile.map((card, j) => renderCard(card, 'tableau', i, j))}
            </div>
          ))}
        </div>
      </div>
      <div id='message-box' className={showMessage ? 'show' : ''}>
        <p id='message-text'>{message}</p>
        <button id='message-button' className='btn' onClick={startGame}>
          Play Again
        </button>
      </div>
    </>
  )
}

export default Solitaire
