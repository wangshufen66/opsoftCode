<template>
  <div>
    <div v-show="tab === 1">
      <!-- 基础设置 -->
      <basic-settings :activeElement="activeElement"/>
      <div class="panel-item-new">
        <div class="panel-item-title">全局配置<i class="panel-title-arrow el-icon-caret-bottom"></i></div>
        <div class="panel-item-new-set">
          <div flex="" class="panel-row">
            <div class="panel-label">对齐</div>
            <div class="panel-value">
              <select v-model="activeElement.textAlign">
                <option value="left">左对齐</option>
                <option value="center">居中</option>
                <option value="right">右对齐</option>
              </select>
            </div>
          </div>
          <div flex="" class="panel-row">
            <div class="panel-label">排列方式</div>
            <div class="panel-value">
              <select v-model="activeElement.flex">
                <option value="column">标题在上</option>
                <option value="column-reverse">标题在下</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-item-new">
        <div class="panel-item-title">标题配置<i class="panel-title-arrow el-icon-caret-bottom"></i></div>
        <div class="panel-item-new-set">
          <div flex="" class="panel-row">
            <div class="panel-label">文本内容</div>
            <div>
              <input
                v-model="activeElement.tTitle"
                type="text">
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">字号</div>
            <div>
              <input
                v-model="activeElement.tTitleFontSize"
                type="number">
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">字体</div>
            <div class="panel-value">
              <select v-model="activeElement.tTitleFontFamily">
                <option value="Arial">Arial</option>
                <option value="sans-serif">sans-serif</option>
                <option value="Microsoft YaHei">微软雅黑</option>
                <option value="Microsoft JhengHei">微软正黑体</option>
                <option value="ZZGF">造字工房朗宋常规体</option>
                <option value="SimHei">黑体</option>
                <option value="Hiragino Sans GB">Hiragino Sans GB</option>
                <option value="SimSun">宋体</option>
                <option value="FangSong">仿宋</option>
                <option value="PMingLiU">新细明体</option>
                <option value="KaiTi">楷体</option>
                <option value="DFKai-SB">标楷体</option>
              </select>
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">颜色</div>
            <div class="panel-value">{{ activeElement.tTitleColor }}</div>
            <div>
              <input type="color" v-model="activeElement.tTitleColor">
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">行高</div>
            <div>
              <input
                v-model="activeElement.tTitleLineHeight"
                type="number">
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">加粗</div>
            <div class="panel-value">
              <label class="form-switch">
                <input type="checkbox" v-model="activeElement.tTitleFontWeight">
                <i class="form-icon"></i>
              </label>
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">字间距</div>
            <div>
              <input
                v-model="activeElement.tTitleFontSpacing"
                type="number">
            </div>
          </div>
        </div>
      </div>

      <div class="panel-item-new">
        <div class="panel-item-title">数据配置<i class="panel-title-arrow el-icon-caret-bottom"></i></div>
        <div class="panel-item-new-set">
          <div flex="" class="panel-row">
            <div class="panel-label">文本内容</div>
            <div>
              <input
                v-model="activeElement.tMsg"
                type="text">
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">字号</div>
            <div>
              <input
                v-model="activeElement.tMsgFontSize"
                type="number">
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">字体</div>
            <div class="panel-value">
              <select v-model="activeElement.tMsgFontFamily">
                <option value="Arial">Arial</option>
                <option value="sans-serif">sans-serif</option>
                <option value="Microsoft YaHei">微软雅黑</option>
                <option value="Microsoft JhengHei">微软正黑体</option>
                <option value="ZZGF">造字工房朗宋常规体</option>
                <option value="SimHei">黑体</option>
                <option value="Hiragino Sans GB">Hiragino Sans GB</option>
                <option value="SimSun">宋体</option>
                <option value="FangSong">仿宋</option>
                <option value="PMingLiU">新细明体</option>
                <option value="KaiTi">楷体</option>
                <option value="DFKai-SB">标楷体</option>
              </select>
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">颜色</div>
            <div class="panel-value">{{ activeElement.tMsgColor }}</div>
            <div>
              <input type="color" v-model="activeElement.tMsgColor">
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">行高</div>
            <div>
              <input
                v-model="activeElement.tMsgLineHeight"
                type="number">
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">加粗</div>
            <div class="panel-value">
              <label class="form-switch">
                <input type="checkbox" v-model="activeElement.tMsgFontWeight">
                <i class="form-icon"></i>
              </label>
            </div>
          </div>
          <div class="panel-row" flex>
            <div class="panel-label">字间距</div>
            <div>
              <input
                v-model="activeElement.tMsgFontSpacing"
                type="number">
            </div>
          </div>
        </div>
      </div>

      <div class="panel-item-new">
        <div class="panel-item-title">前缀配置<i class="panel-title-arrow el-icon-caret-bottom"></i></div>
        <div class="panel-item-new-set">
          <div flex="" class="panel-row">
            <div class="panel-label">文本内容</div>
            <div><input type="text"></div>
          </div>
          <div flex="" class="panel-row">
            <div class="panel-label">字号</div>
            <div><input type="number"></div>
          </div>
          <div flex="" class="panel-row">
            <div class="panel-label">字体</div>
            <div class="panel-value"><select class="panel-sel-big">
              <option value="Arial">Arial</option>
              <option value="sans-serif">sans-serif</option>
              <option value="Microsoft YaHei">微软雅黑</option>
              <option value="Microsoft JhengHei">微软正黑体</option>
              <option value="ZZGF">造字工房朗宋常规体</option>
              <option value="SimHei">黑体</option>
              <option value="Hiragino Sans GB">Hiragino Sans GB</option>
              <option value="SimSun">宋体</option>
              <option value="FangSong">仿宋</option>
              <option value="PMingLiU">新细明体</option>
              <option value="KaiTi">楷体</option>
              <option value="DFKai-SB">标楷体</option>
            </select></div>
          </div>
          <div class="panel-row">
            <div class="panel-label">颜色</div>
            <div class="panel-colormsg">#eeeeee</div>
            <div class="panel-colorpick">
              <div class="el-color-picker el-color-picker--small"><!---->
                <div class="el-color-picker__trigger"><span class="el-color-picker__color is-alpha"><span
                  class="el-color-picker__color-inner" style="background-color: rgb(238, 238, 238);"></span>
                  <!----></span><span class="el-color-picker__icon el-icon-arrow-down"></span></div>
                <div class="el-color-dropdown el-color-picker__panel" style="display: none;">
                  <div class="el-color-dropdown__main-wrapper">
                    <div class="el-color-hue-slider is-vertical" style="float: right;">
                      <div class="el-color-hue-slider__bar"></div>
                      <div class="el-color-hue-slider__thumb" style="left: 0px; top: 0px;"></div>
                    </div>
                    <div class="el-color-svpanel" style="background-color: rgb(255, 0, 0);">
                      <div class="el-color-svpanel__white"></div>
                      <div class="el-color-svpanel__black"></div>
                      <div class="el-color-svpanel__cursor" style="top: 0px; left: 0px;">
                        <div></div>
                      </div>
                    </div>
                  </div>
                  <div class="el-color-alpha-slider">
                    <div class="el-color-alpha-slider__bar"
                         style="background: linear-gradient(to right, rgba(238, 238, 238, 0) 0%, rgb(238, 238, 238) 100%);"></div>
                    <div class="el-color-alpha-slider__thumb" style="left: 0px; top: 0px;"></div>
                  </div><!---->
                  <div class="el-color-dropdown__btns"><span class="el-color-dropdown__value"><div
                    class="el-input el-input--mini"><!----><input type="text" autocomplete="off"
                                                                  class="el-input__inner"><!----><!----><!---->
                    <!----></div></span>
                    <button type="button" class="el-button el-color-dropdown__link-btn el-button--text el-button--mini">
                      <!----><!----><span>
        清空
      </span></button>
                    <button type="button"
                            class="el-button el-color-dropdown__btn el-button--default el-button--mini is-plain"><!---->
                      <!----><span>
        确定
      </span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div flex="" class="panel-row">
            <div class="panel-label">加粗</div>
            <div class="panel-value"><label class="form-switch"><input type="checkbox"> <i
              class="form-icon"></i></label></div>
          </div>
        </div>
      </div>
      <div class="panel-item-new">
        <div class="panel-item-title">后缀配置<i class="panel-title-arrow el-icon-caret-bottom"></i></div>
        <div class="panel-item-new-set">
          <div flex="" class="panel-row">
            <div class="panel-label">文本内容</div>
            <div><input type="text"></div>
          </div>
          <div flex="" class="panel-row">
            <div class="panel-label">字号</div>
            <div><input type="number"></div>
          </div>
          <div flex="" class="panel-row">
            <div class="panel-label">字体</div>
            <div class="panel-value"><select class="panel-sel-big">
              <option value="Arial">Arial</option>
              <option value="sans-serif">sans-serif</option>
              <option value="Microsoft YaHei">微软雅黑</option>
              <option value="Microsoft JhengHei">微软正黑体</option>
              <option value="ZZGF">造字工房朗宋常规体</option>
              <option value="SimHei">黑体</option>
              <option value="Hiragino Sans GB">Hiragino Sans GB</option>
              <option value="SimSun">宋体</option>
              <option value="FangSong">仿宋</option>
              <option value="PMingLiU">新细明体</option>
              <option value="KaiTi">楷体</option>
              <option value="DFKai-SB">标楷体</option>
            </select></div>
          </div>
          <div class="panel-row">
            <div class="panel-label">颜色</div>
            <div class="panel-colormsg">#eeeeee</div>
            <div class="panel-colorpick">
              <div class="el-color-picker el-color-picker--small"><!---->
                <div class="el-color-picker__trigger"><span class="el-color-picker__color is-alpha"><span
                  class="el-color-picker__color-inner" style="background-color: rgb(238, 238, 238);"></span>
                  <!----></span><span class="el-color-picker__icon el-icon-arrow-down"></span></div>
                <div class="el-color-dropdown el-color-picker__panel" style="display: none;">
                  <div class="el-color-dropdown__main-wrapper">
                    <div class="el-color-hue-slider is-vertical" style="float: right;">
                      <div class="el-color-hue-slider__bar"></div>
                      <div class="el-color-hue-slider__thumb" style="left: 0px; top: 0px;"></div>
                    </div>
                    <div class="el-color-svpanel" style="background-color: rgb(255, 0, 0);">
                      <div class="el-color-svpanel__white"></div>
                      <div class="el-color-svpanel__black"></div>
                      <div class="el-color-svpanel__cursor" style="top: 0px; left: 0px;">
                        <div></div>
                      </div>
                    </div>
                  </div>
                  <div class="el-color-alpha-slider">
                    <div class="el-color-alpha-slider__bar"
                         style="background: linear-gradient(to right, rgba(238, 238, 238, 0) 0%, rgb(238, 238, 238) 100%);"></div>
                    <div class="el-color-alpha-slider__thumb" style="left: 0px; top: 0px;"></div>
                  </div><!---->
                  <div class="el-color-dropdown__btns"><span class="el-color-dropdown__value"><div
                    class="el-input el-input--mini"><!----><input type="text" autocomplete="off"
                                                                  class="el-input__inner"><!----><!----><!---->
                    <!----></div></span>
                    <button type="button" class="el-button el-color-dropdown__link-btn el-button--text el-button--mini">
                      <!----><!----><span>
        清空
      </span></button>
                    <button type="button"
                            class="el-button el-color-dropdown__btn el-button--default el-button--mini is-plain"><!---->
                      <!----><span>
        确定
      </span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div flex="" class="panel-row">
            <div class="panel-label">加粗</div>
            <div class="panel-value"><label class="form-switch"><input type="checkbox"> <i
              class="form-icon"></i></label></div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
    import BasicSettings from '../../CommonModule/BasicSettings'

    export default {
        name: 'BasicTxtBoxStyle',
        components: {
            BasicSettings
        },
        props: ['activeElement', 'tab']
    }
</script>
