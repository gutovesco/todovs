<script lang="ts">
    import { onMount } from "svelte";
import type { User } from "../types";

    export let user: User;
    let text = "";
    let todos: Array<{ text: string; completed: boolean }> = [];

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "new-todo":
                    todos = [
                        { text: message.value, completed: false },
                        ...todos,
                    ];
                    break;
            }
        });
        tsvscode.postMessage({ type: "get-token", value: undefined });
    });
</script>

<style>
    .complete {
        text-decoration: line-through;
        cursor: pointer;
    }
    .complete:hover {
        color: deepskyblue;
    }
</style>

<div>Hello: {user.name}</div>

<form
    on:submit|preventDefault={() => {
        todos = [{ text, completed: false }, ...todos];
        text = "";
    }}
>
    <input bind:value={text} type="text" />
    <button type="submit">Add todo</button>
</form>

<ul>
    {#each todos as todo (todo.text)}
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