import { ReactNode } from 'react'
import './globals.css'
import Navbar from '@components/nav'
import { cookies } from 'next/headers'

export const metadata = {
    title: 'Exam',
    description: 'Practice for your exams with multiple-choice questions.',
}

export default async function RootLayout({children}: {children: ReactNode}) {
    const Cookies = await cookies()
    const theme = Cookies.get('theme')?.value || 'dark'

    return (
        <html lang="en" className={`h-[100vh] w-[100vw] ${theme}`}>
            <body className='bg-normal grid grid-rows-[var(--h-navbar)_auto] gap-0 w-full h-full noscroll'>
                <nav className='row-span-1 w-full h-[var(--h-navbar)]'>
                    <Navbar />
                </nav>
                <main className='row-span-11 w-full p-[0.5rem] rounded-xl max-h-[calc(100vh-var(--h-navbar))]'>
                    {children}
                </main>
            </body>
        </html>
    )
}
