import Todo from "./components/Todo";
export const dynamic = "force-dynamic";

export default async function Home() {
    const res = await fetch(`${process.env.BACKEND_URL}/api/items/`);
    const data = await res.json();
    return (
        <main className="h-full flex w-full">
            <div className="flex shrink-0 gap-[1rem] w-full flex-col items-center py-[4rem] h-fit">
                <h1 className="text-3xl">Todo List</h1>
                <Todo items={data.items}/>
            </div>
        </main>
    );
}
