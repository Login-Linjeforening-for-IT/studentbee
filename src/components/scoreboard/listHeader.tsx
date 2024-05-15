export default function ListHeader({userCount}: {userCount: number}): JSX.Element {

    if (userCount < 2) return(
        <div className="flex bg-[#111] h-[50px] mb-4 rounded-xl px-4">
            <p className="ml-2 grid place-items-center mr-2 w-[80px]">Place</p>
            <p className="mt-auto mb-auto mr-2 w-full pl-10">User</p>
            <p className="mt-auto mb-auto w-[60px]">Score</p>
        </div>
    ) 
    
    return(
        <>
            <div className="flex bg-[#111] h-[50px] mb-4 rounded-xl px-4 mr-4 font-semibold">
                <p className="ml-2 grid place-items-center mr-2 w-[80px]">Place</p>
                <p className="mt-auto mb-auto mr-2 w-full pl-10">User</p>
                <p className="mt-auto mb-auto w-[60px]">Score</p>
            </div>
            <div className="flex bg-[#111] h-[50px] mb-4 rounded-xl px-4 ml-4">
                <p className="ml-2 grid place-items-center mr-2 w-[80px]">Place</p>
                <p className="mt-auto mb-auto mr-2 w-full pl-10">User</p>
                <p className="mt-auto mb-auto w-[60px]">Score</p>
            </div>
        </>
    )
}
