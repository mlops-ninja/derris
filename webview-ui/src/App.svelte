<script lang="ts">
  import Jwt from "./components/Jwt.svelte";
    import { JWTEditorState } from "../../src/common/jwt";
  import { vscode } from "./utilities/vscode";
  import { onMount } from "svelte";

  // TODO: change this to get actual file type
  let fileType = "jwt"

  $: jwtData = new JWTEditorState();

  onMount(() => {
    console.log("Component mounted");
    vscode.postMessage({
      command: "init-view",
      text: "Hello from the webview!",
    });
  });

  function windowMessage(event: MessageEvent): void {
    console.log("Received message from extension", event.data);
    switch (event.data.type) {
      case "init":
        // jwtData.updateWithTokenAndParsedToken(event.data.payload.tokenState.resultingToken, event.data.payload.tokenState.parsedToken);
        // jwtData = jwtData;
        jwtData = new JWTEditorState(event.data.payload.tokenState.resultingToken, event.data.payload.tokenState.parsedToken);
        break;
    }
  }
</script>

<svelte:window on:message={windowMessage}/>
<main>
  {#if fileType === "jwt"}
    <h1>JSON web token</h1>
    <Jwt bind:jwtEditorState={jwtData}/>
  {/if}
</main>

<style>
  main {
    height: 100%;
  }
</style>