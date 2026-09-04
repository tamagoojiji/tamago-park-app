// 全角数字・記号を半角に変換
export function toHalfWidth(str: string): string {
  return str.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
            .replace(/[：]/g, ':').replace(/[．]/g, '.');
}
