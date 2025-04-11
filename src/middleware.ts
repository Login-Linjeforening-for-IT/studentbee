import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    res.headers.set('x-current-path', req.nextUrl.pathname)
    return res
}
