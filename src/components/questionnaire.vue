<template lang="pug">
draggable.v-questionnaire(
	v-model="draggerList"
	group="draggers"
	@start="drag=true"
	@end="drag=false"
)
	//- 把draggerList的每一项，传给子组件，注意，这里传的是引用。
	//- 子组件直接操作父组件传过去的引用，从而直接更新父组件数据，即：draggerList被直接更新
	el-card.box-card.drag-item(
		v-for="(element, index) in draggerList"
		v-if="!element.is_deleted"
		:key="element.custom_id"
	)
		div.drag-icons
			img.drag-icon(:src="icons.icon_copy" @click="copy(element)")
			img.drag-icon(:src="icons.icon_delete" @click="del(element)")
		v-dragger-select(
			v-if="element.type === 1 || element.type === 2"
			ref="select"
			:content="element"
			:idx="getIdx(element) + '、'"
		)
		v-dragger-text(
			v-if="element.type === 3"
			ref="text"
			:content="element"
			:idx="getIdx(element) + '、'"
		)
	.btn-group
		el-button(
			size="large"
			@click="addRadio"
		) 添加单选题
		el-button(
			size="large"
			@click="addCheckbox"
		) 添加多选题
		el-button(
			size="large"
			@click="addText"
		) 添加文本题
		slot(name="button" v-if="showOperations")
			el-button(
				type="primary"
				@click="submit"
			) 提交
			el-button(
				type="danger"
				@click="clear"
			) 清空
	slot(name="block-button")
</template>

<script>
import $draggable from 'vuedraggable';
import $draggerSelect from './select';
import $draggerText from './text';
import $icons from '../assets/index';

export default {
	name: 'vue-questionnaire-create',
	props: {
		data: {
			type: Array,
			default: () => []
		},
		// 是否展示操作按钮
		showOperations: {
			type: Boolean,
			default: true
		},
		rules: {
			type: Object,
			default: () => ({
				radio: {
					questionTextRange: [1, Infinity],
					choiceNumRange: [1, Infinity],
					choiceTextRange: [1, Infinity]
				},
				checkBox: {
					questionTextRange: [1, Infinity],
					choiceNumRange: [1, Infinity],
					choiceTextRange: [1, Infinity]
				},
				text: {
					questionTextRange: [1, Infinity]
				}
			})
		},
		onSubmit: {
			type: Function,
			default: () => true
		}
	},
	components: {
		'draggable': $draggable,
		'v-dragger-select': $draggerSelect,
		'v-dragger-text': $draggerText
	},
	data() {
		return {
			draggerList: [],
			length: 0,
			icons: $icons
		};
	},
	watch: {
		data(val) {
			this.init(val);
		}
	},
	methods: {
		addRadio() {
			this.draggerList.push({
				custom_id: ++this.length,
				is_deleted: false,
				question: '',
				type: 1,
				choices: []
			});
		},
		addCheckbox() {
			this.draggerList.push({
				custom_id: ++this.length,
				is_deleted: false,
				question: '',
				type: 2,
				choices: [],
				max_answer: ''
			});
		},
		addText() {
			// 数据添加
			this.draggerList.push({
				custom_id: ++this.length,
				is_deleted: false,
				question: '',
				type: 3
			});
		},
		copy(element) {
			// 简易深拷贝
			const newElement = JSON.parse(JSON.stringify(element));
			// 数据层面的拷贝对象
			const dragger = Object.assign(newElement, { custom_id: ++this.length, is_deleted: false });
			this.draggerList.push(dragger);
		},
		del(element) {
			// 未入过库的，直接从列表中删除。入过库的数据，删除方式：is_deleted = true
			if (!element.question_id) {
				this.draggerList = this.draggerList.filter(item => item.custom_id !== element.custom_id);
			} else {
				element.is_deleted = true;
			}
		},
		getIdx(dragger) {
			// 根据视图真正展示的卡片，计算idx
			const tmpList = this.draggerList.filter(item => !item.is_deleted);
			for (let i = tmpList.length; i--;) {
				if (dragger.custom_id === tmpList[i].custom_id) {
					dragger.idx = i + 1;
					break;
				}
			}
			return dragger.idx;
		},
		getDataList() {
			return this.draggerList;
		},
		validate(element, rule) {
			const questionMinLength = rule.questionTextRange[0];
			const questionMaxLength = rule.questionTextRange[1];
			if (element.question.length < questionMinLength) {
				return `问题内容请不要少于${questionMinLength}个字`;
			}
			if (element.question.length > questionMaxLength) {
				return `问题内容请不要多于${questionMaxLength}个字`;
			}
			// 选项题要判断选项是否符合规则
			if (element.type === 1 || element.type === 2) {
				const choiceMinLength = rule.choiceNumRange[0];
				const choiceMaxLength = rule.choiceNumRange[1];
				const choiceTextMinLength = rule.choiceTextRange[0];
				const choiceTextMaxLength = rule.choiceTextRange[1];
				const choices = element.choices.filter(choice => !choice.is_deleted);
				if (choices.length > choiceMaxLength) {
					return `选项请不要多于${choiceMaxLength}个`;
				}
				if (choices.length < choiceMinLength) {
					return `选项请不要少于${choiceMinLength}个`;
				}
				// 遍历每个选项，判断文本长度有效性
				for (let i = choices.length; i--;) {
					if (choices[i].description.length < choiceTextMinLength) {
						return `选项描述请不要少于${choiceTextMinLength}个字`;
					}
					if (choices[i].description.length > choiceTextMaxLength) {
						return `选项描述请不要多于${choiceTextMaxLength}个字`;
					}
				}
				if (element.type === 2 && (!element.max_answer || element.max_answer < 2 || element.max_answer > choices.length)) {
					return '多选题请输入合法的最多答案数';
				}
			}
			return '';
		},
		checkValid() {
			let errorMsg = '';
			let isValid = false;
			const list = this.draggerList;
			const { radio, checkBox, text } = this.rules;
			// 没有添加问题卡片
			if (list.length === 0) {
				errorMsg = '您还没有录入任何问题';
				return { isValid, errorMsg };
			}
			for (let i = list.length; i--;) {
				// 如果是单选题
				if (list[i].type === 1) {
					errorMsg = this.validate(list[i], radio);
				} else if (list[i].type === 2) {
					errorMsg = this.validate(list[i], checkBox);
				} else {
					errorMsg = this.validate(list[i], text);
				}
				if (errorMsg) {
					break;
				}
			}
			if (!errorMsg) {
				isValid = true;
			}
			return { isValid, errorMsg };
		},
		// 组件自带提交按钮使用。使用者通过onSubmit方法拿到问卷内部数据
		submit() {
			const { errorMsg } = this.checkValid();
			// 如果有未填项
			if (errorMsg) {
				this.$message({
					type: 'error',
					message: errorMsg
				});
			} else {
				this.onSubmit(this.draggerList);
				console.log('执行问卷提交');
			}
		},
		clear() {
			this.draggerList.forEach(dragger => {
				// 问题清空
				dragger.question = '';
				if (dragger.choices && dragger.choices.length > 0) {
					dragger.choices.forEach(choice => {
						// 选项清空
						choice.description = '';
					});
					if (dragger.max_answer) {
						// 多选题的最多答案数清空
						dragger.max_answer = '';
					}
				}
			});
		},
		initDraggerList(data) {
			// 简易深拷贝this.data到this.draggerList（用于给后台传数据的draggerList）
			this.draggerList = JSON.parse(JSON.stringify(data));
			// 给draggerList的每一项，添加custom_id（用于前端添加/删除项）
			this.initCustomId(this.draggerList, 'custom_id');
		},
		initCustomId(list, idName) {
			list.forEach((item, index) => {
				item[idName] = index + 1;
				Object.keys(item).forEach(key => {
					// 当当前对象存在数组属性时，给数组属性的每一项，也添加上前端自定义的id（用于数组项的添加/删除）
					if (Array.isArray(item[key])) {
						// nameKey取数组key的第一个字母
						const nameKey = key.slice(0, 1);
						this.initCustomId(item[key], `custom_${nameKey}_id`);
					}
				});
			});
		},
		init(data) {
			// 初始化draggerList数组，添加前端自定义属性
			this.initDraggerList(data);
			// 获取data数组长度，用作生成添加/删除项的id值
			this.length = data.length;
		}
	},
	mounted() {
		this.init(this.data);
	}
};
</script>

<style lang="less">
.v-questionnaire {
	margin: 30px 0;
	/* 拖拽框样式 */
	.drag-item {
		min-height: 80px;
		min-width: 700px;
		margin-bottom: 20px;
		cursor: move;
	}
	.drag-icons {
		text-align: right;
	}
	.drag-icon {
		width: 15px;
		height: 15px;
		fill: #666;
		margin-left: 10px;
		cursor: pointer;
	}
	/* 拖拽内容样式 */
	.input-group, .option-group {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}
	.input-group {
		margin-right: 200px;
		margin-top: 20px;
	}
	.option-group {
		margin-right: 177px;
	}
	.option-footer {
		flex: 1;
	}
	.input-footer {
		flex: 3;
	}
	.hide {
		display: none;
	}
	.btn-group {
		padding: 40px;
	}
}
</style>
