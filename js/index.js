/**
 * @description 初始化变量
 */
const breakpoint = 575
const domWidth =
	document.documentElement.clientWidth || document.body.clientWidth

/**
 * @description: 判断客户端是PC端还是移动端
 * @return {*}
 * @author: Herway
 */
const os = (function () {
	const ua = navigator.userAgent,
		isWindowsPhone = /(?:Windows Phone)/.test(ua),
		isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
		isAndroid = /(?:Android)/.test(ua),
		isFireFox = /(?:Firefox)/.test(ua),
		isChrome = /(?:Chrome|CriOS)/.test(ua),
		isTablet =
			/(?:iPad|PlayBook)/.test(ua) ||
			(isAndroid && !/(?:Mobile)/.test(ua)) ||
			(isFireFox && /(?:Tablet)/.test(ua)),
		isPhone = /(?:iPhone)/.test(ua) && !isTablet,
		isPc = !isPhone && !isAndroid && !isSymbian
	return {
		isTablet: isTablet,
		isPhone: isPhone,
		isAndroid: isAndroid,
		isPc: isPc,
	}
})()

/**
 * @description: 处理PC端浏览器宽度变化时，刷新当前页面，以免页面显示混乱
 * @param {*} os
 * @return {*}
 * @author: Herway
 */
function isPcResize () {
	if (os.isPc) {
		addEventListener('resize', () => {
			location.reload()
		})
	}
}

/**
 * @description: 防抖:触发事件后n秒后才执行，如果在n秒内又触发了事件，则会重新计算函数执行时间
 * @param {function} func 需要执行的函数
 * @param {number} wait 时间
 * @param {boolean} immediate true 表立即执行，false 表非立即执行
 * @return {function} 需要执行的函数
 * @author: Herway
 */
function debounce (func, wait, immediate) {
	let timeout
	return function () {
		const context = this
		const args = [...arguments]
		if (timeout) clearTimeout(timeout)
		if (immediate) {
			const callNow = !timeout
			timeout = setTimeout(() => {
				timeout = null
			}, wait)
			if (callNow) func.apply(context, args)
		} else {
			timeout = setTimeout(() => {
				func.apply(context, args)
			}, wait)
		}
	}
}

/**
 * @desc 节流: 连续触发事件n秒中只执行一次
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle (func, wait, type) {
	if (type === 1) {
		let previous = 0
	} else if (type === 2) {
		let timeout
	}
	return function () {
		let context = this
		let args = arguments
		if (type === 1) {
			let now = Date.now()
			if (now - previous > wait) {
				func.apply(context, args)
				previous = now
			}
		} else if (type === 2) {
			if (!timeout) {
				timeout = setTimeout(() => {
					timeout = null
					func.apply(context, args)
				}, wait)
			}
		}
	}
}

/**
 * @description: 处理手机端Header部分的显示隐藏
 * @param {string} elm	点击显示元素的类名
 * @param {string} elm2	点击显示元素的类名
 * @param {string} addClass	需要添加的类 (不要加.)
 * @param {string} addClass2	需要添加的类 (不要加.)
 * @return {*}
 * @author: Herway
 */
function bodyScroll (event) {
	event.preventDefault()
}
function canHeadShow (elm, elm2, addClass, addClass2) {
	let Elm = document.querySelector(elm)
	let Elm2 = document.querySelector(elm2)
	let allcityBtn = document.querySelector('.allcity-btn')
	let allcityBox = document.querySelector('.allcity-box')
	let isShow = false

	Elm.addEventListener('click', () => {
		// 初始化避免显示冲突

		if (domWidth <= breakpoint) {
			// 排除电脑端
			document.querySelector('.allcity-box').style.display = 'none'
			document.querySelector('.nav').style.display = 'none'
			document.querySelector('.search').style.display = 'none'
			document.querySelector('.menu-icon').classList.remove('menu-closeable')
			document
				.querySelector('.m-ico-search')
				.classList.remove('m-ico-search-img-hide', 'menu-closeable')
		}
		// 初始化结束

		isShow = !isShow
		if (isShow) {
			if (addClass || addClass2) Elm.classList.add(addClass, addClass2)
			Elm2.style.display = 'block'
			document.body.addEventListener('click', e => {
				if (
					e.target !== allcityBtn &&
					e.target !== allcityBox &&
					allcityBox.style.display === 'block'
				) {
					Elm2.style.display = 'none'
					isShow = !isShow
				}
			})
			if (elm2 === '.nav') return
			document.body.addEventListener('touchmove', bodyScroll, {
				passive: false,
			})
		} else {
			if (addClass || addClass2) Elm.classList.remove(addClass, addClass2)
			Elm2.style.display = 'none'
			document.body.removeEventListener('touchmove', bodyScroll, {
				passive: false,
			})
		}
	})
}
if (domWidth <= breakpoint) {
	canHeadShow('.allcity-btn', '.allcity-box')
} else {
	moveHover('.allcity-btn', '.allcity-box')

}

canHeadShow('.menu-icon', '.nav', 'menu-closeable')
canHeadShow(
	'.m-ico-search',
	'.search',
	'm-ico-search-img-hide',
	'menu-closeable'
)

function moveHover (hoverEml, showEml) {
	let hEml = document.querySelector(hoverEml)
	let sEml = document.querySelector(showEml)
	hEml.addEventListener('mouseover', (e) => {
		sEml.classList.add('show', 'select-open')
	})
	hEml.addEventListener('mouseout', (e) => {
		sEml.classList.remove('show', 'select-open')
	})
	sEml.addEventListener('mouseover', (e) => {
		sEml.classList.add('show', 'select-open')
	})
	sEml.addEventListener('mouseout', (e) => {
		sEml.classList.remove('show', 'select-open')
	})
}

/**
 * @description: 处理切换
 * @param {string} clickTitItem 点击小标题切换的类名
 * @param {string} showBoxItem	切换显示内容的类名
 * @param {string} addTitClass	小标题需要添加的类 (不要加.)
 * @param {string} addBoxClass	内容需要添加的类	(不要加.)
 * @param {Boolean} clickSelfHide 切换显示元素是否移除添加的类 （默认不移除）
 * @return {*}
 * @author: Herway
 */
function calssItemSwitch (
	clickTitItem,
	showBoxItem,
	addTitClass,
	addBoxClass,
	clickSelfHide = false
) {
	let clickTitItems = [...document.querySelectorAll(clickTitItem)]
	let showBoxItems = [...document.querySelectorAll(showBoxItem)]
	clickTitItems.forEach((elm, i) => {
		elm.addEventListener('click', () => {
			if (clickSelfHide && showBoxItems[i].classList.contains(addBoxClass)) {
				showBoxItems[i].classList.remove(addBoxClass)
				return
			}
			clickTitItems.forEach(elm => {
				elm.classList.remove(addTitClass)
			})
			showBoxItems.forEach(elm => {
				elm.classList.remove(addBoxClass)
			})
			elm.classList.add(addTitClass)
			if (showBoxItems[i]) showBoxItems[i].classList.add(addBoxClass)
		})
	})
}
calssItemSwitch(
	'.list-school .tit-r-item',
	'.list-school .school-con',
	'tit-r-item-current',
	'show-flex'
)
calssItemSwitch(
	'.list-major .tit-r-item',
	'.list-major .major-con',
	'tit-r-item-current',
	'show-flex'
)
calssItemSwitch(
	'.list-news .tit-r-item',
	'.list-news .news-con-items',
	'tit-r-item-current',
	'show'
)
calssItemSwitch(
	'.sidebar-hot-list > div',
	'.sidebar-hot-con',
	'sidebar-hot-current',
	'show'
)
calssItemSwitch(
	'.switch-tit-item',
	'.switch-box-item',
	'switch-tit-item-show',
	's'
)
calssItemSwitch('.nav-item', '.s', 'nav-item-show', 's')
calssItemSwitch(
	'.classify-item-title',
	'.classify-item-ul',
	's',
	'scale-up-ver-top',
	true
)

calssItemSwitch(
	'.school-rank .tit-r-item',
	'.school-rank .school-rank-box',
	'tit-r-item-current',
	'school-rank-box-show'
)
calssItemSwitch(
	'.school-guide .special-tit',
	'.school-guide .school-guide-box-li',
	'special-tit-show',
	'show'
)
	/**
	 * @description: 搜索的切换
	 * @return {*}
	 * @author: Herway
	 */
	; (function () {
		let serSelect = document.querySelector('.ser-select')
		let formSearch = document.querySelector('.form-search .ser-tit')
		let serSons = [...document.querySelectorAll('.ser-son')]
		let searchShow = false
		formSearch.addEventListener('click', () => {
			if (!searchShow) {
				serSelect.classList.add('show')
				searchShow = !searchShow
				document.body.addEventListener('click', e => {
					if (e.target !== formSearch && serSelect.classList.contains('show')) {
						serSelect.classList.remove('show')
						searchShow = !searchShow
					}
				})
			} else {
				serSelect.classList.remove('show')
				searchShow = !searchShow
			}
		})
		serSons.forEach(elm => {
			elm.addEventListener('click', () => {
				serSons.forEach(elm2 => {
					elm2.classList.remove('ser-current')
				})
				elm.classList.add('ser-current')
				let serSondata = elm.getAttribute('data-value')
				let letserSonId = elm.getAttribute('data-id')
				let serSonTit = elm.innerText
				let serTit = document.querySelector('.ser-tit')
				let tbname = document.querySelector('.tbname')
				serTit.innerText = serSonTit
				tbname.setAttribute('value', serSondata)
				let temp = document.querySelector('.tempid')
				temp.setAttribute('value', letserSonId)
				serSelect.classList.remove('show')
				searchShow = !searchShow
			})
		})
	})()
/**
 * @description: 隐藏空标签
 * 使用方法
 * 需要隐藏的内容添加类名‘is-empty-element___xxx’
 * xxx：为额外隐藏的元素，如 需要隐藏内容的小标题标签 可为空
 * 默认隐藏内容的亲父亲
 * @param {string} element 需要获取的类名前缀
 * @return {*}
 * @author: Herway
 */
function isEmpty (element) {
	let empty = document.querySelectorAll(`*[class*='${element}']`)
	if (!empty.length) return
	empty.forEach(item => {
		let hideClass = item.getAttribute('class').split('___')[1]
		let content = item.innerHTML.trim()
		if (content === '' || item.childElementCount === 0) {
			console.log('此元素已隐藏=》', item.parentNode)
			item.parentNode.style.display = 'none'

			if (hideClass) {
				if (document.getElementsByClassName(hideClass)[0]) {
					document.getElementsByClassName(hideClass)[0].style.cssText +=
						'display:none !important;'
				}
			}
		}
	})
}
isEmpty('is-empty-element')
/**
 * @description: 列表页高亮显示
 * @return {*}
 * @author: Herway
 */
function majorHighlight () {
	let path = document.querySelector('.nav-path')
	if (!path) return
	let fullText = path.innerText
	let pathArr = fullText.split('>')
	let classifyA = [...document.querySelectorAll('.list-classify a')]
	let optionsA = [
		...document.querySelectorAll('.list-options .list-options-item'),
	]
	classifyA.forEach((item, index, arr) => {
		if (
			pathArr[pathArr.length - 1].trim() === '中职专业' ||
			pathArr[pathArr.length - 1].trim() === '全国中职学校'
		) {
			arr[0].classList.add('classify-active')
		}
		if (fullText.includes(item.innerText)) {
			item.classList.add('classify-active')
		}
	})
	optionsA.forEach((item, index, arr) => {
		if (fullText.includes(item.innerText)) {
			item.classList.add('list-options-item-show')
		}
	})
}
majorHighlight()

/**
 * @description:
 * @param {string} clickTitItem 点击的小标题的类名
 * @param {string} showBoxItem 移动内容项的类名
 * @param {string} addTitClass	小标题添加的类名（不需要加.)
 * @return {*}
 * @author: Herway
 */
function switchJump (clickTitItem, showBoxItem, addTitClass) {
	let jumps = [...document.querySelectorAll(showBoxItem)]
	let switchItems = [...document.querySelectorAll(clickTitItem)]
	let osTop = 0
	let jumpTopArr = []

	jumps.forEach((item, index) => {
		jumpTopArr.push(item.offsetTop)
	})
	switchItems.forEach((item, index) => {
		item.addEventListener('click', () => {
			window.scrollTo({
				top: jumpTopArr[index] - 80,
				left: 0,
				behavior: 'smooth',
			})
		})
	})
	document.addEventListener('scroll', () => {
		osTop = document.documentElement.scrollTop || document.body.srcollTop
	})
}
switchJump('.switch-tit-item', '.switch-box-item', 'switch-tit-item-show')

/**
 * @description: 设置段落前2字变大
 * @param {string} elm 需要操作的段落的类名需要加.
 * @return {*}
 * @author: Herway
 */
function firstTwoStrBig (elm, className) {
	let twoBig = document.querySelector(elm)
	if (twoBig) {
		let twoBigTit = twoBig.innerText
		twoBig.innerHTML = `<span class='${className}'>${twoBigTit.slice(
			0,
			2
		)}</span>${twoBigTit.slice(2)}`
	}
}
firstTwoStrBig('.zt-daoyu > p')
firstTwoStrBig('.topic-daoyu > p', 'big-word')
function shallowCopy (obj) {
	const cloneObj = {}
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			cloneObj[key] = obj[key]
		}
	}
	return cloneObj
}

function deepClone (obj) {
	const cloneObj = new obj.constructor()
	if (obj === null) return obj
	if (obj instanceof Date) return new Date(obj)
	if (obj instanceof RegExp) return new RegExp(obj)
	if (typeof obj !== 'object') return obj
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			cloneObj[key] = deepClone(obj[key])
		}
	}
	return cloneObj
}

/**
 * @description: 返回顶部按钮
 * @return {*}
 * @author: Herway
 */
function goTop () {
	let osTop
	let gotop = document.querySelector('.gotop')
	if (!gotop) return
	document.addEventListener('scroll', () => {
		osTop = document.documentElement.scrollTop || document.body.srcollTop
		if (osTop > 600) {
			gotop.style.display = 'flex'
		} else {
			gotop.style.display = 'none'
		}
	})

	gotop.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'instant',
		})
	})
}
goTop()

/**
 * @description: 热门专题生成目录
 * @return {*}
 * @author: Herway
 */
function buildDirectory () {
	let tocContent = document.querySelector('.topic-con-main')
	let tocBox = document.querySelector('.topic-con-toc-box')
	if (tocContent) {
		let allTitle = [...tocContent.querySelectorAll('h1, h2, h3')]
		if (allTitle.length < 2) return
		allTitle.forEach((item, i) => {
			item.setAttribute('id', `heading-${i}`)
		})
		let osTop
		if (os.isPc) {
			document.addEventListener('scroll', () => {
				osTop =
					document.documentElement.scrollTop || document.body.srcollTop || 0
				if (osTop > tocContent.offsetTop) {
					tocBox.style.position = 'fixed'
				} else {
					tocBox.style.position = 'static'
				}
			})

			tocbot.init({
				tocSelector: '.topic-toc',
				contentSelector: '.topic-con-main',
				headingSelector: 'h1, h2,h3',
				hasInnerContainers: true,
				scrollSmooth: true,
				includeTitleTags: false,
			})
		} else {
			let directoryElement = document.createElement('button')
			directoryElement.setAttribute('class', 'directory')
			directoryElement.innerText = '目录'
			let suspension = document.querySelector('.suspension-panel')
			suspension.insertBefore(directoryElement, suspension.firstChild)

			tocbot.init({
				tocSelector: '.topic-toc',
				contentSelector: '.topic-con-main',
				headingSelector: 'h1, h2,h3',
				scrollSmooth: true,
				scrollSmoothDuration: 400,
				headingsOffset: 50,
				scrollSmoothOffset: -50,
				includeTitleTags: false, // 給目录链接设置title
			})
		}

		let directory = document.querySelector('.directory')
		if (!directory) return
		directory.addEventListener('click', () => {
			tocBox.classList.add('show', 'toc-in')

			let div = document.createElement('div')
			div.classList.add('model', 'show')
			let body = document.body
			body.appendChild(div)

			let model = document.querySelector('.model')
			model.addEventListener('click', () => {
				body.removeChild(model)
				tocBox.classList.add('toc-out')
				setTimeout(() => {
					tocBox.classList.remove('show', 'toc-in', 'toc-out')
				}, 500)
			})

			let tocLink = [...tocBox.querySelectorAll('.toc-link')]

			tocLink.forEach(item => {
				item.addEventListener('click', () => {
					tocBox.classList.add('toc-out')
					setTimeout(() => {
						tocBox.classList.remove('show', 'toc-in', 'toc-out')
					}, 500)

					body.removeChild(model)
				})
			})
		})
	}
}
buildDirectory()

/**
 * @description: 过滤热门专题文章内容的一级标题逗号
 * @return {*}
 * @author: Herway
 */
function filterComma () {
	let detailsAllH1Em = [
		...document.querySelectorAll('.topic-details h1[id^=heading] > em'),
	]
	detailsAllH1Em.forEach((item, i, arr) => {
		arr[i].innerText = item.innerText.replace('、', '')
	})
}
filterComma()

function getTimer (stringTime) {
	let minute = 1000 * 60
	let hour = minute * 60
	let day = hour * 24
	let week = day * 7
	let month = day * 30
	let time1 = new Date().getTime() //当前的时间戳

	let time2 = Date.parse(new Date(stringTime)) //指定时间的时间戳

	let time = time1 - time2

	let result = null
	if (time < 0) {
		alert('设置的时间不能早于当前时间！')
	} else if (time / month >= 1) {
		result = parseInt(time / month) + '月前'
	} else if (time / week >= 1) {
		result = parseInt(time / week) + '周前'
	} else if (time / day >= 1) {
		result = +parseInt(time / day) + '天前'
	} else if (time / hour >= 1) {
		result = +parseInt(time / hour) + '小时前'
	} else if (time / minute >= 1) {
		result = +parseInt(time / minute) + '分钟前'
	} else {
		result = '刚刚发布！'
	}
	return result
}

function topicTime () {
	let topicTimes = [
		...document.querySelectorAll('.list-topic .topic-item-time'),
	]
	topicTimes.forEach((item, i, arr) => {
		arr[i].innerText = getTimer(item.innerText)
	})
}
topicTime()
/**
 * @description: 处理手机端全国站学校列表页分类下拉显示
 * @return {*}
 * @author: Herway
 */
function schoolSortSwitch () {
	let schoolSortTit = document.querySelector('.classify-m-title')
	if (!schoolSortTit) return
	let classifyUl = document.querySelectorAll('.classify-item-ul')
	schoolSortTit.addEventListener('click', () => {
		if (classifyUl[0].classList.contains('scale-up-ver-top')) {
			classifyUl.forEach(item => {
				item.classList.remove('scale-up-ver-top')
			})
			return
		}
		classifyUl.forEach(item => {
			item.classList.add('scale-up-ver-top')
		})
	})
}
schoolSortSwitch()

/**
 * @description: 全国站学校详情页补齐开设专业
 * @return {*}
 * @author: Herway
 */
function openMajorAppend () {

	let openMajorElm = document.querySelector('.major-school .school-title[data-kszy]')
	if (!openMajorElm) return
	let openMajor = openMajorElm.dataset.kszy
	let openMajorArr = openMajor.split(',')
	openMajorArr = openMajorArr.filter(item => item.length > 0)

	let realOpenMajor = [...document.querySelectorAll('.major-school .zhaogshenzy-a')]

	let realOpenMajorArr = realOpenMajor.map(item => item.innerText)
	let EmlOpenMajorArr = []
	openMajorArr.forEach(item => {
		if (!realOpenMajorArr.includes(item)) {
			EmlOpenMajorArr.push(item)
		}
	})

	let openMajorBox = document.querySelector('.major-school .zhaogshenzy')

	EmlOpenMajorArr.forEach(item => {
		let newOpenMajorElmP = document.createElement('p')
		newOpenMajorElmP.className = 'zhaogshenzy-item one-ellipsis'
		newOpenMajorElmP.innerHTML = item
		newOpenMajorElmP.title = item
		openMajorBox.appendChild(newOpenMajorElmP)
	})
}
openMajorAppend()