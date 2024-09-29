<script lang="ts">
    import {provideVSCodeDesignSystem, allComponents} from "@vscode/webview-ui-toolkit";

    provideVSCodeDesignSystem().register(allComponents);

    export let fields: Object;

    export let isEditing: boolean;

    let addingItem = false;
    let editingKey: any = "";

    let newEditKey: any = "";
    let newEditValue: any = "";

    let newAddKey: any = "";
    let newAddValue: any = "";

    function newItemField(): void {
        addingItem = true;
        editingKey = "";
    }

    function saveAddItem(): void {
        fields = {...fields, [newAddKey]: newAddValue};
        newAddKey = "";
        newAddValue = "";
        addingItem = false;
    }

    function saveExistingItem(): void {
        if (newEditKey != editingKey) {
            delete fields[editingKey as keyof Object];
        }
        fields = {...fields, [newEditKey]: newEditValue};
        newEditKey = "";
        newEditValue = "";
        editingKey = "";
    }

    function cancelAddItem(): void {
        addingItem = false;
        newAddKey = "";
        newAddValue = "";
    }

    function cancelExistingItem(): void {
        editingKey = null;
    }

    function handleEdit(key: any, value: any): void {
        if (!isEditing) {
            return;
        }
        addingItem = false;
        editingKey = key;
        newEditKey = key;
        newEditValue = value;
    }

    function handleKeypressOnAdding(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            saveAddItem();
        }
        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            console.log("Escape");
            cancelAddItem();
        }
    }

    function handleEditKeyInput(event: InputEvent): void {
        const target = event.target as HTMLInputElement;
        newEditKey = target.value;
    }

    function handleEditValueInput(event: InputEvent): void {
        const target = event.target as HTMLInputElement;
        newEditValue = target.value;
    }

    function handleAddKeyInput(event: InputEvent): void {
        const target = event.target as HTMLInputElement;
        newAddKey = target.value;
    }

    function handleAddValueInput(event: InputEvent): void {
        const target = event.target as HTMLInputElement;
        newAddValue = target.value;
    }
</script>

{#each Object.entries(fields) as [key, value]}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <vscode-data-grid-row id={key}>
        <vscode-data-grid-cell grid-column="1">
            <vscode-text-field
                readonly={!isEditing}
                value={key}
                on:focus={() => handleEdit(key, value)}
                on:input={handleEditKeyInput}
            ></vscode-text-field>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
            <vscode-text-field
                readonly={!isEditing}
                {value}
                on:focus={() => handleEdit(key, value)}
                on:input={handleEditValueInput}
            ></vscode-text-field>
            {#if editingKey === key}
                <vscode-button
                    appearance="primary"
                    class="add-item-button"
                    aria-label="Save Item"
                    on:click={saveExistingItem}>✔️</vscode-button
                >
                <vscode-button
                    appearance="secondary"
                    class="add-item-button cancel-button"
                    aria-label="Cancel Editing Item"
                    on:click={cancelExistingItem}>✖️</vscode-button
                >
            {/if}
        </vscode-data-grid-cell>
    </vscode-data-grid-row>
{/each}
{#if addingItem}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1">
            <vscode-text-field
                value={newAddKey}
                on:input={handleAddKeyInput}
                on:keydown={handleKeypressOnAdding}
            ></vscode-text-field>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
            <vscode-text-field
                value={newAddValue}
                on:input={handleAddValueInput}
                on:keydown={handleKeypressOnAdding}
            ></vscode-text-field>
            <vscode-button
                appearance="primary"
                class="add-item-button"
                aria-label="Save Item"
                on:click={saveAddItem}>✔️</vscode-button
            >
            <vscode-button
                appearance="secondary"
                class="add-item-button cancel-button"
                aria-label="Cancel Item"
                on:click={cancelAddItem}>✖️</vscode-button
            >
        </vscode-data-grid-cell>
    </vscode-data-grid-row>
{/if}
{#if !addingItem}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <vscode-button disabled={!isEditing} appearance="primary" aria-label="Add Item" on:click={newItemField}
        >Add Item</vscode-button
    >
{/if}

<style>
    vscode-text-field {
        width: 100%;
    }
    vscode-button {
        margin: 0px 5px;
    }
    vscode-data-grid-cell {
        display: flex;
        gap: 10px;
        width: 100%;
    }
    .add-item-button {
        margin: 0;
        height: 25px;
    }
</style>
