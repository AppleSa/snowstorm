<template>
    <ul id="menu_bar">
        <li v-for="menu in Menu" :key="menu.id">
            <a>{{ menu.label }}</a>
            <ul class="menu_dropdown">
                <li v-for="entry in menu.children" :key="entry.id" v-on:click="entry.click(getVM(), $event)">
                    <a>{{ entry.label }}</a>
                </li>
            </ul>
        </li>
		<template v-if="isVSCExtension">
        	<li class="mode_selector" @click="openCodeViewer(true)" title="打开代码视图到侧边栏"><i class="unicode_icon split">{{'\u2385'}}</i></li>
        	<li class="mode_selector" @click="openCodeViewer(false)" title="以打开代码视图">打开代码</li>
		</template>
		<template v-else-if="!portrait_view">
        	<li class="mode_selector code" :class="{selected: selected_tab == 'code'}" @click="$emit('changetab', 'code')">代码</li>
        	<li class="mode_selector preview" :class="{selected: selected_tab == 'preview'}" @click="$emit('changetab', 'preview')">预览</li>
		</template>
    </ul>
</template>

<script>
import {downloadFile} from '../export'
import {importFile,	loadPreset,	startNewProject} from '../import'
import {View} from './Preview'

import vscode from '../vscode_extension'
const isVSCExtension = !!vscode;

function openLink(link) {
	if (vscode) {
		vscode.postMessage({
            type: 'link',
            link
        });
	} else {
		open(link)
	}
}

const Menu = [
	{
		label: '文件',
		children: [
			{label: '新建', click: () => {startNewProject()}},
		]
	},
	{
		label: '示例',
		children: [
			{label: 'Loading', 	click: () => {loadPreset('loading')}},
			{label: 'Rainbow', 	click: () => {loadPreset('rainbow')}},
			{label: 'Rain', 	click: () => {loadPreset('rain')}},
			{label: 'Snow', 	click: () => {loadPreset('snow')}},
			{label: 'Fire', 	click: () => {loadPreset('fire')}},
			{label: 'Magic', 	click: () => {loadPreset('magic')}},
			{label: 'Trail', 	click: () => {loadPreset('trail')}},
			{label: 'Billboard',click: () => {loadPreset('billboard')}},
		]
	},
	{
		label: '视图',
		children: [
			{label: '网格', click: () => { View.grid.visible = !View.grid.visible }},
			{label: '辅助轴', click: () => { View.helper.visible = !View.helper.visible }},
			{label: '截图', click: () => { View.screenshot() }},
		]
	},
	{
		label: '帮助',
		children: [
			{label: '格式文档', click: () => { openLink('https://bedrock.dev/r/Particles') }},
			{label: 'MoLang 表格', click: (vm) => { vm.openDialog('molang_sheet') }},
			{label: 'MoLang 可视化', click: () => { openLink('https://jannisx11.github.io/molang-grapher/') }},
			{label: '反馈Bug', click: () => { openLink('https://github.com/JannisX11/snowstorm/issues') }},
			{label: 'Discord 频道', click: () => { openLink('https://discord.gg/eGqsNha') }},
			{label: '@Mclans团队', click: () => { openLink('https://mclans.cn') }},
		]
	}
]

if (!isVSCExtension) {
	Menu[0].children.push(
		{label: '导入', click: () => {importFile()}},
		{label: '下载', click: () => {downloadFile()}}
	)
}



export default {
    name: 'menu-bar',
    props: {
        selected_tab: String,
        portrait_view: Boolean
    },
    methods: {
        changeTab() {
            this.$emit('setTab')
		},
		openCodeViewer(side) {
			vscode.postMessage({
				type: 'view_code', side
			});
		},
		openDialog(dialog) {
			this.$emit('opendialog', dialog)
		},
		getVM() {
			return this;
		}
	},
	data() {return {
		Menu,
		isVSCExtension
	}}
}
</script>


<style scoped>
	ul#menu_bar {
		height: 32px;
		font-weight: normal;
		padding: 0 8px;
		background-color: var(--color-bar);
		white-space: nowrap;
	}
	a {
		display: block;
		padding: 2px 12px; 
		padding-top: 3px;
	}
	a:hover {
		background-color: var(--color-interface);
		color: black;
	}
	ul#menu_bar > li {
		display: inline-block;
	}
	ul#menu_bar > li > ul {
		display: none;
		position: absolute;
		padding: 0;
		z-index: 8;
		min-width: 150px;
		background-color: var(--color-bar);
		box-shadow: 1px 4px 10px rgba(0, 0, 0, 0.25);
	}
	ul#menu_bar > li:hover > ul {
		display: block;
	}
	ul#menu_bar > li:hover > a {
		background-color: var(--color-interface);
	}
	.mode_selector {
		float: right;
		height: 100%;
		padding: 2px 8px;
		padding-top: 3px;
		cursor: pointer;
	}
	.mode_selector:hover {
		background-color: var(--color-interface);
	}
	.mode_selector.selected {
		background-color: var(--color-dark);
		color: var(--color-text_grayed);
	}
</style>
