import Script from 'next/script'
import { ChangeEvent, Dispatch, SetStateAction, useRef } from 'react'
import { FileUp, Eraser, EyeOff, Save, Trash2, StickyNote } from 'lucide-react'

type HeaderProps = {
    code: string
    clearCard: () => void
    editing: Course
    setEditing: Dispatch<SetStateAction<Course>>
    hideText: () => void
    handlePublish: () => void
    handleDelete: () => void
    toggleOnlyNotes: () => void
    onlyNotes: boolean
    cardCount: number
}

export default function Header({ 
    code, 
    clearCard, 
    editing, 
    setEditing, 
    hideText, 
    handlePublish, 
    handleDelete, 
    toggleOnlyNotes,
    onlyNotes,
    cardCount 
}: HeaderProps) {
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
        <div className='w-full p-4 flex flex-row justify-between items-center bg-login-900 rounded-lg mb-2'>
            <Script src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js' />
            <div className='flex items-center gap-4'>
                <h1 className='text-2xl font-bold text-white'>Editing {code}</h1>
                <span className='text-login-300 text-sm'>{cardCount} cards</span>
            </div>
            <div className='flex items-center gap-2'>
                <button
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${onlyNotes ? 'text-white bg-login-800' : 'text-login-300 hover:text-white hover:bg-login-800'}`}
                    onClick={toggleOnlyNotes}
                >
                    <StickyNote size={16} />
                    {onlyNotes ? 'Show All' : 'Only Notes'}
                </button>
                <button
                    className='flex items-center gap-2 text-login-300 hover:text-white px-3 py-2 rounded-lg hover:bg-login-800 transition-colors'
                    onClick={hideText}
                >
                    <EyeOff size={16} />
                    Hide Notes
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
                        className='flex items-center gap-2 text-login-300 hover:text-white px-3 py-2 rounded-lg hover:bg-login-800 transition-colors'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FileUp size={16} />
                        Upload PDF
                    </button>
                </>
                <button
                    className='flex items-center gap-2 text-login-300 hover:text-white px-3 py-2 rounded-lg hover:bg-login-800 transition-colors'
                    onClick={clearCard}
                >
                    <Eraser size={16} />
                    Clear Form
                </button>
                <button
                    className='flex items-center gap-2 text-login-300 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-login-800 transition-colors'
                    onClick={handleDelete}
                >
                    <Trash2 size={16} />
                    Delete Course
                </button>
                <button
                    className='flex items-center gap-2 bg-login hover:bg-login/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors ml-2'
                    onClick={handlePublish}
                >
                    <Save size={16} />
                    Publish Changes
                </button>
            </div>
        </div>
    )
}
