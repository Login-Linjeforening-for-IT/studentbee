import appConfig from '@config'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
    const tokenCookie = req.cookies.get('access_token')
    let validToken = false

    if (!pathIsAllowedWhileUnauthorized(req.nextUrl.pathname)) {
        if (!tokenCookie) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        const token = tokenCookie.value

        if (!validToken) {
            validToken = await tokenIsValid(token)
            if (!validToken) {
                return NextResponse.redirect(new URL('/api/logout', req.url))
            }
        }
    }

    const theme = req.cookies.get('theme')?.value || 'dark'
    const res = NextResponse.next()
    res.headers.set('x-theme', theme)
    res.headers.set('x-current-path', req.nextUrl.pathname)
    return res
}

function pathIsAllowedWhileUnauthorized(path: string) {
    if (path === '/favicon.ico') {
        return true
    }

    if (
        path.startsWith('/_next/static/') ||
        path.startsWith('/_next/image') ||
        path.startsWith('/images/') ||
        path.startsWith('/login') ||
        path.startsWith('/api/login') ||
        path.startsWith('/api/callback') ||
        path.startsWith('/api/token') ||
        path.startsWith('/api/logout') ||
        path.startsWith('/_next/webpack-hmr') ||
        path.startsWith('/course/')
    ) {
        return true
    }

    return false
}

async function tokenIsValid(token: string): Promise<boolean> {
    try {
        const userInfo = await fetch(appConfig.authentik.USERINFO_URL, {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!userInfo.ok) {
            return false
        }

        return true
    } catch (error) {
        console.log(`API Error (proxy.ts): ${error}`, {
            message: (error as Error).message,
            stack: (error as Error).stack,
        })

        return false
    }
}
