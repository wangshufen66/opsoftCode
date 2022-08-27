import zhcn from './zh-cn';

export default function transform(template: string, replacements: any): string {
  replacements = replacements || {};
  // Translate
  template = zhcn[template] || template;
  // Replace
  return template.replace(/{([^}]+)}/g, (_, key) => {
    let str: string = replacements[key];
    if (zhcn[replacements[key]] != null && zhcn[replacements[key]] != 'undefined') {
      str = zhcn[replacements[key]];
    }
    return str || '{' + key + '}';
  });
}
