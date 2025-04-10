import { ReactNode, type JSX } from 'react';
import './globals.css'
import Navbar from '@components/nav'

export const metadata = {
    title: 'Exam',
    description: 'Practice for your exams with multiple-choice questions.',
}

export default function RootLayout({children}: {children: ReactNode}): JSX.Element {

    return (
        <html lang="en" className='h-[100vh] w-[100vw] dark'>
            <body className='bg-normal grid grid-rows-[var(--h-navbar)_auto] gap-0 w-full h-full noscroll'>
                <nav className='row-span-1 w-full h-[var(--h-navbar)]'>
                    <Navbar />
                </nav>
                <main className='row-span-11 w-full rounded-xl p-[2rem] max-h-[calc(100vh-var(--h-navbar))]'>
                    {children}
                </main>
            </body>
        </html>
    )
}
