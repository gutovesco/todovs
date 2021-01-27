<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";

    export let user: User;
    export let accessToken: string;
    let text = "";
    let todos: Array<{ text: string; completed: boolean, id: number }> = [];

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "new-todo":
                    console.log(message);
                    break;
            }
        });
        const response = await fetch(`${apiBaseUrl}/todo`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        todos = payload.todos;
        tsvscode.postMessage({ type: "get-token", value: undefined });
    });
</script>

<div>Hello: {user.name}</div>

<form
    on:submit|preventDefault={async () => {
        const response = await fetch(`${apiBaseUrl}/todo`, {
            method: "POSt",
            body: JSON.stringify({
                text,
            }),
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const { todo } = await response.json();
        todos = [todo, ...todos];
        text = "";
    }}
>
    <input bind:value={text} type="text" />
    <button type="submit">Add todo</button>
</form>

<ul>
    {#each todos as todo (todo.id)}
        <li
            class:complete={todo.completed}
            on:click={() => {
                todo.completed = !todo.completed;
            }}
        >
            {todo.text}
        </li>
    {/each}
</ul>

<style>
    .complete {
        text-decoration: line-through;
        cursor: pointer;
    }
    .complete:hover {
        color: deepskyblue;
    }
</style>
