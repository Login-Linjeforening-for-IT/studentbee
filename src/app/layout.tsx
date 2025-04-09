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
            <body className='bg-normal grid grid-rows-12 w-full h-full p-8 noscroll'>
                <nav className='row-span-1 w-full rounded-xl overflow-auto'>
                    <Navbar />
                </nav>
                <main className='row-span-11 w-full rounded-xl max-h-full'>
                    {children}
                </main>
            </body>
        </html>
    )
}
