'use client'

import { getCookie } from 'uibee/utils'
import { Navbar, NavItem } from 'uibee/components'


// Displays the header
export default function Topbar() {
    const accessToken = getCookie('access_token') || null
    const theme = getCookie('theme') || 'dark'

    return (
        <Navbar
            lang={null}
            disableLanguageToggle
            theme={theme}
            token={accessToken}
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
            <NavItem href='https://login.no' external>
                Login.no
            </NavItem>
        </Navbar>
    )
}
