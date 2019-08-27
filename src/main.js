import Vue from 'vue'
import App from './App.vue'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css' // 引入element-ui样式文件，否则样式不生效

// Vue.use(ElementUI) // externals掉element-ui，由用户环境提供

new Vue({
	el: '#app',
	render: h => h(App)
})
