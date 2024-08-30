<script lang="ts">
	import { provideVSCodeDesignSystem, allComponents } from "@vscode/webview-ui-toolkit";
	import { vscode } from "./utilities/vscode";
	
	provideVSCodeDesignSystem().register(allComponents);

	function handleHowdyClick() {
		vscode.postMessage({
			command: "hello",
			text: "Hey there partner! 🤠",
		});
	}
</script>

<main>
	<h1>Hello world!</h1>
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
