import { ReactNode } from 'react'
import './globals.css'
import Navbar from '@parent/src/components/nav'
import { cookies } from 'next/headers'

export const metadata = {
    title: 'Exam',
    description: 'Practice for your exams with multiple-choice questions.',
}

export default async function RootLayout({children}: {children: ReactNode}) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html lang='en' className={`h-[100vh] w-[100vw] ${theme}`}>
            <body className='bg-login-800 grid grid-rows-[var(--h-navbar)_auto] gap-0 w-full h-full noscroll'>
                <nav className='row-span-1 w-full h-[var(--h-navbar)] z-100'>
                    <Navbar />
                </nav>
                <main className='row-span-11 bg-login-800 w-full p-2 rounded-xl max-h-[calc(100vh-var(--h-navbar))]'>
                    {children}
                </main>
            </body>
        </html>
    )
}
