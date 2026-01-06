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
        <button className='hidden lg:flex w-full p-2 bg-login-900 rounded-lg cursor-pointer' onClick={display}>
            <h1 className='px-2 bg-login-400 rounded-lg grid place-items-center mr-2'>Q</h1>
            <h1 className='grid place-items-center'>Tooltips</h1>
        </button>
    )
}
