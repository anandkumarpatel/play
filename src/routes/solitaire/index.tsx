import { createFileRoute } from '@tanstack/react-router'
import Solitaire from '../../components/Solitaire'

const SolitaireGame = () => {
  return <Solitaire />
}
export const Route = createFileRoute('/solitaire/')({
  component: SolitaireGame,
})
