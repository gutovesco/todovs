<script lang="ts">
    import { onMount } from "svelte";

    let todos: Array<{ text: string; completed: boolean }> = [];
    let text = "";

    onMount(() => {
        window.addEventListener("message", (event) => {
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

<div>Hello sidebar</div>

<form
    on:submit|preventDefault={() => {
        todos = [{ text, completed: false }, ...todos];
        text = '';
    }}>
    <input bind:value={text} type="text" />
    <button type="submit">Add todo</button>
</form>

<ul>
    {#each todos as todo (todo.text)}
        <li
            class:complete={todo.completed}
            on:click={() => {
                todo.completed = !todo.completed;
            }}>
            {todo.text}
        </li>
    {/each}
</ul>

<button
    on:click={() => {
        tsvscode.postMessage({
            type: 'onInfo',
            value: '🐛  on line, info message ',
        });
    }}>info</button>
