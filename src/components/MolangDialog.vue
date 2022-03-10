<template>
    <dialog id="molang_sheet" class="dialog">
        <div class="tool close_button" @click="$emit('close')"><i class="unicode_icon">{{'\u2A09'}}</i></div>
        <h2>MoLang 语法表</h2>
        <div class="scrollable">
            <h3>变量</h3>
            <ul>
                <li><code>variable.emitter_lifetime</code> 发射器生命周期</li>
                <li><code>variable.emitter_age</code> 发射器寿命</li>
                <li><code>variable.emitter_random_1</code> 每个发射器循环的 0 到 1 之间的随机常数</li>
                <li><code>variable.emitter_random_2</code> 随机数</li>
                <li><code>variable.emitter_random_3</code> 随机数</li>
                <li><code>variable.emitter_random_4</code> 随机数</li>
                <li><code>variable.particle_lifetime</code> 粒子生命周期</li>
                <li><code>variable.particle_age</code> 粒子寿命</li>
                <li><code>variable.particle_random_1</code> 每个粒子循环的 0 到 1 之间的随机常数</li>
                <li><code>variable.particle_random_2</code> 随机数</li>
                <li><code>variable.particle_random_3</code> 随机数</li>
                <li><code>variable.particle_random_4</code> 随机数</li>
                <li><code>variable.entity_scale</code> 附属实体的比例</li>
            </ul>
            <h3>数学运算</h3>
            <ul>
                <li><code>math.abs(value)</code> 返回 value 的绝对值</li>
                <li><code>math.sin(value)</code> 返回 value 的正弦(度)</li>
                <li><code>math.cos(value)</code> 返回 value 的余弦(度)</li>
                <li><code>math.clamp(value, min, max)</code> 将 value 限制在 min 和 max 之间</li>
                <li><code>math.ceil(value)</code> 将 value 向上取整</li>
                <li><code>math.floor(value)</code> 将 value 向下取整</li>
                <li><code>math.trunc(value)</code> 返回 value 的整数部分</li>
                <li><code>math.round(value)</code> 将 value 四舍五入</li>
                <li><code>math.mod(value, denominator)</code> 返回 value 的余数</li>
                <li><code>math.pow(base, exponent)</code> 返回 base 的 exponent 次方</li>
                <li><code>math.sqrt(value)</code> 返回 value 的平方根</li>
                <li><code>math.exp(value)</code> 返回 E 的 value 次幂</li>
                <li><code>math.pi</code> 返回常量 Pi 的浮点数</li>
                <li><code>math.max(A, B)</code> 返回 A 与 B 的最大值</li>
                <li><code>math.min(A, B)</code> 返回 A 与 B 的最小值</li>
                <li><code>math.asin(value)</code> 返回 value 的反正弦</li>
                <li><code>math.acos(value)</code> 返回 value 的反余弦</li>
                <li><code>math.atan(value)</code> 返回 value 的反正切</li>
                <li><code>math.atan2(y, x)</code> 返回 y/x 的反正切。 注意参数的顺序</li>
                <li><code>math.random(low, high)</code> 随机一个 low 和 high 之间的随机数(包含 high)</li>
                <li><code>math.random_integer(low, high)</code> 随机一个 low 和 high 之间的随机整数(包含 high)</li>
                <li><code>math.die_roll(num, low, high)</code> 返回 num 个随机数的集合，每个随机数的值从低到高。注意：生成的随机数不是像普通骰子那样的整数。如有需要，请使用 “math.die_roll_integer”</li>
                <li><code>math.die_roll_integer(num, low, high)</code> 返回 num 个随机整数的集合，每个整数的值从低到高。注意：生成的随机数是像普通骰子一样的整数。</li>
                <li><code>math.hermite_blend(value)</code> 对于使用 Hermite Basis 函数之一的简单平滑曲线插值很有用：`3t^2 - 2t^3`。请注意，虽然任何有效的浮点数都是有效的输入，但此函数在 [0,1] 范围内效果最佳。</li>
                <li><code>math.lerp(start, end, 0_to_1)</code> 线性插值(在 0_to_1 的时间内,从 start 到 end)</li>
                <li><code>math.lerprotate(start, end, 0_to_1)</code> 线性插值(在 0_to_1 的时间内,绕圆的最短方向旋转 start角度 到 end角度)</li>
                <li><code>math.ln(value)</code> 返回 value 的自然对数</li>
            </ul>
            <a href="https://bedrock.dev/docs/stable/MoLang" target="_blank" style="margin-top: 12px; display: block;">完整的 Molang 文档</a>
        </div>
    </dialog>
</template>

<script>
export default {
    name: 'molang-dialog'
}
</script>

<style scoped>
	.scrollable {
		overflow-y: scroll;
	}
	#molang_sheet code {
		padding: 2px 8px;
		color: var(--teal);
		font-size: 0.9em;
		background-color: var(--color-dark);
		user-select: text;
    }
    li {
        text-indent: -20px;
	    padding-left: 20px;
    }
</style>