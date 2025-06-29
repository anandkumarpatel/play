import { createFileRoute } from '@tanstack/react-router'
import Connections from '../../components/Connections'

export const Route = createFileRoute('/connections/')({
  component: Connections,
})
