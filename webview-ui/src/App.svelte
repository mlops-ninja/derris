<script lang="ts">
  import { provideVSCodeDesignSystem, allComponents } from "@vscode/webview-ui-toolkit";
  import { vscode } from "./utilities/vscode";
  import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";

  provideVSCodeDesignSystem().register(allComponents);

  let count = 0;

  let jwtData = '';

  onMount(() => {
    console.log("Component mounted");
    vscode.postMessage({
      command: "init-view",
      text: "Hello from the webview!",
    });
  });

  function increment() {
    count += 1;
  }

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  function windowMessage(event: MessageEvent): void {
    console.log("Received message from extension", event.data);
    switch (event.data.type) {
      case "init":
        jwtData = event.data.text;
        break;
    }
  }
</script>

<svelte:window on:message={windowMessage}/>
<main>
  <h1>Hello world!</h1>
  <h2>{count}</h2>
  <p>{jwtData}</p>
  <vscode-button on:click={increment}>Increment</vscode-button>
  <vscode-button on:click={handleHowdyClick}>Howdy!</vscode-button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
  }
</style>
