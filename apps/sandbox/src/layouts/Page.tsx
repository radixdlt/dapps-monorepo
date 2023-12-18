import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import teamTheme from '../theme'
import Layout from '../components/Layout'
import { Header } from '../layouts/Header'
import { Sidebar } from '../layouts/Sidebar'
import { Logger } from '../logger/Logger'
import { Outlet } from 'react-router-dom'
import { Link } from '@mui/joy'
import { useState } from 'react'
export const Page = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <CssVarsProvider disableTransitionOnChange theme={teamTheme}>
      <CssBaseline />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Sidebar />
          <Link target="_blank" href="https://www.radixdlt.com/privacy-policy">
            Privacy Policy
          </Link>
        </Layout.SideDrawer>
      )}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: '100vh',
            overflow: 'hidden'
          })
        }}
      >
        <Header setDrawerOpen={(value) => setDrawerOpen(value)} />

        <Layout.SideNav>
          <Sidebar />
          <Link target="_blank" href="https://www.radixdlt.com/privacy-policy">
            Privacy Policy
          </Link>
          <Link
            target="_blank"
            href="http://www.radixdlt.com/terms/sandbox"
          >
            Terms and Conditions
          </Link>
        </Layout.SideNav>

        <Layout.Main>
          <Outlet />
          <Logger />
        </Layout.Main>
      </Layout.Root>
    </CssVarsProvider>
  )
}
