import List from "@components/scoreboard/list"

export default function Scoreboard(): JSX.Element {
    return (
        <main className="grid place-items-center h-full]">
            <div className="w-full h-full grid place-items-center">
                <h1 className="grid place-items-center text-4xl font-bold mb-8">Scoreboard</h1>
                <List />
            </div>
        </main>
    )
}
