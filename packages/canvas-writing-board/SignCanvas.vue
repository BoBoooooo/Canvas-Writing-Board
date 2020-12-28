<!--
 * @file: CanvasWritingBoard
 * @copyright: CanvasWritingBoard
 * @author: BoBo
 * @Date: 2020年11月10 14:32:04
-->
<template>
  <canvas
    :ref="domId"
    class="canvas-writing-board"
    :id="domId"
    @mousedown.prevent.stop="handleMousedown"
    @mousemove.prevent.stop="handleMousemove"
    @mouseup.prevent.stop="handleMouseup"
    @mouseleave.prevent.stop="handleMouseleave"
  >
    您的浏览器不支持canvas技术,请升级浏览器!
  </canvas>
</template>
<script>
const Pressure = require("pressure");

export default {
  name: "SignCanvas",
  model: {
    value: "image",
    event: "confirm",
  },
  props: {
    image: {
      required: false,
      type: [String],
      default: null,
    },

    options: {
      // 配置项
      required: false,
      type: [Object],
      default: () => null,
    },
  },
  data() {
    return {
      value: null, // base64
      domId: `sign-canvas-${Math.random()
        .toString(36)
        .substr(2)}`, // 生成唯一dom标识
      canvas: null, // canvas dom对象
      context: null, // canvas 画布对象
      dpr: 1,
      pointerType: "mouse",
      config: {
        lastWriteSpeed: 1, // 书写速度 [Number] 可选
        lastWriteWidth: 2, // 下笔的宽度 [Number] 可选
        lineCap: "round", // 线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]正方形线帽
        lineJoin: "round", // 线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
        canvasWidth: 600, // canvas宽高 [Number] 可选
        canvasHeight: 600, // 高度  [Number] 可选
        isShowBorder: true, // 是否显示边框 [可选]
        bgColor: "#fcc", // 背景色 [String] 可选 注:这背景色仅仅只是canvas背景,保存的图片仍然是透明的
        borderWidth: 1, // 网格线宽度  [Number] 可选
        borderColor: "#ff787f", // 网格颜色  [String] 可选
        writeWidth: 10, // 基础轨迹宽度  [Number] 可选
        maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
        minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
        writeColor: "#101010", // 轨迹颜色  [String] 可选
        imgType: "png", // 下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
      },
    };
  },
  mounted() {
    this.init();
    const that = this;
    Pressure.set(`#${this.domId}`, {
      change(force, event) {
        // 兼容压感设备,基于浏览器pointerEvent事件
        // 动态修改笔画宽度实现压感
        if (event.pointerType !== "mouse") {
          that.pointerType = event.pointerType;
          that.setLineWidth(that.config.writeWidth * that.dpr * event.pressure);
        }
      },
    });
  },

  watch: {
    options: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },

  methods: {
    init() {
      const { options } = this;
      if (options) {
        // eslint-disable-next-line guard-for-in
        for (const key in options) {
          this.config[key] = options[key];
        }
      }
      this.dpr =
        typeof window !== "undefined"
          ? window.devicePixelRatio ||
            window.webkitDevicePixelRatio ||
            window.mozDevicePixelRatio ||
            1
          : 1;
      this.canvas = document.getElementById(this.domId);
      this.context = this.canvas.getContext("2d");
      this.canvas.style.background = this.config.bgColor;
      this.canvas.height = this.config.canvasWidth;
      this.canvas.width = this.config.canvasHeight;
      this.canvasInit();
      this.canvasClear();
    },

    /**
     * 轨迹宽度
     */
    setLineWidth(width) {
      if (width) {
        this.context.lineWidth = width;
        return;
      }
      const nowTime = new Date().getTime();
      const diffTime = nowTime - this.config.lastWriteTime;
      this.config.lastWriteTime = nowTime;
      let returnNum =
        this.config.minWriteWidth +
        ((this.config.maxWriteWidth - this.config.minWriteWidth) * diffTime) /
          30;
      if (returnNum < this.config.minWriteWidth) {
        returnNum = this.config.minWriteWidth;
      } else if (returnNum > this.config.maxWriteWidth) {
        returnNum = this.config.maxWriteWidth;
      }
      returnNum = returnNum.toFixed(2);
      // 写字模式和签名模式
      this.context.lineWidth = this.config.writeWidth * this.dpr;
    },

    /**
     * 写开始
     */
    writeBegin(point) {
      this.config.isWrite = true;
      this.config.lastWriteTime = new Date().getTime();
      this.config.lastPoint = point;
      this.writeContextStyle();
    },

    /**
     * 绘制轨迹
     */
    writing(point) {
      this.context.beginPath();
      this.context.moveTo(
        this.config.lastPoint.x * this.dpr,
        this.config.lastPoint.y * this.dpr
      );
      this.context.lineTo(point.x * this.dpr, point.y * this.dpr);
      if (this.pointerType === "mouse") {
        this.setLineWidth();
      }
      this.context.stroke();
      this.config.lastPoint = point;
      this.context.closePath();
    },

    /**
     * 写结束
     */
    writeEnd(point) {
      this.config.isWrite = false;
      this.config.lastPoint = point;
      this.saveAsImg();
    },

    /**
     * 轨迹样式
     */
    writeContextStyle() {
      this.context.beginPath();
      this.context.strokeStyle = this.config.writeColor;
      this.context.lineCap = this.config.lineCap;
      this.context.lineJoin = this.config.lineJoin;
    },

    /**
     * 清空画板
     */
    canvasClear() {
      this.context.save();
      this.context.strokeStyle = this.config.writeColor;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.beginPath();
      this.context.lineWidth = this.config.borderWidth * this.dpr;
      this.context.strokeStyle = this.config.borderColor;
      const size = (this.config.borderWidth / 2) * this.dpr;
      if (this.config.isShowBorder) {
        // 画外面的框
        this.context.moveTo(size, size);
        this.context.lineTo(this.canvas.width - size, size);
        this.context.lineTo(
          this.canvas.width - size,
          this.canvas.height - size
        );
        this.context.lineTo(size, this.canvas.height - size);
        this.context.closePath();
        this.context.stroke();
      }
      this.$emit("confirm", null);
      this.context.restore();
    },

    /**
     *  保存图片 格式base64
     */
    saveAsImg() {
      const image = new Image();
      image.src = this.canvas.toDataURL(`image/${this.config.imgType}`);
      this.$emit("confirm", image.src);
      return image.src;
    },

    /**
     * 初始化画板
     */
    canvasInit() {
      this.canvas.width = this.config.canvasWidth * this.dpr;
      this.canvas.height = this.config.canvasHeight * this.dpr;
      this.canvas.style.width = `${this.config.canvasWidth}px`;
      this.canvas.style.height = `${this.config.canvasHeight}px`;
      this.config.emptyCanvas = this.canvas.toDataURL(
        `image/${this.config.imgType}`
      );
    },

    /**
     * 鼠标按下 => 下笔
     */
    handleMousedown(e) {
      this.writeBegin({ x: e.offsetX || e.clientX, y: e.offsetY || e.clientY });
    },

    /**
     * 书写过程 => 下笔书写
     */
    handleMousemove(e) {
      this.config.isWrite && this.writing({ x: e.offsetX, y: e.offsetY });
    },

    /**
     * 鼠标松开 => 提笔
     */
    handleMouseup(e) {
      this.writeEnd({ x: e.offsetX, y: e.offsetY });
    },

    /**
     * 离开书写区域 => 提笔离开
     */
    handleMouseleave(e) {
      this.config.isWrite = false;
      this.config.lastPoint = { x: e.offsetX, y: e.offsetY };
    },
    /**
     * 导出canvas到本地
     */
    downloadSignImg(name) {
      const c = document.getElementById(this.domId);
      const dataURL = c.toDataURL("image/png");
      this.saveFile(
        dataURL,
        name
          ? `${name}.${this.config.imgType}`
          : `${Date.parse(new Date())}.${this.config.imgType}`
      );
    },

    /**
     * 保存文件
     */
    saveFile(data, filename) {
      const saveLink = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      saveLink.href = data;
      saveLink.download = filename;
      const event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      saveLink.dispatchEvent(event);
    },

    /**
     * 获取画布的元素的大小及其相对于视口的位置
     * @return {}
     */
    getRect() {
      return this.$refs[this.domId].getBoundingClientRect();
    },

    /**
     * 获取dom对象的偏移量 可以获取解决position定位的问题
     * @returns number
     */
    offset(obj, direction) {
      // 将top,left首字母大写,并拼接成offsetTop,offsetLeft
      const offsetDir = `offset${direction[0].toUpperCase()}${direction.substring(
        1
      )}`;
      let realNum = obj[offsetDir];
      let positionParent = obj.offsetParent; // 获取上一级定位元素对象
      while (positionParent != null) {
        realNum += positionParent[offsetDir];
        positionParent = positionParent.offsetParent;
      }
      return realNum;
    },
  },
};
</script>
