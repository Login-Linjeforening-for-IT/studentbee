'use client'

import config from '@config'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoginPage } from 'uibee/components'
import { getCookie } from 'uibee/utils'


export default function Page() {
    const router = useRouter()
    const token = getCookie('access_token')
    if (token) {
        router.push('/')
    }

    useEffect(() => {
        const loginInterval = setInterval(() => {
            const token = getCookie('access_token')
            if (token) {
                router.push('/')
            }
        }, 1000)

        return () => clearInterval(loginInterval)
    }, [])

    return (
        <LoginPage
            title='StudentBee'
            description=''
            redirectURL={config.auth.LOGIN_URL}
            version={config.version}
        />
    )
}
