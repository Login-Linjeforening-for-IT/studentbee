export default function Elements() {
    return (
        <div className='w-full h-full rounded-xl col-span-2 grid grid-rows-2 gap-8 overflow-auto'>
            <div className="w-full h-full bg-green-500 rounded-xl p-4">
                <h1 className="text-2xl">Help</h1>
            </div>
            <div className="w-full h-full bg-blue-500 rounded-xl p-4 overflow-auto">
                <h1 className="text-2xl">Next question</h1>
            </div>
        </div>
    )
}