import { cookies } from 'next/headers'
import { Navbar, NavItem } from 'uibee/components'

export default async function Topbar() {
    const Cookies = await cookies()
    const accessToken = Cookies.get('access_token')?.value || null
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <Navbar
            lang={null}
            disableLanguageToggle
            theme={theme}
            token={accessToken}
            innerClassName='p-1!'
        >
            <NavItem href='/course'>
                Home
            </NavItem>
            <NavItem href='/scoreboard'>
                Scoreboard
            </NavItem>
            <NavItem href='/grades'>
                Exam statistics
            </NavItem>
            <NavItem href='/profile'>
                Profile
            </NavItem>
            <NavItem href='https://login.no' external>
                Login.no
            </NavItem>
        </Navbar>
    )
}