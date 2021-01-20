<script lang="ts">
    import { onMount } from "svelte";

    let todos: Array<{ text: string; completed: boolean }> = [];
    let text = "";
    let loading = true;
    let user: { name: string; id: number } | null = null;

    onMount(async () => {
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
        console.log(accessToken)
        const response = await fetch(`${apiBaseUrl}/me`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        });
        
        const data = await response.json();
        console.log(data)
        user = data.user;
        loading = false;
    });
</script>

{#if loading}
    <div>Loading...</div>
{:else if user}
    <pre>{JSON.stringify(user, null, 2)}</pre>
{:else}
    <div>No user is logged in</div>
{/if}

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

<button
    on:click={() => {
        tsvscode.postMessage({
            type: "onInfo",
            value: "🐛  on line, info message ",
        });
    }}>info</button
>

<style>
    .complete {
        text-decoration: line-through;
        cursor: pointer;
    }
    .complete:hover {
        color: deepskyblue;
    }
</style>
