import Input from './input'
import Gradient from './gradient'
import {Emitter, updateMaterial} from './emitter'
import vscode from './vscode_extension';

const Data = {
	effect: {
		label: '通常',
		meta: {
			label: '元数据',
			_folded: false,
			inputs: {
				identifier: new Input({
					id: 'identifier',
					label: '标识符',
					info: '这是粒子发射器的名称。应该有一个命名空间。',
					placeholder: 'space:name',
					required: true,
					type: 'text',
					onchange() {
						document.title = (this.value ? this.value + ' - ' : '') + 'Snowstorm 粒子编辑器';
					}
				})
			}
		},
		space: {
			label: '空间位置',
			_folded: true,
			inputs: {
				local_position: new Input({
					id: 'space_local_position',
					label: '本地位置',
					info: '启用并将效果附加到实体时，粒子将在实体空间中模拟',
					type: 'checkbox',
					onchange(e) {
						if (!Data.effect.space.inputs.local_position.value) {
							Data.effect.space.inputs.local_rotation.set(false);
						}
					}
				}),
				local_rotation: new Input({
					id: 'space_local_rotation',
					label: '本地旋转',
					info: '启用并将效果附加到实体时，粒子旋转将在实体空间中模拟。仅在启用本地位置时才有效。',
					type: 'checkbox',
					onchange(e) {
						if (Data.effect.space.inputs.local_rotation.value) {
							Data.effect.space.inputs.local_position.set(true);
						}
					}
				}),
				local_velocity: new Input({
					id: 'space_local_velocity',
					label: '本地速度',
					info: '当启用并将效果附加到实体时，粒子速度将在实体空间中模拟。',
					type: 'checkbox'
				})
			}
		},
		variables: {
			label: '变量',
			_folded: true,
			inputs: {
				creation_vars: new Input({
					id: 'variables_creation_vars',
					label: '初始变量',
					info: '发射器启动时的初始 MoLang 变量',
					placeholder: 'variable.name = value',
					type: 'molang',
					axis_count: -1,
					onchange: function() {
						/*
						Emitter.creation_variables = {};
						this.value.forEach((s, i) => {
							var p = s.toLowerCase().replace(/\s/g, '').split('=')
							if (p.length > 1) {
								let key = p.shift();
								Emitter.creation_variables[key] = p.join('=');
							}
						})*/
					}
				}),
				tick_vars: new Input({
					id: 'variables_tick_vars',
					label: 'Tick 变量',
					info: '每次发射器更新都会执行的 MoLang 变量',
					placeholder: 'variable.name = value',
					type: 'molang',
					axis_count: -1,
					onchange: function() {
						/*
						Emitter.tick_variables = {};
						this.value.forEach((s, i) => {
							var p = s.toLowerCase().replace(/\s/g, '').split('=')
							if (p.length > 1) {
								let key = p.shift();
								Emitter.tick_variables[key] = p.join('=');
							}
						})*/
					}
				})
			}
		},
		curves: {
			label: '曲线',
			_folded: true,
			type: 'curves',
			curves: []
		}
	},
	emitter: {
		label: '发射器',
		rate: {
			label: '速率',
			_folded: false,
			inputs: {
				mode: new Input({
					id: 'emitter_rate_mode',
					type: 'select',
					label: '模式',
					info: '',
					mode_groups: ['emitter', 'rate'],
					options: {
						steady: '持续的',
						instant: '瞬时的'
					}
				}),
				rate: new Input({
					id: 'emitter_rate_rate',
					label: '速率',
					info: '发射粒子的频率，以 多少个粒子/秒 为单位。每发射一个粒子评估一次数量。',
					enabled_modes: ['steady'],
					required: true,
					value: 1,
				}),
				amount: new Input({
					id: 'emitter_rate_amount',
					label: '数量',
					info: '一次产生多少粒子',
					enabled_modes: ['instant'],
					required: true,
				}),
				maximum: new Input({
					id: 'emitter_rate_maximum',
					label: '最大值',
					info: '粒子的最大数量值，超过时不再产生',
					enabled_modes: ['steady'],
					required: true,
					value: 100,
				})
			}
		},
		lifetime: {
			label: '发射器生命周期',
			_folded: true,
			inputs: {
				mode: new Input({
					id: 'emitter_lifetime_mode',
					type: 'select',
					label: '模式',
					info: '',
					mode_groups: ['emitter', 'lifetime'],
					options: {
						looping: 'Looping',
						once: 'Once',
						expression: 'Expression'
					},
					//updatePreview: (m) => {Emitter.mode = m}
				}),
				active_time: new Input({
					id: 'emitter_lifetime_active_time',
					label: '激活时间',
					info: '',
					enabled_modes: ['looping', 'once'],
					required: true,
					value: 1,
					//updatePreview: (v) => {Emitter.active_time = v}
				}),
				sleep_time: new Input({
					id: 'emitter_lifetime_sleep_time',
					label: '休眠时间',
					info: '发射器将在每次循环中暂停发射粒子的时间',
					enabled_modes: ['looping'],
					//updatePreview: (v) => {Emitter.sleep_time = v}
				}),
				activation: new Input({
					id: 'emitter_lifetime_activation',
					label: '激活条件',
					info: '当表达式非零时，发射器将发射粒子',
					required: true,
					enabled_modes: ['expression']
				}),
				expiration: new Input({
					id: 'emitter_lifetime_expiration',
					label: '停止条件',
					info: '当表达式非零时，发射器将停止',
					enabled_modes: ['expression']
				})
			}
		},
		shape: {
			label: '形状',
			_folded: true,
			inputs: {
				mode: new Input({
					id: 'emitter_shape_mode',
					type: 'select',
					label: '模式',
					mode_groups: ['emitter', 'shape'],
					options: {
						point: '点',
						sphere: '球',
						box: '盒子',
						disc: '平面',
						//custom: 'Custom',
						entity_aabb: '实体包围盒',
					},
					//updatePreview: (m) => {Emitter.shape = m}
				}),
				offset: new Input({
					id: 'emitter_shape_offset',
					label: '偏移',
					info: '指定从发射器发射的粒子的偏移量',
					axis_count: 3,
					enabled_modes: ['point', 'sphere', 'box', 'custom', 'disc']
				}),
				radius: new Input({
					id: 'emitter_shape_radius',
					label: '范围',
					required: true,
					info: '球或平面的半径',
					enabled_modes: ['sphere', 'disc'],
				}),
				half_dimensions: new Input({
					id: 'emitter_shape_half_dimensions',
					label: '盒子大小',
					info: '盒子的半径',
					axis_count: 3,
					enabled_modes: ['box'],
				}),
				plane_normal: new Input({
					id: 'emitter_shape_plane_normal',
					label: '平面法线',
					info: '指定平面的法线，平面会垂直于这个方向',
					axis_count: 3,
					enabled_modes: ['disc']
				}),
				surface_only: new Input({
					id: 'emitter_shape_surface_only',
					label: '仅表面',
					info: '仅从形状的表面发射',
					type: 'checkbox',
					enabled_modes: ['sphere', 'box', 'entity_aabb', 'disc']
				})
			}
		},
	},
	particle: {
		label: '粒子',
		appearance: {
			label: '外观',
			_folded: false,
			inputs: {
				size: new Input({
					id: 'particle_appearance_size',
					label: '尺寸',
					info: '指定粒子的 xy 大小。',
					axis_count: 2,
					value: [0.2, 0.2]
				}),
				material: new Input({
					id: 'particle_appearance_material',
					type: 'select',
					info: '用于粒子的材质',
					label: '材质',
					options: {
						particles_alpha: '透明',
						particles_blend: '半透明',
						particles_opaque: '不透明',
					},
				}),
				facing_camera_mode: new Input({
					id: 'particle_appearance_facing_camera_mode',
					type: 'select',
					info: '粒子面向摄像机的模式',
					label: '面向',
					options: {
						rotate_xyz: '旋转 XYZ',
						rotate_y: '旋转 Y',
						lookat_xyz: '看着 XYZ',
						lookat_y: '看着 Y',
						direction_x: '面向 X',
						direction_y: '面向 Y',
						direction_z: '面向 Z',
						emitter_transform_xy: '发射器 XY 平面',
						emitter_transform_xz: '发射器 XZ 平面',
						emitter_transform_yz: '发射器 YZ 平面',
					},
				}),
				direction_mode: new Input({
					id: 'particle_appearance_direction_mode',
					type: 'select',
					info: '指定如何计算粒子的方向',
					label: '方向',
					options: {
						derive_from_velocity: 'From Motion',
						custom: '自定义',
					},
					condition(group) {
						return group.inputs.facing_camera_mode.value.substr(0, 9) == 'direction'
					}
				}),
				speed_threshold: new Input({
					id: 'particle_appearance_speed_threshold',
					label: '最小速度',
					info: '如果粒子的速度高于阈值，则设置方向。默认值为 0.01',
					type: 'number',
					step: 0.01,
					condition(group) {
						return group.inputs.facing_camera_mode.value.substr(0, 9) == 'direction'
							&& group.inputs.direction_mode.value == 'derive_from_velocity';
					}
				}),
				direction: new Input({
					id: 'particle_appearance_direction',
					label: '方向',
					info: '粒子发射器的朝向',
					axis_count: 3,
					condition(group) {
						return group.inputs.facing_camera_mode.value.substr(0, 9) == 'direction'
							&& group.inputs.direction_mode.value == 'custom';
					}
				})
			}
		},
		motion: {
			label: '运动',
			_folded: true,
			inputs: {
				mode: new Input({
					id: 'particle_motion_mode',
					type: 'select',
					label: '模式',
					mode_groups: ['particle', 'motion'],
					options: {
						dynamic: '动态',
						parametric: '参数化',
						static: '静态',
					},
				}),
				direction_mode: new Input({
					id: 'particle_direction_mode',
					type: 'select',
					label: '方向',
					info: '粒子发射相对于发射器形状的方向',
					enabled_modes: ['dynamic'],
					options: {
						outwards: '向外',
						inwards: '向内',
						direction: '自定义',
					},
				}),
				direction: new Input({
					id: 'particle_direction_direction',
					label: '方向',
					info: '发射粒子的方向',
					axis_count: 3,
					enabled_modes: ['dynamic'],
					condition(group) {
						return group.inputs.mode.value == 'dynamic'
							&& group.inputs.direction_mode.value == 'direction'
					}
				}),
				linear_speed: new Input({
					id: 'particle_motion_linear_speed',
					label: '速度',
					info: '使用发射器形状指定的方向，以指定的速度发射粒子',
					enabled_modes: ['dynamic'],
					required: true
				}),
				linear_acceleration: new Input({
					id: 'particle_motion_linear_acceleration',
					label: '加速度',
					info: '以 (每块/秒)/秒 为单位应用于粒子的线性加速度',
					axis_count: 3,
					enabled_modes: ['dynamic'],
				}),
				linear_drag_coefficient: new Input({
					id: 'particle_motion_linear_drag_coefficient',
					label: '空气阻力',
					info: '把它想象成空气阻力。值越高, 每帧计算的阻力越大。',
					enabled_modes: ['dynamic']
				}),
				relative_position: new Input({
					id: 'particle_motion_relative_position',
					label: '偏移',
					info: '设置相对于发射器的位置',
					axis_count: 3,
					enabled_modes: ['parametric']
				}),
				relative_direction: new Input({
					id: 'particle_motion_direction',
					label: '方向',
					info: '直接设置粒子的 XYZ 方向',
					axis_count: 3,
					enabled_modes: ['parametric']
				}),
			}
		},
		rotation: {
			label: '旋转',
			_folded: true,
			inputs: {
				mode: new Input({
					id: 'particle_rotation_mode',
					type: 'select',
					label: '模式',
					mode_groups: ['particle', 'rotation'],
					options: {
						dynamic: '动态',
						parametric: '参数化',
					},
				}),
				initial_rotation: new Input({
					id: 'particle_rotation_initial_rotation',
					label: '初始旋转',
					info: '指定初始的旋转角度',
					enabled_modes: ['dynamic']
				}),
				rotation_rate: new Input({
					id: 'particle_rotation_rotation_rate',
					label: '速度',
					info: '指定旋转的速度 (度/秒)',
					enabled_modes: ['dynamic']
				}),
				rotation_acceleration: new Input({
					id: 'particle_rotation_rotation_acceleration',
					label: '加速度',
					info: '应用于粒子旋转速度的加速度 (度/秒/秒)。',
					enabled_modes: ['dynamic']
				}),
				rotation_drag_coefficient: new Input({
					id: 'particle_rotation_rotation_drag_coefficient',
					label: '空气阻力',
					info: '旋转阻力。随着时间的推移, 数字越高, 旋转越慢。',
					enabled_modes: ['dynamic']
				}),
				rotation: new Input({
					id: 'particle_rotation_rotation',
					label: '旋转',
					info: '直接设置粒子的旋转',
					enabled_modes: ['parametric']
				})
			}
		},
		lifetime: {
			label: '生命周期',
			_folded: true,
			inputs: {
				mode: new Input({
					id: 'particle_lifetime_mode',
					type: 'select',
					label: '模式',
					mode_groups: ['particle', 'lifetime'],
					options: {
						time: '时间',
						expression: '销毁表达式',
					}
				}),
				max_lifetime: new Input({
					id: 'particle_lifetime_max_lifetime',
					label: '最大寿命',
					info: '粒子的最大寿命（以秒为单位）',
					value: 1,
					enabled_modes: ['time']
				}),
				expiration_expression: new Input({
					id: 'particle_lifetime_expiration_expression',
					label: '销毁表达式',
					info: '此表达式使粒子在为真（非零）时销毁',
					enabled_modes: ['expression']
				}),
				kill_plane: new Input({
					id: 'particle_lifetime_kill_plane',
					label: '销毁平面',
					type: 'number',
					step: 0.1,
					info: '穿过这个平面的粒子会销毁。平面相对于发射器，但在世界空间中定向。这四个参数是一般式平面方程的四个系数。',
					axis_count: 4
				}),
				expire_in: new Input({
					id: 'particle_lifetime_expire_in',
					label: '销毁方块',
					info: '允许粒子在接触到指定方块后销毁, 方块ID包括命名空间。',
					placeholder: 'minecraft:stone',
					axis_count: -1,
					type: 'text'
				}),
				expire_outside: new Input({
					id: 'particle_lifetime_expire_outside',
					label: '生存方块',
					info: '当粒子不在指定方块内时将销毁, 方块ID包括命名空间。',
					placeholder: 'minecraft:air',
					axis_count: -1,
					type: 'text'
				}),
			}
		},
		texture: {
			label: '纹理',
			_folded: true,
			inputs: {
				path: new Input({
					id: 'particle_texture_path',
					type: 'text',
					info: '纹理的路径, 从资源包纹理路径开始。例子: textures/particle/snowflake',
					placeholder: 'textures/particle/particles',
					label: '纹理',
					updatePreview: function() {
						updateMaterial()
					}
				}),
				image: new Input({
					id: 'particle_texture_image',
					type: 'image',
					allow_upload: !vscode,
					updatePreview: function(src) {
						updateMaterial()
					}
				}),
				mode: new Input({
					id: 'particle_texture_mode',
					type: 'select',
					label: 'UV 模式',
					mode_groups: ['particle', 'texture'],
					options: {
						static: '静态',
						animated: '动态',
					},
				}),
				size: new Input({
					id: 'particle_texture_size',
					label: '纹理大小',
					info: '纹理的分辨率，用于 UV 贴图',
					type: 'number',
					axis_count: 2,
					required: true,
					value: [16, 16]
				}),
				uv: new Input({
					id: 'particle_texture_uv',
					label: 'UV 起点',
					info: 'UV 起点坐标',
					axis_count: 2,
					required: true,
					value: [0, 0]
				}),
				uv_size: new Input({
					id: 'particle_texture_uv_size',
					label: 'UV 大小',
					info: 'UV 大小坐标',
					axis_count: 2,
					value: [16, 16]
				}),
				uv_step: new Input({
					id: 'particle_texture_uv_step',
					label: 'UV 步进',
					info: 'UV 每一帧的偏移',
					axis_count: 2,
					enabled_modes: ['animated']
				}),
				frames_per_second: new Input({
					id: 'particle_texture_frames_per_second',
					label: 'FPS',
					info: '每秒帧数',
					type: 'number',
					min: 0,
					enabled_modes: ['animated']
				}),
				max_frame: new Input({
					id: 'particle_texture_max_frame',
					label: '最大帧数',
					info: '最大帧数，第一帧为 1',
					enabled_modes: ['animated']
				}),
				stretch_to_lifetime: new Input({
					id: 'particle_texture_stretch_to_lifetime',
					label: '延长生命周期',
					info: '可选，调整 FPS 以匹配粒子的寿命。',
					type: 'checkbox',
					enabled_modes: ['animated']
				}),
				loop: new Input({
					id: 'particle_texture_loop',
					label: '循环',
					type: 'checkbox',
					enabled_modes: ['animated']
				}),
			}
		},
		color: {
			label: '颜色和光照',
			_folded: true,
			inputs: {
				mode: new Input({
					id: 'particle_color_mode',
					type: 'select',
					label: '色彩模式',
					mode_groups: ['particle', 'color'],
					options: {
						static: '静态',
						gradient: '梯度',
						expression: '表达式',
					},
				}),
				picker: new Input({
					id: 'particle_color_static',
					label: '颜色',
					type: 'color',
					enabled_modes: ['static'],
					info: '为所有发射的粒子设置静态颜色。材质为“半透明”时支持透明度。'
				}),
				interpolant: new Input({
					id: 'particle_color_interpolant',
					label: '插值',
					info: '颜色梯度插值。提示：在这里使用曲线！',
					enabled_modes: ['gradient']
				}),
				range: new Input({
					id: 'particle_color_range',
					label: '范围',
					info: '颜色渐变范围',
					type: 'number',
					value: 1,
					enabled_modes: ['gradient']
				}),
				gradient: new Gradient({
					id: 'particle_color_gradient',
					label: '梯度',
					info: '梯度',
					type: 'gradient',
					enabled_modes: ['gradient']
				}),
				expression: new Input({
					id: 'particle_color_expression',
					label: '颜色',
					info: '可以使用介于 0 和 1 直接的 Molang 表达式来设置 RGBA，只有使用“半透明”时支持透明颜色',
					axis_count: 4,
					enabled_modes: ['expression']
				}),
				light: new Input({
					id: 'particle_color_light',
					label: '环境照明',
					type: 'checkbox',
				}),
			}
		},
		collision: {
			label: '碰撞',
			_folded: true,
			inputs: {
				collision_radius: new Input({
					id: 'particle_collision_collision_radius',
					label: '碰撞半径',
					info: '用于最小化颗粒与环境的碰撞',
					min: 0.0,
					max: 0.5,
					step: 0.05,
					required: true,
					type: 'number',
				}),
				collision_drag: new Input({
					id: 'particle_collision_collision_drag',
					label: '碰撞阻力',
					info: '改变粒子碰撞时的速度',
					type: 'number',
					step: 0.1,
				}),
				coefficient_of_restitution: new Input({
					id: 'particle_collision_coefficient_of_restitution',
					label: '弹性',
					info: '设为0.0表示不反弹，设为1.0表示反弹至原始高点',
					type: 'number',
					step: 0.1,
				}),
				enabled: new Input({
					id: 'particle_collision_enabled',
					label: '条件',
					info: '当条件未填写/为True/非零时触发碰撞',
				}),
				expire_on_contact: new Input({
					id: 'particle_collision_expire_on_contact',
					label: '碰撞销毁',
					info: '当粒子碰到方块时销毁粒子',
					type: 'checkbox',
				}),
			}
		}
	}
};


function forEachInput(cb) {
	for (var k_subject in Data) {
		for (var k_group in Data[k_subject]) {
			var group = Data[k_subject][k_group]
			if (typeof group === 'object') {
				for (var key in group.inputs) {
					if (group.inputs[key] instanceof Input) {
						cb(group.inputs[key], key)
					}
				}
			}
		}
	}
}
//Setup Data
forEachInput(input => {
	if (input.type === 'select') {
		input.update(Data)
	}
})

window.Data = Data;
export default Data
export {forEachInput}
