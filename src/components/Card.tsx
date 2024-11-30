import { Flip } from '@gfazioli/mantine-flip'
import '@gfazioli/mantine-flip/styles.css'
import { Center, Paper, Text, Transition } from '@mantine/core'

type Input = {
  img: string
  onPress: () => void
  isMatched: boolean
  isFlipped: boolean
  faceUp?: boolean
  color: string
  fontSize?: number
}
const flipTime = 0.8

const FlipCard = ({ img, onPress, isMatched, isFlipped, color, faceUp = false, fontSize = 15 }: Input) => {
  const frontColor = '#ffffff'
  const base = {
    height: '100%',
  }
  const font = {
    fontSize: `calc(min(${fontSize}vw, ${fontSize}vh))`,
  }

  return (
    <Transition mounted={!isMatched} keepMounted={true} transition='pop' enterDelay={500} exitDelay={300}>
      {(transitionStyle) => (
        <Flip
          flipped={isFlipped || isMatched}
          onClick={onPress}
          style={[transitionStyle, { display: 'block' }, base, isMatched && transitionStyle.display === 'none' && { visibility: 'hidden' }]}
          duration={flipTime}
        >
          {/* front size (blank unless faceUp) */}
          <Paper style={base} radius='xl' withBorder shadow='xl' bg={frontColor}>
            <Center style={base}>
              <Text style={font}>{faceUp && img}</Text>
            </Center>
          </Paper>

          {/* backside with image / color*/}
          <Paper style={base} radius='xl' withBorder shadow='xl' bg={color}>
            <Center style={base}>
              <Text style={font}>{img}</Text>
            </Center>
          </Paper>
        </Flip>
      )}
    </Transition>
  )
}

export default FlipCard
