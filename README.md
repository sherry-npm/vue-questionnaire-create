# vue-questionnaire-create

> 管理端问卷创建组件（vue）

# 简介
用于vue管理端项目创建问卷的组件。支持单选题、多选题、文本题的创建。支持题目的拖拽排序。

# 快速开始
## 安装
    npm install vue-questionnaire-create --save
## 使用Demo
### 1.使用组件内置操作按钮（提交 + 清空）
```javascript
	 <template>
		 <v-questionnaire
			 ref="questionnaire"
			 :data="form.questions"
			 :rules="questionnaireRules"
			 :onSubmit="submitHandler"
		 />
	 </template>
	<script>
    	import questionnaire from 'vue-questionnaire-create';
    	export default {
			components: {
				'v-questionnaire': questionnaire
			},
			data() {
				form: {
					questions: [{
						type: 1,
						is_deleted: false,
						question: '你最喜欢的水果是？',
						choices: [{
							type: 1,
							is_deleted: false,
							description: '苹果'
						}, {
							type: 1,
							is_deleted: false,
							description: '樱桃'
						}, {
							type: 2,
							is_deleted: false,
							description: '其他'
						}]
					}, {
						type: 2,
						is_deleted: false,
						question: '你最喜欢的城市是？',
						max_answer: 2,
						choices: [{
							type: 1,
							is_deleted: false,
							description: '北京'
						}, {
							type: 1,
							is_deleted: false,
							description: '三亚'
						}, {
							type: 1,
							is_deleted: false,
							description: '西安'
						}, {
							type: 2,
							is_deleted: false,
							description: '其他'
						}]
					}, {
						type: 3,
						is_deleted: false,
						question: '你觉得是什么限制了你的脚步？'
					}]
				},
				questionnaireRules: {
					radio: {
						questionTextRange: [1, 100],
						choiceNumRange: [2, 10],
						choiceTextRange: [1, 100]
					},
					checkBox: {
						questionTextRange: [1, 100],
						choiceNumRange: [2, 10],
						choiceTextRange: [1, 100]
					},
					text: {
						questionTextRange: [1, 100]
					}
				}
			},
			methods: {
				submitHandler(data) {
					console.log('questionList:', data);
				}
			}
    	}
	</script>
```
### 2.使用自定义操作按钮
```json
```json
 <template>
		 <v-questionnaire
			 ref="questionnaire"
			 :data="form.questions"
			 :rules="questionnaireRules"
			 :showOperations="false"
		 />
		 <button @click="submitHandler">提交问卷</button>
		 <button @click="clearHandler">清空问卷</button>
	 </template>
	<script>
    	import questionnaire from 'vue-questionnaire-create';
    	export default {
			components: {
				'v-questionnaire': questionnaire
			},
			data() {
				form: {
					questions: [{
						type: 1,
						is_deleted: false,
						question: '你最喜欢的水果是？',
						choices: [{
							type: 1,
							is_deleted: false,
							description: '苹果'
						}, {
							type: 1,
							is_deleted: false,
							description: '樱桃'
						}, {
							type: 2,
							is_deleted: false,
							description: '其他'
						}]
					}, {
						type: 2,
						is_deleted: false,
						question: '你最喜欢的城市是？',
						max_answer: 2,
						choices: [{
							type: 1,
							is_deleted: false,
							description: '北京'
						}, {
							type: 1,
							is_deleted: false,
							description: '三亚'
						}, {
							type: 1,
							is_deleted: false,
							description: '西安'
						}, {
							type: 2,
							is_deleted: false,
							description: '其他'
						}]
					}, {
						type: 3,
						is_deleted: false,
						question: '你觉得是什么限制了你的脚步？'
					}]
				},
				questionnaireRules: {
					radio: {
						questionTextRange: [1, 100],
						choiceNumRange: [2, 10],
						choiceTextRange: [1, 100]
					},
					checkBox: {
						questionTextRange: [1, 100],
						choiceNumRange: [2, 10],
						choiceTextRange: [1, 100]
					},
					text: {
						questionTextRange: [1, 100]
					}
				}
			},
			methods: {
				submitHandler() {
					// 调用组件内部的检查方法，验证问卷列表数据合法性
					const { isValid, errorMsg } = this.$refs.questionnaire.checkValid();
					if (isValid) {
						// 弹窗提示，确认提交
					} else {
						// 弹窗提示验证未通过原因（errorMsg）
					}
				},
				clearHandler() {
					this.form.questions = [];
				}
			}
    	}
	</script>
```

## 组件接收参数（props）
### 1. data：问题列表（可选）
#### 类型： Array
#### 数据Demo：
```json
[{
	type: 1,
	is_deleted: false,
	question: '你最喜欢的水果是？',
	choices: [{
		type: 1,
		is_deleted: false,
		description: '苹果'
	}, {
		type: 1,
		is_deleted: false,
		description: '樱桃'
	}, {
		type: 2,
		is_deleted: false,
		description: '其他'
	}]
}, {
	type: 2,
	is_deleted: false,
	question: '你最喜欢的城市是？',
	max_answer: 2,
	choices: [{
		type: 1,
		is_deleted: false,
		description: '北京'
	}, {
		type: 1,
		is_deleted: false,
		description: '三亚'
	}, {
		type: 1,
		is_deleted: false,
		description: '西安'
	}, {
		type: 2,
		is_deleted: false,
		description: '其他'
	}]
}, {
	type: 3,
	is_deleted: false,
	question: '你觉得是什么限制了你的脚步？'
}]
```



```json
// 字段含义
type: 问题类型 —— 1：单选题，2：多选题，3：文本题
is_deleted：问题状态 —— true：已删除，false：未删除
question：问题描述 —— String
choices: 选项列表 —— Array（单选、多选题用）
max_answer：最多选项数 —— Number（多选题用）


// choices 具体选项字段含义
type: 选项类型 —— 1：普通选项，2：”其他“选项 // ”其他“选项不允许用户更改，并且保持为最后一条选项。
is_deleted：问题状态 —— true：已删除，false：未删除
description：选项描述 —— String

【注】
is_deleted 字段主要用于与后端交互，更新问题/选项是否删除的状态。双层数组嵌套，采用 is_deleted 字段同步问题是否删除的状态，便于后端操作。页面上只渲染未删除的问题。

```


### 2. rules：问题校验规则（可选）
#### 类型： Object
#### 数据Demo：
```json
{
	radio: {
		questionTextRange: [1, 100],
		choiceNumRange: [2, 10],
		choiceTextRange: [1, 100]
	},
	checkBox: {
		questionTextRange: [1, 100],
		choiceNumRange: [2, 10],
		choiceTextRange: [1, 100]
	},
	text: {
		questionTextRange: [1, 100]
	}
}
```
#### 默认规则：
```json
    {
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
    }

```
```json
    // 字段含义
    radio：单选题校验规则
    checkBox：多选题校验规则
    text：文本题校验规则
    questionTextRange：问题描述字数限制 —— Array
    choiceNumRange：选项个数限制 —— Array
    choiceTextRange：选项描述字数限制 —— Array
```

### 3. showOperations：是否使用组件内置的操作（提交 + 清空）按钮（可选）
#### 类型： Boolean
#### 数据Demo：true / false
#### 默认：true

### 4. onSubmit：组件内置提交按钮，提交事件监听函数（可选）
#### 类型： Function
#### 说明：点击组件内置提交按钮，传出编辑后的 data（问题列表） 数据
#### 使用Demo：
    <template>
    	<v-questionnaire :onSubmit="submitHandler" />
    </template>

    <script>
    	methods: {
    		submitHandler(data) {
    			console.log('questionList:', data);
    		}
    	}
    </script>
