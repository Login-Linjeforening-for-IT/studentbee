'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { postCourse } from '@utils/api'
import { toast } from 'sonner'

export default function Add(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params)
    const id = params.id.toUpperCase()

    if (!id) {
        return (
            <Link href='/add/course'>Add course</Link>
        )
    }

    return <AddCourse />
}

function AddCourse() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        id: '',
        name: ''
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await postCourse({ courseCode: formData.id, name: formData.name })
            if ('error' in result) {
                toast.error(result.error)
            } else {
                toast.success('Course added successfully!')
                router.push(formData.id ? `/course/${formData.id}` : '/add/course/')
            }
        } catch (error: unknown) {
            toast.error((error as Error).message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full h-full grid place-items-center'>
            <div className='bg-login-100/10 backdrop-blur-md border border-login-100/20 rounded-2xl shadow-lg p-8 px-100 w-full max-w-md text-center flex flex-col items-center gap-4'>
                <h1 className='text-lg font-semibold'>Add course</h1>
                <form onSubmit={handleSubmit} className='space-y-4 w-4/5'>
                    <input
                        value={formData.id}
                        onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value.toUpperCase().slice(0, 10) }))}
                        type='text'
                        placeholder='Course ID (PROG1001)'
                        className='bg-login-100/10 rounded-lg overflow-hidden px-2 h-8 w-full outline-hidden caret-login'
                        required
                    />

                    <input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.slice(0, 100) }))}
                        type='text'
                        placeholder='Course Name (Grunnleggende programmering)'
                        className='bg-login-100/10 rounded-lg overflow-hidden px-2 h-8 w-full outline-hidden caret-login'
                        required
                    />

                    <button
                        type='submit'
                        disabled={loading || !formData.id.trim() || !formData.name.trim()}
                        className='grid w-full bg-login/70 outline outline-login/90 rounded-lg font-semibold h-8 place-items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Adding...' : 'Add course'}
                    </button>
                </form>
            </div>
        </div>
    )
}
