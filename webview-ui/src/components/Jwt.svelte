<script lang="ts">
    import type { JWTEditorState } from "../../../src/common/jwt";
    import {vscode} from "../utilities/vscode";
    import TableFields from "./TableFields.svelte";
    import {provideVSCodeDesignSystem, allComponents} from "@vscode/webview-ui-toolkit";

    provideVSCodeDesignSystem().register(allComponents);

    export let jwtEditorState: JWTEditorState;

    $: console.log(`the jwtEditorState is updated ${jwtEditorState}`);

    $: header = {...jwtEditorState.parsedToken?.header};
    $: headerExtraFields = (({alg, typ, ...fields}) => fields)(header);
    $: payload = {...jwtEditorState.parsedToken?.payload};

    // Two types of signatures - one for verification and one for signing
    let pubKey = "";
    let privKey = "";

    function handlePubKeyInput(event: InputEvent): void {
        const target = event.target as HTMLInputElement;
        pubKey = target.value;
        vscode.postMessage({
            command: "updatePubkey",
            key: pubKey,
        });
    }

    function handlePrivKeyInput(event: InputEvent): void {
        const target = event.target as HTMLInputElement;
        privKey = target.value;
        vscode.postMessage({
            command: "updatePrivkey",
            key: privKey,
        });
    }
</script>

<div class="jwt-fields">
    <vscode-text-area readonly={!jwtEditorState.isEditable} value={jwtEditorState.resultingToken}>
        <h3>Token</h3>
    </vscode-text-area>
    <h3 class="table-header">
        Header
        {#if !jwtEditorState.isEditable}
            <span><vscode-tag>Readonly till providing sign signaure</vscode-tag></span>
        {/if}
    </h3>
    <vscode-divider></vscode-divider>
    <vscode-data-grid aria-label="Header">
        <vscode-data-grid-row id={"alg"}>
            <vscode-data-grid-cell grid-column="1">Algorithm</vscode-data-grid-cell>
            <vscode-data-grid-cell grid-column="2">
                <vscode-dropdown disabled={!jwtEditorState.isEditable}>
                    <vscode-option>{header.alg}</vscode-option>
                </vscode-dropdown>
            </vscode-data-grid-cell>
        </vscode-data-grid-row>
        <vscode-data-grid-row id={"typ"}>
            <vscode-data-grid-cell grid-column="1">Token type</vscode-data-grid-cell>
            <vscode-data-grid-cell grid-column="2">{header.typ}</vscode-data-grid-cell>
        </vscode-data-grid-row>
        <TableFields bind:isEditing={jwtEditorState.isEditable} bind:fields={headerExtraFields} />
    </vscode-data-grid>
    <!-- Payload -->
    <h3 class="table-header">
        Payload
        {#if !jwtEditorState.isEditable}
            <span><vscode-tag>Readonly till providing sign signaure</vscode-tag></span>
        {/if}
    </h3>
    <vscode-divider></vscode-divider>
    <vscode-data-grid aria-label="Payload">
        <TableFields  bind:isEditing={jwtEditorState.isEditable} bind:fields={payload} />
    </vscode-data-grid>
    <!-- Section for symmetric encryption -->
    {#if jwtEditorState.isSymmetric}
        <vscode-text-area value={pubKey} on:input={handlePubKeyInput}>
            <h3>Secret (verification)</h3>
        </vscode-text-area>
        <vscode-text-area value={privKey} on:input={handlePrivKeyInput}>
            <h3>
                Secret (creation)
                {#if !jwtEditorState.isPrivKeyValid}
                    <vscode-tag>Not valid for signature</vscode-tag>
                {/if}
            </h3>
        </vscode-text-area>
    {/if}
    <!-- Section for asymmetric encryption -->
    {#if jwtEditorState.isAsymmetric}
        <vscode-text-area value={pubKey} on:input={handlePubKeyInput}>
            <h3>Public Key (verification)</h3>
        </vscode-text-area>
        <vscode-text-area value={privKey} on:input={handlePrivKeyInput}>
            <h3>
                Private Key (creation)
                {#if !jwtEditorState.isPrivKeyValid}
                    <vscode-tag>Not valid for signature</vscode-tag>
                {/if}
            </h3>
        </vscode-text-area>
    {/if}
</div>

<style>
    .jwt-fields {
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 60%;
    }
    .table-header {
        margin-bottom: 5px;
    }
    vscode-data-grid-cell {
        display: flex;
        gap: 10px;
    }
    @media screen and (max-width: 1200px) {
        .jwt-fields {
            max-width: 80%;
        }
    }
    @media screen and (max-width: 640px) {
        .jwt-fields {
            max-width: 100%;
        }
    }
</style>
