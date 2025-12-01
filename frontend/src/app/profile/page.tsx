import { getUser, deleteUser } from '@utils/api'
import { redirect } from 'next/navigation'
import { PageContainer } from 'uibee/components'

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
        return <h1 className='text-xl'>Unable to find profile.</h1>
    }

    return (
        <PageContainer title='Profile'>
            <h1 className='text-2xl mb-4'>Good afternoon, {user.name}!</h1>
            <div className='space-y-2'>
                <div className='grid grid-cols-[auto_1fr] gap-4'>
                    <span className='text-xl font-semibold'>Email: </span>
                    <span className='text-xl'>{user.email}</span>
                </div>
                <div className='grid grid-cols-[auto_1fr] gap-4'>
                    <span className='text-xl font-semibold'>Score: </span>
                    <span className='text-xl'>{user.score}</span>
                </div>
                <div className='grid grid-cols-[auto_1fr] gap-4'>
                    <span className='text-xl font-semibold'>Total Time: </span>
                    <span className='text-xl'>{user.total_time}</span>
                </div>
                <div className='grid grid-cols-[auto_1fr] gap-4'>
                    <span className='text-xl font-semibold'>Created At: </span>
                    <span className='text-xl'>{new Date(user.created_at).toLocaleString('nb-NO')}</span>
                </div>
                <div className='grid grid-cols-[auto_1fr] gap-4'>
                    <span className='text-xl font-semibold'>Updated At: </span>
                    <span className='text-xl'>{new Date(user.updated_at).toLocaleString('nb-NO')}</span>
                </div>
            </div>
            <form action={deleteUserAction} className='mt-8'>
                <button type='submit' className='bg-red-800 text-white px-4 py-2 rounded cursor-pointer'>
                    Delete Account
                </button>
            </form>
        </PageContainer>
    )
}