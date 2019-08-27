// 打包到生产环境的入口文件
import Questionnaire from './src/components/questionnaire'

const components = [Questionnaire]
const install = function(Vue = {}) {
	components.map(component => {
		Vue.component(component.name, component)
	})
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default Questionnaire
