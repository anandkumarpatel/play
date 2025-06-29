import { Button, Stack } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { games } from '../types'

export const Route = createFileRoute('/')({
  component: Index,
})

export default function Index() {
  return (
    <Stack gap='xl' align='stretch' justify='center' p='xs'>
      {games.map((game, index) => (
        <Button component={Link} key={index} to={game.pathName} variant='filled' fullWidth size='xl'>
          {game.navText}
        </Button>
      ))}
    </Stack>
  )
}
