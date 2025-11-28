'use client'

import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { sendText } from '@parent/src/utils/fetchClient'
import './editor.css'

type EditorProps = {
    courseID: string
    value: string[]
    customSaveLogic?: true
    hideSaveButton?: true
    save?: () => void
    onChange?: (value: string) => void
    className?: string
    placeholder?: string
    placeholderClassName?: string
}

type EditorWithoutLogicProps = {
    markdown: string
    handleMarkdownChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
    handleSave: () => void
    displayEditor: boolean
    hideSaveButton?: true
    handleDisplayEditor: () => void
    hideSave: boolean
    textareaRef: RefObject<HTMLTextAreaElement | null>
    edited: boolean
    className?: string
    placeholder?: string
    placeholderClassName?: string
}

type MarkdownProps = {
    displayEditor: boolean
    handleDisplayEditor: () => void
    markdown: string
    className?: string
}

marked.use({
    renderer: {
        code(code, lang) {
            const language = hljs.getLanguage(typeof lang === 'string' ? lang : 'plaintext') ? lang || 'plaintext' : 'plaintext'
            return `<pre class='inline-block rounded-xl overflow-auto whitespace-pre-wrap break-words'><code class='hljs ${language}'>${hljs.highlight(code, { language }).value}</code></pre>`
        },
        image(href, title) {
            const width = 'width="300"'
            return `<img src='${href}' alt='${title}' ${width} />`
        },
        link(href, title, text) {
            return `<a href='${href}' title='${title}' target='_blank' rel='noopener noreferrer' class='text-blue-500 underline'>${text}</a>`
        },
        codespan(text) {
            return `<code class='break-all bg-login-500 p-0.3 rounded-xs'>${text}</code>`
        }
    }
})

export default function Editor({
    courseID,
    value,
    customSaveLogic,
    hideSaveButton,
    save,
    onChange,
    className,
    placeholder,
    placeholderClassName
}: EditorProps) {
    const [markdown, setMarkdown] = useState(value.join('\n'))
    const [displayEditor, setDisplayEditor] = useState(false)
    const [hideSave, setHideSave] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const edited = value.join('\n') !== markdown

    function handleMarkdownChange(event: ChangeEvent<HTMLTextAreaElement>) {
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
        className={className}
        placeholder={placeholder}
        markdown={markdown}
        handleMarkdownChange={handleMarkdownChange}
        handleSave={handleSave}
        displayEditor={displayEditor}
        handleDisplayEditor={handleDisplayEditor}
        hideSaveButton={hideSaveButton}
        hideSave={hideSave}
        textareaRef={textareaRef}
        edited={edited}
        placeholderClassName={placeholderClassName}
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
    edited,
    className,
    placeholder,
    placeholderClassName
}: EditorWithoutLogicProps) {
    return (
        <div
            className={`${className}`}
            onClick={() => textareaRef?.current?.focus()}
        >
            <div className=''>
                {displayEditor && <div className='grid grid-cols-2'>
                    <h1 className='text-lg text-login-300'>Markdown</h1>
                    <h1 className='text-lg pl-2 text-login-300'>Preview</h1>
                </div>}
                <div className={`markdown-editor space-x-2 h-full ${displayEditor && 'grid grid-cols-2'}`}>
                    {(displayEditor || !markdown.length) && <textarea
                        className={`w-full h-full rounded-sm text-white bg-transparent focus:outline-hidden resize-none overflow-hidden outline-hidden caret-orange-500 ${placeholderClassName}`}
                        value={markdown}
                        onChange={handleMarkdownChange}
                        placeholder={placeholder || 'Write your markdown here...'}
                        ref={textareaRef}
                    />}
                    <Markdown
                        displayEditor={displayEditor}
                        handleDisplayEditor={handleDisplayEditor}
                        markdown={markdown}
                    />
                </div>
            </div>
            {edited && !hideSave && !hideSaveButton && <div className='mt-2'>
                <button
                    className='text-md bg-login px-8 rounded-xl h-[4vh]'
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>}
        </div>
    )
}

export function Markdown({
    displayEditor,
    handleDisplayEditor,
    markdown,
    className
}: MarkdownProps) {
    return (
        <div
            className={`markdown-preview ${displayEditor && 'pl-2 border-l-2 border-orange-500'} text-foreground h-full break-words ${className}`}
            onClick={handleDisplayEditor}
            dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        />
    )
}
