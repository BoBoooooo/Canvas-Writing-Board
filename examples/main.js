import Vue from 'vue'
import App from './App.vue'
// import CanvasWritingBoard from '../packages/index';
import CanvasWritingBoard from 'canvas-writing-board'
import 'canvas-writing-board/lib/canvas-writing-board.css';
Vue.use(CanvasWritingBoard)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
