import { createFileRoute } from '@tanstack/react-router'
import Sequence from '../../components/Sequence'

export const Route = createFileRoute('/sequence/')({
  component: Sequence,
})
