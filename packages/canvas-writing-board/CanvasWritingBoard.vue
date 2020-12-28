<template>
  <div class="canvas-container">
    <h1 class="title">
      {{ title }}
    </h1>
    <div class="config">
      <el-form size="mini" inline label-position="left">
        <el-form-item label="显示边框">
          <el-select name="isShowBorder" v-model="options.isShowBorder">
            <el-option label="显示" :value="true"></el-option>
            <el-option label="不显示" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="边框宽度">
          <el-input-number v-model="options.borderWidth" />
        </el-form-item>
        <el-form-item label="笔画宽度">
          <el-input-number v-model="options.writeWidth" />
        </el-form-item>
        <!-- <el-form-item label="图片类型">
          <el-input v-model="options.imgType" />
        </el-form-item> -->
        <el-form-item label="笔画样式">
          <el-select name="isSign" size="mini" v-model="options.lineCap">
            <el-option label="平直" value="butt"></el-option>
            <el-option label="圆形" value="round"></el-option>
            <el-option label="正方形" value="square"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="线条交汇样式">
          <el-select name="isSign" v-model="options.lineJoin">
            <el-option label="斜角" value="bevel"></el-option>
            <el-option label="圆角" value="round"></el-option>
            <el-option label="尖角" value="miter"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="画笔颜色">
          <el-color-picker v-model="options.writeColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="背景色">
          <el-color-picker v-model="options.bgColor"></el-color-picker>
        </el-form-item>
      </el-form>
    </div>
    <sign-canvas
      class="sign-canvas"
      ref="SignCanvas"
      :options="options"
      v-model="value"
    />
    <div class="btn-container">
      <el-button class="action-btns" size="mini" @click="canvasClear()"
        >清空</el-button
      >
      <el-button
        class="action-btns"
        size="mini"
        @click="saveAsImg()"
        type="primary"
        >保存</el-button
      >
      <el-button
        class="action-btns"
        size="mini"
        @click="downloadSignImg()"
        type="success"
        >导出</el-button
      >
          <slot name="button" class="action-btns"></slot>

    </div>

  </div>
</template>
<script>
import SignCanvas from "./SignCanvas.vue";
import {
  Button,
  Select,
  Row,
  Input,
  Col,
  Form,
  FormItem,
  Option,
  InputNumber,
  ColorPicker,
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

export default {
  name: "CanvasWritingBoard",
  components: {
    SignCanvas,
    [Button.name]: Button,
    [Select.name]: Select,
    [Row.name]: Button,
    [Input.name]: Input,
    [Col.name]: Col,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Option.name]: Option,
    [InputNumber.name]: InputNumber,
    [ColorPicker.name]: ColorPicker,
  },
  props: {
    title: {
      type: String,
      default: "手写签字板",
    },
  },
  data() {
    return {
      value: null,
      options: {
        lastWriteSpeed: 1, // 书写速度 [Number] 可选
        lastWriteWidth: 2, // 下笔的宽度 [Number] 可选
        lineCap: "round", // 线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]正方形线帽
        lineJoin: "bevel", // 线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
        canvasWidth: 1280, // canvas宽高 [Number] 可选
        canvasHeight: 320, // 高度  [Number] 可选
        isShowBorder: false, // 是否显示边框 [可选]
        bgColor: "#e6e6e6", // 背景色 [String] 可选
        borderWidth: 1, // 网格线宽度  [Number] 可选
        borderColor: "#ff787f", // 网格颜色  [String] 可选
        writeWidth: 8, // 基础轨迹宽度  [Number] 可选
        maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
        minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
        writeColor: "#101010", // 轨迹颜色  [String] 可选
        isSign: true, // 签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
        imgType: "png", // 下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
      },
    };
  },
  methods: {
    /**
     * 清除画板
     */
    canvasClear() {
      this.$refs.SignCanvas.canvasClear();
    },

    /**
     * 保存图片
     */
    saveAsImg() {
      const img = this.$refs.SignCanvas.saveAsImg();
      this.$emit("save", img);
    },

    /**
     * 下载图片
     */
    downloadSignImg() {
      this.$refs.SignCanvas.downloadSignImg();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
