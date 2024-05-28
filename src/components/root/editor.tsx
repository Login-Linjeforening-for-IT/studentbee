'use client'

import { useEffect, useRef, useState } from "react"
import { marked } from "marked"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"
import { sendText } from "@/utils/fetchClient"
import './editor.css'
// Configure marked to highlight code and style images
marked.use({
    renderer: {
        code(code, lang) {
            const language = hljs.getLanguage(typeof lang === 'string' ? lang : "plaintext") ? lang || "plaintext" : "plaintext"
            return `<pre class="inline-block max-w-full overflow-x-auto"><code class="hljs ${language}">${hljs.highlight(code, { language }).value}</code></pre>`
        },
        image(href, title) {
            const width = 'width="300"'
            return `<img src="${href}" alt="${title}" ${width} />`
        }
    }
})

export default function Editor({ courseID, text }: { courseID: string, text: string[] }) {
    const [markdown, setMarkdown] = useState(text.join('\n'))
    const [displayEditor, setDisplayEditor] = useState(false)
    const [hideSave, setHideSave] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const edited = text.join('\n') !== markdown

    function handleMarkdownChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setMarkdown(event.target.value)
        autoResize(event.target)
    }

    function handleSave() {
        sendText(courseID, markdown.split('\n'))
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
                    <div
                        className={`markdown-preview ${displayEditor && "pl-2 border-l-2 border-orange-500"} text-white h-full`}
                        onClick={handleDisplayEditor}
                        dangerouslySetInnerHTML={{ __html: marked(markdown) }}
                    />
                </div>
            </div>
            {edited && !hideSave && <div className="mt-2">
                <button className="text-md bg-orange-500 px-8 rounded-xl h-[4vh]" onClick={handleSave}>Save</button>
            </div>}
        </div>
    )
}
