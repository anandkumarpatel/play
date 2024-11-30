import { AppShell, Button, Group } from '@mantine/core'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import './root.css'

export const Route = createRootRoute({
  component: () => (
    <AppShell style={{ height: '100vh' }} header={{ height: 48 }} padding='xs'>
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Link to='/' className='link'>
            <Button variant='subtle'>Home</Button>
          </Link>
        </Group>
      </AppShell.Header>
      <AppShell.Main style={{ height: '100%' }}>
        <Outlet />
      </AppShell.Main>

      {window.location.hostname.includes('localhost') && <TanStackRouterDevtools />}
    </AppShell>
  ),
})