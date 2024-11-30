import { Button, Stack, Text } from '@mantine/core'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

const Win = () => {
  const { history } = useRouter()

  return (
    <Stack gap='xl' align='stretch' justify='center'>
      <Text size='xl' fw={700} ta='center'>
        You Won!
      </Text>
      <Button size='xl' variant='filled' onClick={() => history.go(-1)}>
        Play Again
      </Button>
      <Button component={Link} to='/' variant='filled' fullWidth size='xl'>
        Play Different Game
      </Button>
    </Stack>
  )
}
export const Route = createFileRoute('/win/')({
  component: Win,
})
