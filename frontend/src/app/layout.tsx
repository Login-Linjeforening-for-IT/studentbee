import { ReactNode } from 'react'
import './globals.css'
import 'uibee/styles'
import Topbar from '@components/navbar/nav'
import { cookies } from 'next/headers'
import { Toaster } from 'sonner'
import TimeTracker from '@components/root/timeTracker'

export const metadata = {
    title: 'Exam',
    description: 'Practice for your exams with multiple-choice questions.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html lang='en' className={`h-screen w-screen ${theme}`}>
            <body className='bg-login-800! grid grid-rows-[var(--h-navbar)_1fr] gap-0 w-full h-full noscroll'>
                <nav className='fixed top-0 row-span-1 w-full h-(--h-navbar) z-100'>
                    <Topbar />
                </nav>
                <main className='row-start-2 p-2 row-span-full w-full rounded-lg h-full'>
                    {children}
                </main>
                <Toaster
                    position='bottom-right'
                    style={
                        {
                            '--normal-bg': '#121212',
                            '--normal-text': 'white',
                            '--normal-border': '#6b6b6b',
                        } as React.CSSProperties
                    }
                />
                <TimeTracker />
            </body>
        </html>
    )
}
