'use client'

import { useEffect, useRef, useState } from "react"
import { marked } from "marked"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"
import { sendText } from "@/utils/fetchClient"
import './editor.css'

type EditorProps = {
    courseID: string
    value: string[]
    customSaveLogic?: true
    hideSaveButton?: true
    save?: () => void
    onChange?: Function
}

type EditorWithoutLogicProps = {
    markdown: string
    handleMarkdownChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleSave: () => void
    displayEditor: boolean
    hideSaveButton?: true
    handleDisplayEditor: () => void
    hideSave: boolean
    textareaRef: React.RefObject<HTMLTextAreaElement>
    edited: boolean
}

type MarkdownProps = {
    displayEditor: boolean
    handleDisplayEditor: () => void
    markdown: string
}

marked.use({
    renderer: {
        code(code, lang) {
            const language = hljs.getLanguage(typeof lang === 'string' ? lang : "plaintext") ? lang || "plaintext" : "plaintext"
            return `<pre class="inline-block max-w-full overflow-x-auto rounded-xl"><code class="hljs ${language}">${hljs.highlight(code, { language }).value}</code></pre>`
        },
        image(href, title) {
            const width = 'width="300"'
            return `<img src="${href}" alt="${title}" ${width} />`
        },
        link(href, title, text) {
            return `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${text}</a>`
        }
    }
})

export function Editor({ courseID, value, customSaveLogic, hideSaveButton, save, onChange }: EditorProps) {
    const [markdown, setMarkdown] = useState(value.join('\n'))
    const [displayEditor, setDisplayEditor] = useState(false)
    const [hideSave, setHideSave] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const edited = value.join('\n') !== markdown

    function handleMarkdownChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        if (customSaveLogic && onChange) {
            if (!displayEditor) {
                setDisplayEditor(true)
            }

            onChange(event.target.value)
            setMarkdown(event.target.value)
        } else {
            setMarkdown(event.target.value)
        }

        setDisplayEditor(true)
        autoResize(event.target)
    }

    function handleSave() {
        if (customSaveLogic && save) {
            save()
        } else {
            sendText(courseID, markdown.split('\n'))
        }

        setDisplayEditor(false)
        setHideSave(true)
    }

    function autoResize(textarea: HTMLTextAreaElement) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    function handleDisplayEditor() {
        setDisplayEditor(!displayEditor)
        setHideSave(false)
        if (textareaRef.current) {
            autoResize(textareaRef.current)
        }
    }

    useEffect(() => {
        if (textareaRef.current) {
            autoResize(textareaRef.current)
        }
    }, [])

    useEffect(() => {
        setMarkdown(value.join('\n'))
    }, [value])

    return <EditorWithoutLogic 
        markdown={markdown} 
        handleMarkdownChange={handleMarkdownChange}
        handleSave={handleSave}
        displayEditor={displayEditor}
        handleDisplayEditor={handleDisplayEditor}
        hideSaveButton={hideSaveButton}
        hideSave={hideSave}
        textareaRef={textareaRef}
        edited={edited}
    />
}

export function EditorWithoutLogic({ 
    markdown, 
    handleMarkdownChange, 
    handleSave, 
    displayEditor, 
    handleDisplayEditor, 
    hideSaveButton,
    hideSave, 
    textareaRef, 
    edited 
}: EditorWithoutLogicProps) {
    return (
        <div className="pt-2">
            <div>
                {displayEditor && <div className="grid grid-cols-2">
                    <h1 className="text-lg text-bright">Markdown</h1>
                    <h1 className="text-lg pl-4 text-bright">Preview</h1>
                </div>}
                <div className={`markdown-editor space-x-2 h-full ${displayEditor && "grid grid-cols-2"}`}>
                    {(displayEditor || !markdown.length) && <textarea
                        className="w-full h-full rounded text-white bg-transparent focus:outline-none resize-none overflow-hidden"
                        value={markdown}
                        onChange={handleMarkdownChange}
                        placeholder="Write your markdown here..."
                        ref={textareaRef}
                    />}
                    <Markdown
                        displayEditor={displayEditor} 
                        handleDisplayEditor={handleDisplayEditor} 
                        markdown={markdown}
                    />
                </div>
            </div>
            {edited && !hideSave && !hideSaveButton && <div className="mt-2">
                <button className="text-md bg-orange-500 px-8 rounded-xl h-[4vh]" onClick={handleSave}>Save</button>
            </div>}
        </div>
    )
}

export function Markdown({displayEditor, handleDisplayEditor, markdown}: MarkdownProps) {
    return (
        <div
            className={`markdown-preview ${displayEditor && "pl-2 border-l-2 border-orange-500"} text-white h-full break-words`}
            onClick={handleDisplayEditor}
            dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        />
    )
}
