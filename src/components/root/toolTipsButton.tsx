'use client'

export default function ToolTipsButton() {
    function display() {
        function setLocalStorageItem(key: string, value: string) {
            localStorage.setItem(key, value)

            const event = new CustomEvent('customStorageChange', { detail: { key, value } })
            window.dispatchEvent(event)
        }

        setLocalStorageItem('tooltips', 'true')
    }

    return (
        <button className="mt-4 w-full p-2 flex flex-rows" onClick={display}>
            <h1 className="text-lg px-2 bg-superlight rounded-lg grid place-items-center mr-2">Q</h1>
            <h1 className="text-lg grid place-items-center">Tooltips</h1>
        </button>
    )
}