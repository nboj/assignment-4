"use client";
import { Item } from "@/lib/types";
import styles from "./Todo.module.css";
import { useState, MouseEvent, ChangeEvent } from "react";
import { addItem, deleteItem, toggleItem } from "./Todo.action";
import { useFormStatus } from "react-dom";
import { FaRegTrashAlt } from "react-icons/fa";

interface CompleteInputProps {
    id: number;
    completed: boolean;
    onDelete: (id: number) => void;
}
const CompleteInput = ({ completed: _completed, id, onDelete}: CompleteInputProps) => {
    const [completed, setCompleted] = useState<boolean>(_completed);
    const [pending, setPending] = useState<boolean>(false);
    const [deletePending, setDeletePending] = useState<boolean>(false);
    const handleInputChanged = async (event: ChangeEvent<HTMLInputElement>) => {
        if (pending) return;
        setPending(true);
        const current = event.target.checked;
        setCompleted(current);
        const response = await toggleItem(id, current);
        if (response.success) {
            setCompleted(current);
        } else {
            setCompleted(!current);
        }
        setPending(false);
    };

    const handleDelete = async () => {
        setDeletePending(true);
        const res = await deleteItem(id);
        if (res.success) {
            onDelete(id);
        } else {
            setDeletePending(false);
        }
    }

    return (
        <div className={`${deletePending && "hidden"} flex justify-center items-center gap-[0.5rem]`}>
            <input
                type="checkbox"
                name="completed"
                checked={completed}
                disabled={pending}
                onChange={handleInputChanged}
            />
            <FaRegTrashAlt onClick={handleDelete} className="cursor-pointer"/>
        </div>
    );
};

interface SubmitButtonProps {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    editing?: boolean;
}
const SubmitButton = ({ onClick, editing }: SubmitButtonProps) => {
    const status = useFormStatus();
    if (editing && !status.pending) {
        return <></>;
    }
    return (
        <button onClick={onClick} type="submit" disabled={status.pending}>
            {status.pending ? "Processing..." : "Add Item"}
        </button>
    );
};

interface NewTaskProps {
    editing: boolean;
    onBlur?: () => void;
}
const NewTask = ({ editing, onBlur }: NewTaskProps) => {
    const { pending } = useFormStatus();
    if (editing) {
        return (
            <input
                className={`${styles.todo_item}`}
                onBlur={onBlur}
                autoFocus
                disabled={pending}
                type="text"
                name="new-item"
            />
        );
    } else {
        return <></>;
    }
};

interface Props {
    items: Item[];
}
export default function Todo({ items: _items }: Props) {
    const [items, setItems] = useState<Item[]>(_items);
    const [editing, setEditing] = useState<boolean>(false);
    const handleSubmit = async (data: FormData) => {
        const new_item = await addItem(data);
        if (!new_item) {
            return;
        }
        setItems((old) => [...old, new_item]);
    };
    const handleDeleteItem = (id: number) => {
        setItems(old => old.filter(v => v.id != id));
    }
    return (
        <div className="w-[20rem] flex flex-col gap-[0.5rem]">
            {items.map((item) => (
                <div key={`item-${item.id}`} className={`${styles.todo_item}`}>
                    <p className="">{item.title}</p>
                    <CompleteInput onDelete={handleDeleteItem} id={item.id} completed={item.completed} />
                </div>
            ))}
            <form action={handleSubmit} className="w-full">
                <NewTask
                    editing={editing}
                    onBlur={() => {
                        setEditing(false);
                    }}
                />

                <SubmitButton
                    editing={editing}
                    onClick={(e) => {
                        e.preventDefault();
                        setEditing(true);
                    }}
                />
            </form>
        </div>
    );
}
