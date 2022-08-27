import { Fn } from "@/shared/type";

interface UseFileReturn {
  /**下载文件 */
  downLoadFile: Fn;
  /**批量下载文件 */
  downLoadFiles: (list: Array<any>) => void;
}

export default function useFile(): UseFileReturn {
  /**
   * 下载文件
   * @param filePath 文件路径
   */
  function downLoadFile(filePath: string): void {
    window.open(filePath);
  }

  function downLoadFiles(fileList: any): void {
    fileList.forEach((file) => {
      // file.url && window.open(file.url, '_blank');
      //通过模拟a标签点击事件下载文件
      const link = document.createElement("a");
      link.href = file.url;
      link.target = "_blank";
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  return {
    downLoadFile,
    downLoadFiles,
  };
}
