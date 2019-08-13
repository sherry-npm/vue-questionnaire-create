<template lang="pug">
.v-dragger-select
	.input-group
		label {{idx}}
		el-input(
			:placeholder="placeholder"
			v-model="selectInfo.question"
		)
	//- 【说明】
	//- selectInfo的数据，来自外部传入的content引用。即：selectInfo和content，指向同一地址
	//- 本组件内的增删改操作，实质操作的是父组件传入的content的数据
	//- 因此，父组件不用手动获取choices操作后的数据，就可以直接拿到最新的choices
	//- 【矛盾点】
	//- 1.content数据需要传给后端，删除操作只能将choice.is_deleted置为true，不可以真正删除数组数据
	//- 2.选项的渲染遍历content的choices(即：selectInfo.choices)，视图不可以显示已删除的选项
	//- 因此，最直接的解决办法，就是v-for + v-if (如当前代码)
	//- 【注】官方文档不推荐v-for with v-if(详见：官网-风格指南)
	//- 经评估，分离视图显示数组及与后端交互数组，代价大于v-for + v-if共存。方案暂定，使用v-for + v-if
	.option-group(v-for="choice in selectInfo.choices" v-if="!choice.is_deleted")
		el-radio(v-if="selectInfo.type === 1" disabled)
		el-checkbox(v-if="selectInfo.type === 2" disabled)
		el-input(
			placeholder="选项"
			v-model="choice.description"
			:disabled="choice.type === 2"
		)
		img.drag-icon(:src="icons.icon_close" @click="del(choice)")
	el-button(@click="add") 添加选项
	el-button(@click="addOther" :disabled="otherExist") 添加[其他]项
	.input-group(v-if="selectInfo.type === 2")
		label.option-footer 最多答案数：
		el-input.input-footer(v-model="selectInfo.max_answer" type="number" placeholder="最多答案数" @change="onMaxAnswerChange")
</template>

<script>
import $icons from '../assets/index';

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
			selectInfo: {},
			placeholder: '',
			length: 0,
			otherExist: false,
			icons: $icons
		};
	},
	methods: {
		del(option) {
			// 如果删除的是“其他”选项
			if (option.type === 2) {
				this.otherExist = false;
			}
			// 如果删除的是，未存入过数据库的选项，直接从selectInfo.choices中删除
			if (!option.choice_id) {
				this.selectInfo.choices = this.selectInfo.choices.filter(item => item.custom_c_id !== option.custom_c_id);
				return;
			}
			option.is_deleted = true;
		},
		add() {
			const choices = this.selectInfo.choices;
			if (!this.otherExist) {
				choices.push({
					custom_c_id: ++this.length,
					type: 1,
					description: '',
					is_deleted: false
				});
			} else {
				choices.splice(choices.length - 1, 0, {
					custom_c_id: ++this.length,
					type: 1,
					description: '',
					is_deleted: false
				});
			}
		},
		addOther() {
			this.otherExist = true;
			this.selectInfo.choices.push({
				custom_c_id: ++this.length,
				type: 2,
				description: '其他',
				is_deleted: false
			});
		},
		onMaxAnswerChange(val) {
			this.selectInfo.max_answer = parseInt(val, 10);
		},
		initOtherSelectStyle(choices) {
			// 过滤当前选项
			for (let i = choices.length; i--;) {
				// 如果存在“其他”选项，“添加[其他]项”按钮不可点，跳出循环
				if (choices[i].type === 2) {
					this.otherExist = true;
					break;
				}
			}
		},
		init(content) {
			// 数据回显
			this.selectInfo = content;
			this.placeholder = content.type === 1 ? '单选题' : '多选题';
			if (content.choices) {
				this.length = content.choices.length;
				this.initOtherSelectStyle(content.choices);
			}
		}
	},
	mounted() {
		this.init(this.content);
	}
};
</script>
