import {createCanvas} from '@napi-rs/canvas';
import {writeFileSync} from 'node:fs';
const canvas=createCanvas(64,64), ctx=canvas.getContext('2d');
ctx.fillStyle='#4265e8';ctx.fillRect(0,0,64,64);
ctx.fillStyle='#ffffff';ctx.font='bold 32px Arial';ctx.fillText('hp.',8,43);
writeFileSync('public/icon.png',canvas.toBuffer('image/png'));
