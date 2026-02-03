'use client'

import { setCookie } from 'utilbee'

export default function ToolTipsButton() {
    function display() {
        function setCookieItem(key: string, value: string) {
            setCookie(key, value)

            const event = new CustomEvent('customStorageChange', { detail: { key, value } })
            window.dispatchEvent(event)
        }

        setCookieItem('tooltips', 'true')
    }

    return (
        <button className='hidden lg:flex w-full p-3 bg-login-900 rounded-xl cursor-pointer border border-login-800/50 hover:bg-login-800 transition-colors items-center shadow-sm' onClick={display}>
            <div className='w-6 h-6 bg-login-400 rounded-lg grid place-items-center mr-3 text-login-950 font-bold text-xs'>Q</div>
            <span className='text-sm text-login-200 font-medium'>Tooltips</span>
        </button>
    )
}
