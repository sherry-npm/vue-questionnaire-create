<template lang="pug">
.v-dragger-text
	.input-group
		label {{idx}}
		el-input(
			placeholder="文本题"
			v-model="textInfo.question"
		)
</template>

<script>
export default {
	props: {
		content: {
			type: Object,
			default: () => {}
		},
		idx: {
			type: String,
			default: () => '1、'
		}
	},
	watch: {
		content(val) {
			this.init(val);
		}
	},
	data() {
		return {
			textInfo: {}
		};
	},
	methods: {
		init(content) {
			// 数据回显
			this.textInfo = content;
		}
	},
	mounted() {
		this.init(this.content);
	}
};
</script>
