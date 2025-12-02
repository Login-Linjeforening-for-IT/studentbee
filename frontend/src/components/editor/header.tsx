import Script from 'next/script'
import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'

type HeaderProps = {
    code: string
    clearCard: () => void
    editing: Course
    setEditing: Dispatch<SetStateAction<Course>>
    hideText: () => void
}

export default function Header({ code, clearCard, editing, setEditing, hideText }: HeaderProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    async function upload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (file) {
            try {
                const fileReader = new FileReader()

                fileReader.onload = async (event) => {
                    const arrayBuffer = event.target?.result

                    if (arrayBuffer) {
                        const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer)
                        // @ts-expect-error
                        // Expecting error here since pdfjsLib is not defined but imported at runtime
                        const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
                        const pdf = await loadingTask.promise
                        let pdfText = ''

                        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                            const page = await pdf.getPage(pageNum)
                            const textContent = await page.getTextContent()
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const pageText = textContent.items.map((item: any) => item.str).join('\n')
                            pdfText += pageText
                        }

                        setEditing({ ...editing, notes: `${editing.notes}\n${pdfText}` })
                        if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                        }
                    }
                }

                fileReader.onerror = (error) => {
                    console.error('Error reading file:', error)
                }

                fileReader.readAsArrayBuffer(file)
            } catch (error) {
                console.error('Error loading PDF:', error)
            }
        }
    }

    return (
        <div className='w-full p-2 flex flex-rows justify-between'>
            <Script src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js' />
            <h1 className='text-xl'>Editing course {code}</h1>
            <div className='space-x-2'>
                <button className='bg-login-700 rounded-lg p-1 px-2 cursor-pointer' onClick={hideText}>
                    Hide input area
                </button>
                <>
                    <input
                        type='file'
                        accept='.pdf'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={upload}
                    />
                    <button
                        className='bg-login-700 rounded-lg p-1 px-2 cursor-pointer'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Upload exam
                    </button>
                </>
                <button className='bg-login-700 rounded-lg p-1 px-2 cursor-pointer' onClick={clearCard}>
                    Clear
                </button>
            </div>
        </div>
    )
}
