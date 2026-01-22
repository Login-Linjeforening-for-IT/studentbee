import appConfig from '@config'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
    const visitedCookie = req.cookies.get('visited')

    if (!visitedCookie && req.nextUrl.pathname !== '/login') {
        const res = NextResponse.redirect(new URL('/login', req.url))
        res.cookies.set('visited', 'true', { maxAge: 8 * 60 * 60 })
        return res
    }

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
    if (
        path.startsWith('/add') ||
        path.startsWith('/edit') ||
        path.startsWith('/profile')
    ) {
        return false
    }

    return true
}

async function tokenIsValid(token: string | undefined): Promise<boolean> {
    if (!token) {
        return false
    }

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
