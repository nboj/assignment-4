import Todo from "./components/Todo";
export const dynamic = "force-dynamic";

export default async function Home() {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/items/`);
        const data = await res.json();
        return (
            <main className="h-full flex w-full">
                <div className="flex shrink-0 gap-[1rem] w-full flex-col items-center py-[4rem] h-fit">
                    <h1 className="text-3xl">Todo List</h1>
                    <Todo items={data.items} />
                </div>
            </main>
        );
    } catch (error: any) {
        console.error(error);
        return (
            <main className="h-full flex w-full">
                <div className="flex shrink-0 gap-[1rem] w-full flex-col items-center py-[4rem] h-fit">
                    <p>
                        Sorry, an error occurred while fetching Todo items (Render may still
                        be spinning up the backend).
                    </p>
                    <p>Click this link to startup the backend server, then refresh in 1 minute:</p>
                    <a href={`${process.env.BACKEND_URL}/api/items/`} target="_blank">{process.env.BACKEND_URL}/api/items/</a>
                </div>
            </main>
        );
    }
}
