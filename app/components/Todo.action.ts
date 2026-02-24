"use server";

export const addItem = async (formData: FormData) => {
    const title = formData.get("new-item");
    if (!title) {
        return;
    }
    const res = await fetch(`${process.env.BACKEND_URL}/api/items/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            completed: false,
        }),
    });
    const data = await res.json();
    console.log(data);
    return data.new_item;
};

export const toggleItem = async (id: number, completed: boolean) => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/items/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                completed,
            }),
        });
        if (res.ok) {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (e: any) {
        console.error(e);
        return { success: false };
    }
};


export const deleteItem = async (id: number) => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/items/${id}/`, {
            method: "DELETE",
        });
        if (res.ok) {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (e: any) {
        console.error(e);
        return { success: false };
    }
}
