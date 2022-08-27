interface UsePrintReturn {
  printHtml: (domNode: string) => void;
  printHtmlElement: (elementArray: Element[]) => void;
}

export default function usePrintHtml(): UsePrintReturn {
  /**
   * 打印
   * @param html
   */
  function print(html: string) {
    let style = getStyle();
    let container = getContainer(html);

    document.body.appendChild(style);
    document.body.appendChild(container);

    getLoadPromise(container).then(() => {
      window.print();
      document.body.removeChild(style);
      document.body.removeChild(container);
    });
  }

  /**
   * 设置默认打印样式
   * @return {*}
   */
  function getStyle() {
    let styleContent = `#print-container {
          display: none;
      }
      @media print {
          body > :not(.print-container) {
              display: none;
          }
          html,
          body {
              display: block !important;
          }
          #print-container {
              display: block;
          }
      }`;
    let style = document.createElement("style");
    style.innerHTML = styleContent;
    return style;
  }

  /**
   * 清空打印内容
   */
  function cleanPrint() {
    let div = document.getElementById("print-container");
    if (!!div) {
      document?.querySelector("body")?.removeChild(div);
    }
  }

  /**
   * 新建DOM，将需要打印的内容填充到DOM
   * @param html
   * @return {*}
   */
  function getContainer(html) {
    cleanPrint();
    let container = document.createElement("div");
    container.setAttribute("id", "print-container");
    container.innerHTML = html;
    return container;
  }

  /**
   * 图片完全加载后再调用打印方法
   * @param dom
   * @return {*}
   */
  function getLoadPromise(dom): Promise<void> {
    let imgs = dom.querySelectorAll("img");
    imgs = [].slice.call(imgs);

    if (imgs.length === 0) {
      return Promise.resolve();
    }

    let finishedCount = 0;
    return new Promise((resolve) => {
      function check() {
        finishedCount++;
        if (finishedCount === imgs.length) {
          resolve();
        }
      }
      imgs.forEach((img) => {
        img.addEventListener("load", check);
        img.addEventListener("error", check);
      });
    });
  }

  /**
   * 打印制定的HTML内容
   * @param domNode DOM节点
   */
  function printHtml(domNode: string): void {
    const printForm = document.querySelector(domNode);
    printForm && print(printForm.innerHTML);
  }

  function printHtmlElement(elementArray: Element[]): void {
    let htmlConent = "";
    for (let i = 0; i < elementArray.length; i++) {
      htmlConent += elementArray[i].outerHTML;
    }
    htmlConent && print(htmlConent);
  }

  return {
    printHtml,
    printHtmlElement,
  };
}
