/**
 * 事件总线
 */
const install = Vue => {
	const _event = new Vue({
		methods: {
			emit(event, ...args) {
				this.$emit(event, ...args);
			},
			on(event, callback) {
				this.$on(event, callback);
			},
			off(eent, callback) {
				this.$off(event, callback);
			}
		}
	});
	Vue.prototype.$globalEvent = _event;
}
export default install;
