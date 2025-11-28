import { getUser, deleteUser } from '@utils/api'
import { redirect } from 'next/navigation'

async function deleteUserAction() {
    'use server'
    const result = await deleteUser()
    if ('error' in result) {
        throw new Error(result.error)
    } else {
        redirect('/')
    }
}

export default async function Profile() {
    const user = await getUser()

    if ('error' in user) {
        return <h1 className='text-xl'>Unable to find</h1>
    }

    return (
        <div className='w-full h-full bg-login-900 p-8'>
            <h1 className='text-2xl mb-4'>Good afternoon, {user.name}!</h1>
            <div className='space-y-2'>
                <div className='flex justify-between'>
                    <span className='text-xl'>Email</span>
                    <span className='text-xl'>{user.email}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-xl'>Score</span>
                    <span className='text-xl'>{user.score}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-xl'>Total Time</span>
                    <span className='text-xl'>{user.total_time}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-xl'>Created At</span>
                    <span className='text-xl'>{new Date(user.created_at).toLocaleString('nb-NO')}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-xl'>Updated At</span>
                    <span className='text-xl'>{new Date(user.updated_at).toLocaleString('nb-NO')}</span>
                </div>
            </div>
            <form action={deleteUserAction} className='mt-8'>
                <button type='submit' className='bg-red-800 text-white px-4 py-2 rounded cursor-pointer'>
                    Delete Account
                </button>
            </form>
        </div>
    )
}