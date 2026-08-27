import './style.css'

import Alpine from 'alpinejs'
import HMMO from './hmmo'
import html from "./hmmo.html?raw" with { type: "text" };

Alpine.data('HMMO', HMMO)
Alpine.start()


document.querySelector<HTMLDivElement>('#app')!.innerHTML = html

