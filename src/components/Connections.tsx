import { useState, useEffect, useCallback } from 'react'
import { Button, Modal, Text, Group, Stack, Box, Grid, Paper, Title } from '@mantine/core'
import { Textfit } from 'react-textfit'
const isDev = true
interface Category {
  category: string
  words: string[]
}

interface GameState {
  selectedWords: string[]
  mistakes: number
  solvedCategories: number
  previousGuesses: string[]
  solvedCategoryNames: string[]
  isProcessing: boolean
}

const MAX_MISTAKES = 4
const groupColors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
const apiKey = import.meta.env.VITE_GEMINI_API_KEY

export default function Connections() {
  const [gameState, setGameState] = useState<GameState>({
    selectedWords: [],
    mistakes: 0,
    solvedCategories: 0,
    previousGuesses: [],
    solvedCategoryNames: [],
    isProcessing: false,
  })
  const [categoriesData, setCategoriesData] = useState<Category[]>([])
  const [allWords, setAllWords] = useState<Array<{ word: string; category: string }>>([])
  const [solvedGroups, setSolvedGroups] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; color: string; show: boolean }>({
    message: '',
    color: 'bg-gray-700',
    show: false,
  })
  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: '',
    content: '',
  })

  const isWin = gameState.solvedCategories === 4 && gameState.mistakes < MAX_MISTAKES
  const isGameOver = gameState.solvedCategories === 4 || gameState.mistakes >= MAX_MISTAKES

  // Gemini API Call Helper
  const callGemini = useCallback(async (promptText: string): Promise<string> => {
    const payload = { contents: [{ role: 'user', parts: [{ text: promptText }] }] }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status} ${await response.text()}`)
      }
      const result = await response.json()
      if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
        return result.candidates[0].content.parts[0].text
      } else {
        throw new Error('Invalid response structure from API.')
      }
    } catch (error) {
      console.error('Gemini API call failed:', error)
      return "Sorry, I couldn't get a response. Please try again."
    }
  }, [])

  const showToast = useCallback((message: string, color: string) => {
    setToast({ message, color, show: true })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 2000)
  }, [])

  const shuffleArray = useCallback((array: Array<{ word: string; category: string }>) => {
    if (isDev) return array
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }, [])

  const initGame = useCallback(() => {
    setGameState({
      selectedWords: [],
      mistakes: 0,
      solvedCategories: 0,
      previousGuesses: [],
      solvedCategoryNames: [],
      isProcessing: false,
    })
    setSolvedGroups([])
  }, [])

  const fetchGameData = useCallback(async () => {
    setIsLoading(true)
    setGameState((prev) => ({ ...prev, isProcessing: true }))
    try {
      const prompt = `Generate 4 categories for a Connections-style word game. Each category must have 4 words. Words must not be longer than 15 letters. The categories should have varying levels of difficulty. Ensure words can't easily fit into multiple categories. Current timestamp for randomness: ${new Date().toISOString()}-${Math.random()}`
      const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }]
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              categories: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: { category: { type: 'STRING' }, words: { type: 'ARRAY', items: { type: 'STRING' } } },
                  required: ['category', 'words'],
                },
              },
            },
            required: ['categories'],
          },
        },
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result = {} as any
      if (!isDev) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!response.ok) throw new Error(`API call failed: ${response.status}`)
        result = await response.json()
      }
      if (isDev) {
        result = {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: '{\n  "categories": [\n    {\n      "category": "US Presidents",\n      "words": ["LINCOLN", "KENNEDY", "REAGAN", "BIDEN"]\n    },\n    {\n      "category": "Card Games",\n      "words": ["POKER", "HEARTS", "BRIDGE", "SOLITAIRE"]\n    },\n    {\n      "category": "Things Found in a Park",\n      "words": ["FOUNTAIN", "bench", "SQUIRREL", "PATHWAY"]\n    },\n    {\n      "category": "Words with Silent Letters",\n      "words": ["ISLAND", "KNIFE", "WRESTLE", "COLUMN"]\n    }\n  ]\n}',
                  },
                ],
                role: 'model',
              },
              finishReason: 'STOP',
              avgLogprobs: -0.1845685464364511,
            },
          ],
          usageMetadata: {
            promptTokenCount: 113,
            candidatesTokenCount: 162,
            totalTokenCount: 275,
            promptTokensDetails: [{ modality: 'TEXT', tokenCount: 113 }],
            candidatesTokensDetails: [{ modality: 'TEXT', tokenCount: 162 }],
          },
          modelVersion: 'gemini-2.0-flash',
          responseId: 'p81gaPeTM-qGm9IP_tz1iQ8',
        }
      }
      if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
        const gameData = JSON.parse(result.candidates[0].content.parts[0].text)
        if (gameData && gameData.categories && gameData.categories.length === 4) {
          setCategoriesData(gameData.categories)
          const shuffledWords = shuffleArray(gameData.categories.flatMap((cat: Category) => cat.words.map((word: string) => ({ word, category: cat.category }))))
          setAllWords(shuffledWords)
          initGame()
        } else {
          throw new Error('Invalid data structure from API.')
        }
      } else {
        throw new Error('No content received from API.')
      }
    } catch (error) {
      console.error('Error fetching game data:', error)
      showToast('Failed to load puzzle. Please try again.', 'bg-red-500')
    } finally {
      setGameState((prev) => ({ ...prev, isProcessing: false }))
      setIsLoading(false)
    }
  }, [shuffleArray, initGame, showToast])

  const getCategoryForWord = useCallback((word: string) => categoriesData.find((cat) => cat.words.includes(word))?.category, [categoriesData])

  const handleWordClick = useCallback(
    (word: string) => {
      if (gameState.isProcessing) return
      setGameState((prev) => {
        const newSelectedWords = prev.selectedWords.includes(word)
          ? prev.selectedWords.filter((w) => w !== word)
          : prev.selectedWords.length < 4
            ? [...prev.selectedWords, word]
            : prev.selectedWords
        return { ...prev, selectedWords: newSelectedWords }
      })
    },
    [gameState.isProcessing]
  )

  const handleCorrectGroup = useCallback(
    (categoryName: string, hideToast: boolean = false) => {
      const groupData = categoriesData.find((cat) => cat.category === categoryName)
      if (!groupData) return
      setGameState((prev) => ({
        ...prev,
        isProcessing: true,
        solvedCategoryNames: [...prev.solvedCategoryNames, categoryName],
        selectedWords: [],
        solvedCategories: prev.solvedCategories + 1,
      }))
      setSolvedGroups((prev) => [...prev, groupData])
      if (!hideToast) {
        showToast('Correct!', 'bg-green-500')
      }
      setAllWords((prev) => prev.filter((item) => !groupData.words.includes(item.word)))
      setTimeout(() => {
        setGameState((prev) => ({ ...prev, isProcessing: false }))
      }, 100)
    },
    [categoriesData, showToast]
  )

  const handleIncorrectGuess = useCallback(
    (guess: string, hideToast: boolean = false) => {
      const mistakes = gameState.mistakes + 1
      setGameState((prev) => ({
        ...prev,
        previousGuesses: [...prev.previousGuesses, guess],
        mistakes: prev.mistakes + 1,
        selectedWords: [],
      }))

      if (mistakes >= MAX_MISTAKES) {
        showToast('Game Over!', 'bg-red-600')
        setTimeout(() => {
          const remainingCategories = categoriesData.filter((cat) => !gameState.solvedCategoryNames.includes(cat.category))

          remainingCategories.forEach((category, index) => {
            setTimeout(
              () => {
                handleCorrectGroup(category.category, true)
              },
              // Stagger the auto-solve with 500ms delays
              (index + 1) * 500 + index * 200
            )
          })
        }, 1000)
      } else {
        if (!hideToast) {
          showToast('Incorrect, try again.', 'bg-red-500')
        }
      }
    },
    [categoriesData, gameState.mistakes, gameState.solvedCategoryNames, handleCorrectGroup, showToast]
  )

  const handleSubmit = useCallback(() => {
    if (gameState.isProcessing || gameState.selectedWords.length !== 4) return
    const sortedGuess = [...gameState.selectedWords].sort().join(',')
    if (gameState.previousGuesses.includes(sortedGuess)) {
      showToast('Already guessed', 'bg-gray-600')
      return
    }
    const firstCategory = getCategoryForWord(gameState.selectedWords[0])
    const isCorrectGroup = gameState.selectedWords.every((word) => getCategoryForWord(word) === firstCategory)
    if (isCorrectGroup) {
      handleCorrectGroup(firstCategory!)
      return
    }
    const categoryCounts = gameState.selectedWords.reduce(
      (acc, word) => {
        const category = getCategoryForWord(word)
        if (category) {
          acc[category] = (acc[category] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>
    )
    if (Object.values(categoryCounts).some((count) => count === 3)) {
      showToast('One away...', 'bg-blue-500')
    }
    handleIncorrectGuess(sortedGuess, true)
  }, [gameState.isProcessing, gameState.previousGuesses, gameState.selectedWords, getCategoryForWord, handleCorrectGroup, handleIncorrectGuess, showToast])

  const handleHintClick = useCallback(async () => {
    if (gameState.isProcessing || gameState.mistakes >= MAX_MISTAKES - 1 || gameState.solvedCategories >= 3) return
    setInfoModal({ isOpen: true, title: 'Getting Hint...', content: '' })
    const unsolvedCategories = categoriesData.filter((cat) => !gameState.solvedCategoryNames.includes(cat.category))
    if (unsolvedCategories.length > 0) {
      const categoryToHint = unsolvedCategories[Math.floor(Math.random() * unsolvedCategories.length)]
      const prompt = `I am playing a word game to find words that are related to the same category. A hidden category is "${categoryToHint.category}". Give me a single, clever sentence as a hint for this category. The hint must NOT contain any of the following words: ${categoryToHint.words.join(', ')}.`
      const hint = await callGemini(prompt)
      setInfoModal({ isOpen: true, title: 'Hint', content: hint })
      setGameState((prev) => ({ ...prev, mistakes: prev.mistakes + 1 }))
      if (gameState.mistakes + 1 >= MAX_MISTAKES) {
        setTimeout(() => {
          setInfoModal({ isOpen: false, title: '', content: '' })
        }, 2000)
      }
    } else {
      setInfoModal({ isOpen: true, title: 'Hint', content: 'No more hints available!' })
    }
  }, [gameState, categoriesData, callGemini])

  const handleExplainClick = useCallback(
    async (category: Category) => {
      setInfoModal({ isOpen: true, title: category.category, content: '' })
      const prompt = `Explain the connection between these words: ${category.words.join(', ')}. The category is "${category.category}". Make it fun and concise (1-2 sentences).`
      const explanation = await callGemini(prompt)
      setInfoModal({ isOpen: true, title: category.category, content: explanation })
    },
    [callGemini]
  )

  const handlePlayAgain = useCallback(() => {
    fetchGameData()
  }, [fetchGameData])

  useEffect(() => {
    fetchGameData()
  }, [fetchGameData])

  const renderMistakesCounter = () => (
    <Group gap={8} justify='center'>
      {[...Array(MAX_MISTAKES)].map((_, i) => (
        <Box
          key={i}
          w={16}
          h={16}
          style={{
            borderRadius: '50%',
            background: i < gameState.mistakes ? '#000' : '#fff',
            margin: '0 4px',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </Group>
  )

  const renderSolvedGroups = () => (
    <Grid gutter={0} m={0}>
      {solvedGroups.map((group, index) => (
        <Grid.Col key={group.category} span={12} p={3}>
          <Paper w='100%' h='100%' radius='md' p='md' shadow='md' style={{ background: groupColors[index], color: '#111', textAlign: 'center' }}>
            <Group justify='space-between' align='center' mb='xs'>
              <Title order={4} fw={700} fz={20} m={0}>
                {group.category}
              </Title>
              <Button
                radius='xl'
                variant='subtle'
                size='xs'
                onClick={() => handleExplainClick(group)}
                style={{ fontSize: 22, fontWeight: 700, padding: 4, background: 'rgba(0,0,0,0.10)' }}
              >
                ✨
              </Button>
            </Group>
            <Text fw={500} ta='left'>
              {group.words.join(', ')}
            </Text>
          </Paper>
        </Grid.Col>
      ))}
    </Grid>
  )

  const cardSx = (selected: boolean, index?: number) => ({
    background: isLoading ? '#232834' : selected ? '#5a5a5a' : '#232834',
    aspectRatio: '1 / 1',
    transition: 'background 0.2s, color 0.2s, transform 0.2s',
    transform: selected ? 'scale(0.95)' : 'none',
    userSelect: 'none' as const,
    textTransform: 'uppercase' as const,
    ...(isLoading && {
      animation: `fadeInOut 1.5s ease-in-out infinite`,
      animationDelay: `${index! * 0.1}s`,
    }),
  })

  const renderWordGrid = () => (
    <Grid gutter={0} mb='md' m={0}>
      {(isLoading ? [...Array(16)] : allWords).map((item, index) => (
        <Grid.Col key={isLoading ? index : `${item.word}-${index}`} span={3} p={3}>
          <Button
            fw={700}
            p={4}
            w='100%'
            h='100%'
            radius='md'
            style={cardSx(gameState.selectedWords.includes(isLoading ? '' : item.word), index)}
            onClick={isLoading ? undefined : () => handleWordClick(item.word)}
            disabled={isLoading}
          >
            {!isLoading && (
              <Textfit mode='single' min={5} max={18} style={{ width: '100%' }}>
                {item.word}
              </Textfit>
            )}
          </Button>
        </Grid.Col>
      ))}
    </Grid>
  )

  return (
    <Box w='100%' mih='100vh' bg='#000' display='flex' p={0} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Box w='100%' maw='28rem' mx='auto'>
        <Title order={1} fw={700} fz={32} ta='center' c='#fff' mb={4}>
          Connections
        </Title>
        <Text ta='center' c='#cbd5e1' mb={24} fz={18}>
          {isGameOver ? (isWin ? 'You found all the connections!' : 'Better luck next time!') : 'Create four groups of four!'}
        </Text>
        {solvedGroups.length > 0 && !isLoading && renderSolvedGroups()}
        {renderWordGrid()}
        <Stack align='center' gap='xs'>
          <Text c='#fff'>Mistakes Remaining:</Text>
          {renderMistakesCounter()}
        </Stack>
        <Group justify='center' gap={16} mt='xl'>
          <Button
            variant='gradient'
            gradient={{ from: '#a78bfa', to: '#7c3aed', deg: 90 }}
            radius='xl'
            size='md'
            onClick={handleHintClick}
            disabled={gameState.isProcessing || gameState.mistakes >= MAX_MISTAKES - 1 || gameState.solvedCategories >= 3}
            leftSection={<span style={{ fontSize: 20 }}>✨</span>}
          >
            Hint
          </Button>
          <Button
            color='green'
            variant='filled'
            radius={'xl'}
            size='md'
            onClick={isGameOver ? handlePlayAgain : handleSubmit}
            disabled={gameState.selectedWords.length !== 4 || gameState.isProcessing}
          >
            {isGameOver ? 'Play Again' : 'Submit'}
          </Button>
        </Group>
        {toast.show && (
          <Box
            style={{
              position: 'fixed',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '12px 24px',
              borderRadius: 8,
              color: '#fff',
              fontWeight: 500,
              zIndex: 150,
              background:
                toast.color === 'bg-gray-700'
                  ? '#374151'
                  : toast.color === 'bg-green-500'
                    ? '#10b981'
                    : toast.color === 'bg-blue-500'
                      ? '#3b82f6'
                      : toast.color === 'bg-red-500'
                        ? '#ef4444'
                        : toast.color === 'bg-red-600'
                          ? '#dc2626'
                          : '#374151',
              opacity: toast.show ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          >
            {toast.message}
          </Box>
        )}
        <Modal opened={infoModal.isOpen} onClose={() => setInfoModal({ isOpen: false, title: '', content: '' })} centered title={infoModal.title}>
          <Stack gap='md'>
            <Text fz={18} style={{ minHeight: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {infoModal.content || <Box w={32} h={32} style={{ border: '4px dashed #888', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />}
            </Text>
            <Button
              variant='filled'
              style={{ background: '#fff', color: '#111', fontWeight: 700, fontSize: 18, borderRadius: 999 }}
              onClick={() => setInfoModal({ isOpen: false, title: '', content: '' })}
              fullWidth
            >
              Close
            </Button>
          </Stack>
        </Modal>
      </Box>
      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  )
}
