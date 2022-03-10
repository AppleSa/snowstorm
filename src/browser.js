import vscode from './vscode_extension'

if (!vscode) {
    window.onbeforeunload = function() {
        return '您的更改可能不会保存';
    }

    async function registerSW() {
        try {
            await navigator.serviceWorker.register('./service_worker.js');
        } catch (err) {
            console.log(err)
        }
	}
    if ('serviceWorker' in navigator) {
        registerSW();
    }
}
