# canvas-writing-board

## 开始使用

```javascript
import CanvasWritingBoard from 'canvas-writing-board'
import 'canvas-writing-board/lib/canvas-writing-board.css';
<CanvasWritingBoard @save="(base64)=>{console.log(base64)}" :title="手写签字版">
<button slot="button">自定义按钮</button>
</CanvasWritingBoard>
```

## 效果展示

![](./assets/demo.png)

## props

:title="手写签字版"

## event

@save="(base64)=>{}"

## slot
button