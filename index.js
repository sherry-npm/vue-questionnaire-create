// 打包到生产环境的入口文件
import Main from './src/components/Main'
// import _Vue from 'vue'

// Main.install = Vue => {
// if (!Vue) {
//   window.Vue = Vue = _Vue
// }
// Vue.component(Main.name, Main)
// }

const components = [Main]
const install = function(Vue = {}) {
	components.map(component => {
		Vue.component(component.name, component)
	})
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default Main
