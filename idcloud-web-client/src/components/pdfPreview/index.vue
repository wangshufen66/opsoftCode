<template>
  <div id="container">
    <div v-if="ifCorrect">
      <div class="page-container">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-size="1"
          layout="total, prev, pager, next"
          :total="pageSize">
        </el-pagination>
      </div>
      <div class="canvas-container">
        <canvas ref="pdfCanvas"/>
      </div>
    </div>
    <div v-if="!ifCorrect">
      <p class="error-message"></p>
    </div>
  </div>
</template>

<script>
  import pdfjsLib from 'pdfjs-dist/build/pdf'
  import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry'

  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

  export default {
    name: "pdfPreview",
    props: {
      url: {
        type: String,
        default() {
          return ''
        }
      }
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 0,
        pageRendering: false,
        pageNumPending: null,
        scale: 1.2,
        ifCorrect: true

      }
    },
    methods: {
      handleCurrentChange() {
        this.renderPage()
      },
      renderPage() {
        const canvas = this.$refs.pdfCanvas
        //---fix--- 19-12-26  ---author cc
        //在渲染之前先进行url判定
        // const pattern = new RegExp('/((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[\\-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9\\.\\-]+|(?:www\\.|[\\-;:&=\\+\\$,\\w]+@)[A-Za-z0-9\\.\\-]+)((?:\\/[\\+~%\\/\\.\\w\\-_]*)?\\??(?:[\\-\\+=&;%@\\.\\w_]*)#?(?:[\\.\\!\\/\\\\\\w]*))?)/')
        // const isUrl = pattern.test(this.url)
        // console.log(this.url)
        // console.log(isUrl)
        // console.log('开始初始化')
        this.ifCorrect = true
        if (this.url !=='' && this.url !== null && this.url !== undefined){
          try {
            this.pageRendering = true;

            // console.log(canvas)
            const ctx = canvas.getContext('2d')
            // console.log('获取')
            // 使用Promise取得pdf页面
            pdfjsLib.getDocument(this.url).promise.then((doc) => {
              //获取pdf页数
              this.pageSize = doc.numPages
              doc.getPage(this.pageNum).then((page) => {
                const viewport = page.getViewport({scale: this.scale});
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // 渲染页面
                const renderContext = {
                  canvasContext: ctx,
                  viewport: viewport
                };
                const renderTask = page.render(renderContext);

                // 等待渲染完成
                renderTask.promise.then(() => {
                  this.pageRendering = false;
                  if (this.pageNumPending !== null) {
                    // 新页面正在准备
                    this.renderPage(this.pageNumPending);
                    this.pageNumPending = null;
                    // console.log('渲染完成')
                  }
                });
              });
            }).catch((e)=>{
              console.log(e)
              this.ifCorrect = false
            })
          } catch (e) {
            console.log(e)
            this.ifCorrect = false
          }
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  #container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    /*justify-content: center;*/
    /*align-items: flex-start;*/

    .page-container {
      text-align: center;
      background: white;
      border-bottom: 1px solid #c4c4c4;
    }

    .canvas-container {
      text-align: center;
      overflow: auto;
    }
  }
  .error-message {
    text-align: center;
    line-height: 50px;
    color: white;
  }

</style>
