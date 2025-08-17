import { useState, useEffect, useCallback } from 'react'
import { Button, Text, Group, Box, Grid, Paper, Title } from '@mantine/core'

const TOTAL_BUTTONS = 9
const SEQUENCE_DELAY = 500 // ms between each button lighting up
const LEVEL_START = 3

export default function Sequence() {
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])
  const [activeButton, setActiveButton] = useState<number | null>(null)
  const [level, setLevel] = useState(LEVEL_START)
  const [isDisplaying, setIsDisplaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [message, setMessage] = useState('Press Start to Play')

  const generateSequence = useCallback(() => {
    const newSequence: number[] = []
    for (let i = 0; i < level; i++) {
      newSequence.push(Math.floor(Math.random() * TOTAL_BUTTONS))
    }
    setSequence(newSequence)
    setUserInput([])
    setIsGameOver(false)
    setIsDisplaying(true)
    setMessage('Watch the sequence')
  }, [level])

  const handleStartGame = () => {
    setLevel(LEVEL_START)
    generateSequence()
  }

  const handleButtonClick = (buttonIndex: number) => {
    if (isDisplaying || isGameOver) return
    setUserInput([...userInput, buttonIndex])
  }

  useEffect(() => {
    if (sequence.length === 0) return

    const displayTimeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setActiveButton(sequence[i])
        i++
        if (i >= sequence.length) {
          clearInterval(interval)
          setTimeout(() => {
            setActiveButton(null)
            setIsDisplaying(false)
            setMessage('Your turn')
          }, SEQUENCE_DELAY)
        }
      }, SEQUENCE_DELAY)
    }, 1000)

    return () => clearTimeout(displayTimeout)
  }, [sequence])

  useEffect(() => {
    if (userInput.length === 0) return

    const isCorrect = userInput.every((val, index) => val === sequence[index])

    if (!isCorrect) {
      setIsGameOver(true)
      setMessage(`Game Over! You reached level ${level - 1}. Press Start to play again.`)
      return
    }

    if (userInput.length === sequence.length) {
      setLevel(level + 1)
      setTimeout(() => generateSequence(), 1000)
    }
  }, [userInput, sequence, level, generateSequence])


  return (
    <Box w='100%' mih='100vh' bg='#000' display='flex' p={0} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Box w='100%' maw='28rem' mx='auto'>
        <Title order={1} fw={700} fz={32} ta='center' c='#fff' mb={4}>
          Sequence
        </Title>
        <Text ta='center' c='#cbd5e1' mb={24} fz={18}>
          {message}
        </Text>
        <Paper w='100%' p='md' shadow='md' style={{ background: '#1a1b1e', color: '#fff' }}>
          <Grid gutter="md">
            {[...Array(TOTAL_BUTTONS)].map((_, index) => (
              <Grid.Col key={index} span={4}>
                <Button
                  w="100%"
                  h={80}
                  onClick={() => handleButtonClick(index)}
                  disabled={isDisplaying || isGameOver}
                  style={{
                    transition: 'background-color 0.2s',
                    backgroundColor: activeButton === index ? 'yellow' : '#343a40',
                  }}
                >
                </Button>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
        <Group justify='center' mt="xl">
          { (sequence.length === 0 || isGameOver) &&
            <Button
              variant='gradient'
              gradient={{ from: '#a78bfa', to: '#7c3aed', deg: 90 }}
              radius='xl'
              size='md'
              onClick={handleStartGame}
            >
              Start Game
            </Button>
          }
        </Group>
        <Text ta='center' c='#cbd5e1' mt={24} fz={18}>
          Level: {level - LEVEL_START}
        </Text>
      </Box>
    </Box>
  )
}
