<template>
  <div
    class="txt"
    contenteditable="false"
    :style="{
      position: val.belong === 'page' ? 'absolute' : 'relative',
      left: val.belong === 'page' ? val.left / w * 100 + '%' : '0',
      top: val.belong === 'page' ? val.top / h * 100 + '%' : '0',
      width: val.width / w * 100 + '%',
      minHeight: val.height / h * 100 + '%',
      zIndex: val.z,
      lineHeight: val.height + 'px',
      fontSize: val.fontSize + 'px',
      fontFamily: val.fontFamily,
      letterSpacing: val.fontSpacing + 'px',
      color: val.color,
      textAlign: val.textAlign,
      fontWeight: val.fontWeight ? 'bold': 'normal'
    }">
    <div class="lay-cont"></div>
    <h3
      class="txt-title"
      contenteditable="false">
    </h3>
    <div class="txt-cont"><span contenteditable="false" class="txt-pre">￥</span>
      <span  contenteditable="false" class="txt-txt">231,456</span>
      <span contenteditable="false" class="txt-follow">元</span></div>
  </div>
</template>

<script>
    import stylec from './style.vue'

    const WIDGET_NAME = 'BasicNumberBox'

    export default {
        name: WIDGET_NAME,
        group: 'text',
        icon: require('./icon/thumb-number.png'),
        title: '翻牌器',
        panel: stylec,
        setting: {
            type: WIDGET_NAME,
            isContainer: false,
            isUpload: false,
            hasGuide: true,
            isChild: true,
            dragable: true,
            resizable: true,
            width: 250,
            height: 60,
            left: 400,
            top: 400,
            z: 0,
            tTitleLineHeight: 18,
            tTitleFontSize: 20,
            tTitleFontFamily: 'Microsoft YaHei',
            tTitleFontWeight: false,
            tTitleFontSpacing: 0,
            tTitleColor: '#000000',
            tMsg: '翻牌器标题',


            tMsgLineHeight: 40,
            tMsgFontSize: 38,
            tMsgFontFamily: 'Microsoft YaHei',
            tMsgFontWeight: false,
            tMsgFontSpacing: 0,
            tMsgColor: '#000000',
            tMsg: '231,456',

            name: '翻牌器', // 组件名称, 可自定义
            desc: '', // 描述, 可自定义
            href: '',
            belong: 'page',
            animationName: ''
        },
        // 属性含义参照 widgets/pic/index.vue
        props: ['val', 'h', 'w']
    }
</script>

<style scoped>

  .txt-title {
    color: rgb(183, 183, 183);
    font-size: 18px;
    font-family: "Microsoft YaHei";
    line-height: 40px;
    letter-spacing: 0px;
    font-weight: normal;
  }
  .txt-pre {
    color: rgb(238, 238, 238);
    font-size: 28px;
    font-family: "Microsoft YaHei";
    font-weight: normal;
  }
  .txt-txt {
    color: rgb(71, 175, 243);
    font-size: 38px;
    font-family: "Microsoft YaHei";
    line-height: 40px;
    letter-spacing: 0px;
    font-style: normal;
    font-weight: bold;
  }
  .txt-follow {
    color: rgb(238, 238, 238);
    font-size: 28px;
    font-family: "Microsoft YaHei";
    font-weight: normal;
  }
</style>
