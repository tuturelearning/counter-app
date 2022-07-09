import './style.css'
import {app, invoke} from '@tauri-apps/api'
import {listen, Event} from '@tauri-apps/api/event';

document.addEventListener('DOMContentLoaded', async () => {
    // hello invoke
    const appContent = document.querySelector.bind(document)('#app')! as HTMLElement;
    appContent.addEventListener('pointerup', async () => {
        const ret = (await invoke('hello')) as string;
        appContent.textContent = ret;
        setTimeout(() => {
            appContent.textContent = 'Again';   
        }, 1000);
    });

    // counter
    const addCounter = document.querySelector.bind(document)('button')! as HTMLElement;
    const counterNumber = document.querySelector.bind(document)('counter-number')! as HTMLElement;

    addCounter.addEventListener('pointerup', async () => {
        const ret = await invoke('counter_add', {n: 2}) as string;
        counterNumber.textContent = ret;
    });

    // keep alive
    const keepAlive = document.querySelector.bind(document)(
        'keep-alive'
    )! as HTMLElement;

    listen('keep-alive', (_: Event<any>) => {
        keepAlive.classList.add('on');

        setTimeout(() => {
            keepAlive.classList.remove('on');
        }, 500)
    })
});