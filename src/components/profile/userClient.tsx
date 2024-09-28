// 'use client'
// import getItem from "@/utils/localStorage"

type UserProps = {
    user: User | string
}

export default function Self({user}: UserProps) {
    // const stored = getItem('user') as User | undefined

    if (typeof user === 'string') {
        return <h1 className='text-xl'>{user}</h1>
    }

    return (
        <div className='w-full h-full p-4'>
            <h1 className='text-2xl mb-4'>Good afternoon, {user.name}!</h1>
            <div className='max-w-[15vw]'>
                <div className='grid grid-cols-2'>
                    <h1 className='text-xl'>Email</h1>
                    <h1 className='text-xl text-end'>{user.username}</h1>
                </div>
                {/* <div className='grid grid-cols-2'>
                    <h1 className='text-xl'>Score</h1>
                    <h1 className='text-xl text-end'>{user.score}</h1>
                </div>
                <div className='grid grid-cols-2'>
                    <h1 className='text-xl'>Solved</h1>
                    <h1 className='text-xl text-end'>{user.solved.length}</h1>
                </div>
                <div className='grid grid-cols-2'>
                    <h1 className='text-xl'>Time spent</h1>
                    <h1 className='text-xl text-end'>{user.time}</h1>
                </div> */}
            </div>
        </div>
    )
}
