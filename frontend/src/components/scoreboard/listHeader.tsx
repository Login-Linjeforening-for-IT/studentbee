export default function ListHeader() {
    return (
        <thead className='text-login-300 text-sm uppercase tracking-wider font-semibold bg-login-900 border-b border-login-700'>
            <tr>
                <th className='px-6 py-4 text-center w-24'>Rank</th>
                <th className='px-6 py-4 text-left'>User</th>
                <th className='px-6 py-4 text-center w-40'>Time</th>
                <th className='px-6 py-4 text-center w-24'>Score</th>
            </tr>
        </thead>
    )
}