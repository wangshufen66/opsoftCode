import { SelectComponent } from './IConfig';

/**
 * useSelect
 * @export
 * @return {*}
 */
export default function useSelect(config: SelectComponent) {
  function verifyConfig() {
    const options = config.options;
    for (let i = 0; i < options.length; i++) {
      if (!options[i].label || !options[i].value) {
        return [false, '自定义选项的选项名、选项值不能为空'];
      }
    }
  }

  return { verifyConfig };
}
