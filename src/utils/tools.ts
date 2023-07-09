/** 这个文件封装了一些常用的工具函数 **/

import dayjs from "dayjs";
/**
 * 保留N位小数
 * 最终返回的是字符串
 * 若转换失败，返回参数原值
 * @param str - 数字或字符串
 * @param x   - 保留几位小数点
 */
export const pointX = (str: string | number, x = 0): string | number => {
	if (!str && str !== 0) {
		return str;
	}
	const temp = Number(str);
	if (temp === 0) {
		return temp.toFixed(x);
	}
	return temp ? temp.toFixed(x) : str;
};

/**
   去掉字符串两端空格
*/
export const trim = (str: string): string => {
	const reg = /^\s*|\s*$/g;
	return str.replace(reg, "");
};

/**
  给字符串打马赛克
  如：将123456转换为1****6，最多将字符串中间6个字符变成*
  如果字符串长度小于等于2，将不会有效果
*/
export const addMosaic = (str: string): string => {
	const s = String(str);
	const lenth = s.length;
	const howmuch = ((): number => {
		if (s.length <= 2) {
			return 0;
		}
		const l = s.length - 2;
		if (l <= 6) {
			return l;
		}
		return 6;
	})();
	const start = Math.floor((lenth - howmuch) / 2);
	const ret = s.split("").map((v, i) => {
		if (i >= start && i < start + howmuch) {
			return "*";
		}
		return v;
	});
	return ret.join("");
};
/**
 * 验证身份证
 * **/
export const checkIdCard = (str: string): boolean => {
	const rex = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	if (rex.test(str)) {
		// 系数
		const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		// 校验码对照表
		const b = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
		const ids = str.split("");
		let sum = 0;
		for (let i = 0; i < 17; i++) {
			sum += parseInt(ids[i]) * c[i];
		}
		if (ids[17].toUpperCase() != b[sum % 11].toUpperCase()) {
			return false;
		}
		return true;
	} else {
		return false;
	}
};
/**
 * 验证字符串
 * 只能为字母、数字、下划线
 * 可以为空
 * **/
export const checkStr = (str: string): boolean => {
	if (str === "") {
		return true;
	}
	const rex = /^[_a-zA-Z0-9]+$/;
	return rex.test(str);
};
/**
 * 验证字符串
 * 只能为数字
 * **/
export const checkNumber = (str: string): boolean => {
	const rex = /^\d*$/;
	return rex.test(str);
};
/** 正则 手机号验证 **/
export const checkPhone = (str: string | number): boolean => {
	const rex = /^1[345789]\d{9}$/;
	return rex.test(String(str));
};

/** 正则 固话验证 **/
export const checkTel = (str: string | number): boolean => {
	const rex = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
	return rex.test(String(str));
};

/** 正则 邮箱验证 **/
export const checkEmail = (str: string): boolean => {
	const rex = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
	return rex.test(str);
};
/** 正则 非中文 **/
export const checkNoZh = (str: string | number): boolean => {
	const rex = /^[^\u4e00-\u9fa5]*$/;
	return rex.test(String(str));
};
/** 正则 url地址 **/
export const checkUrl = (str: string): boolean => {
	const rex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
	return rex.test(str);
};

/**
  字符串加密
  简单的加密方法
*/
export const compile = (code: string): string => {
	let c = String.fromCharCode(code.charCodeAt(0) + code.length);
	for (let i = 1; i < code.length; i++) {
		c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
	}
	return c;
};

/**
  字符串解谜
  对应上面的字符串加密方法
*/
export const uncompile = (code: string): string => {
	let c = String.fromCharCode(code.charCodeAt(0) - code.length);
	for (let i = 1; i < code.length; i++) {
		c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
	}
	return c;
};

/**
 * 清除一个对象中那些属性为空值的属性
 * 0 算有效值
 * **/
export const clearNull = <T>(obj: T extends object?any:any): T => {
	const temp = { ...obj };
	Object.keys(temp).forEach(key => {
		if (temp[key] !== 0 && temp[key] !== "" && !temp[key]) {
			delete temp[key];
		} else if (typeof temp[key] === "string") {
			temp[key] = trim(temp[key]);
		}
	});
	return temp;
};

/**
 * 用while 实现的数组循环，相对for、for in要高效
 * @param array 数组
 * @param callback 回调函数
 */
export const forEach = <T>(array: T[], callback: (item: T, idx: number) => void): T[] => {
	let index = -1;
	const length = array.length;
	while (++index < length) {
		callback(array[index], index);
	}
	return array;
};

/**
 * 把层级数据转为一维数据
 * @param arr 数组
 */
export const flatten = (arr: any[] = [], param?: string): any[] => {
	return [].concat(
		...arr.map((item: any) => [].concat(item, ...flatten((param ? item[param] : item.items) || [], param)))
	);
};

/**
 * 把一维数据转为层级数据
 * @param arr 数组
 */
export const unflatten = (one: any, arr: any[]) => {
	let kids;
	if (!one) {
		// 第1次递归
		kids = arr.filter((item: any) => !item.parentId);
	} else {
		kids = arr.filter((item: any) => item.parentId === one.id);
	}
	forEach(kids, (item: any) => {
		item.items = unflatten(item, arr);
	});
	return kids.length ? kids : null;
};

// 详情显示地址组件数据
export const parseAddress = (str: string) => {
	return str.replace(/\//g, "").replace(/,/g, "");
};

// 通过code获取desc
export const getDescByCode = (
	arr: {
		desc: string;
		code: string | number;
	}[],
	code: string | number
) => {
	const obj = arr.find(item => item.code == code);
	return obj ? obj.desc : "";
};

// 通过desc获取code
export const getCodeByDesc = (
	arr: {
		desc: string;
		code: string | number;
	}[],
	desc: string
) => {
	const obj = arr.find(item => item.desc === desc);
	return obj ? obj.code : "";
};

// 数组去重（不能去掉{}）
export const unique = (arr: any[]) => {
	return Array.from(new Set(arr));
};

// 枚举 转 { label,value }
export const enumToSelectorOptions = (enumValue: any, enumType: any) => {
	return Object.entries(enumValue).map(([key, value]) => ({
		label: value as string,
		value: enumType[key],
	}));
};

// treeSelect设置不可选值
export const setDisabledById = (arr: any[], selectedId: string | number) => {
	if (!selectedId) {
		return arr;
	}
	for (let i = 0, len = arr.length; i < len; i++) {
		if (arr[i].id == selectedId) {
			arr[i].disabled = true;
			return arr;
		} else if (arr[i].items?.length) {
			arr[i].items = setDisabledById(arr[i].items, selectedId);
			arr[i].disabled = false;
		} else {
			arr[i].disabled = false;
		}
	}
	return arr;
};

export const isImage = (url: string) => {
	const arr = [
		"png",
		"jpg",
		"jpeg",
		"bmp",
		"gif",
		"webp",
		"psd",
		"svg",
		"tiff",
		"pjp",
		"jfif",
		"xbm",
		"dib",
		"jxl",
		"svgz",
		"ico",
		"tif",
		"pjpeg",
	];
	const index = url.lastIndexOf(".");
	const ext = url.substr(index + 1);
	return arr.includes(ext);
};
export const IsVideo = (url: string) => {
	const arr = ["AVI", "MOV", "RMVB", "RM", "FLV", "MP4", "3GP"];
	const index = url.lastIndexOf(".");
	const ext = url.substr(index + 1).toUpperCase();
	return arr.includes(ext);
};

export const timesTampFilter = (time: string | number, format = "YYYY-MM-DD HH:mm:ss") => {
	if (!time) return "";
	if (typeof time === "string") {
		time = dayjs(time).unix();
	}
	const len = time.toString().length > 10 ? 1 : 1000;
	const current = Math.round(new Date().getTime()) / len;
	const gap = current - time;
	if (gap < 1) {
		return "1秒前";
	}
	if (gap < 60) {
		// 1秒前
		return `${Math.floor(gap)}秒前`;
	}
	if (gap < 3600) {
		return `${Math.floor(gap / 60)}分钟前`;
	}
	if (gap < 86400) {
		return `${Math.floor(gap / 3600)}小时前`;
	}
	if (gap < 86400 * 3) {
		return `${Math.floor(gap / 86400)}天前`;
	}
	return dayjs(time * 1000).format("YYYY-MM-DD HH:mm:ss");
};

export const getParseTreeData = (arr: any[], title: string, value: string, param = "items") => {
	const oneDate = flatten(arr, param).map(item => {
		return {
			id: item.id,
			title: item[title],
			value: item[value],
			items: item[param],
			parentId: item.parentId,
		};
	});

	return unflatten(false, oneDate);
};

// base64转文件
export const dataURLtoFile = (dataUrl: any, fileName: string) => {
	const arr = dataUrl.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], fileName, { type: mime });
};

/**
 * 自适应
 * **/
export const fontSize = (res: number) => {
	//获取到屏幕的宽度
	const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	if (!clientWidth) return; //报错拦截：
	const fontSize = clientWidth / 1920;
	// let fontSize = 1
	return res * fontSize;
};

//打开全屏方法
export const openFullscreen = (element: any) => {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullScreen();
	}
};

//退出全屏方法
export const exitFullScreen = () => {
	const doc: any = document;
	if (doc.exitFullscreen) {
		doc.exitFullscreen();
	} else if (doc.mozCancelFullScreen) {
		doc.mozCancelFullScreen();
	} else if (doc.msExitFullscreen) {
		doc.msExiFullscreen();
	} else if (doc.webkitCancelFullScreen) {
		doc.webkitCancelFullScreen();
	} else if (doc.webkitExitFullscreen) {
		doc.webkitExitFullscreen();
	}
};

// 切换全屏
export const toggleFullScreen = (element = document) => {
	if (element.fullscreenElement) {
		exitFullScreen();
	} else {
		openFullscreen(element.documentElement);
	}
};

// 旋转图片
export const rotateImg = (url: string, imgType = "image/png") => {
	return new Promise(function (resolve, reject) {
		const img = new Image();
		img.src = url;
		img.crossOrigin = "anonymous";
		img.onload = function () {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			const width = img.width;
			const height = img.height;
			canvas.setAttribute("width", width + "");
			canvas.setAttribute("height", height + "");
			ctx?.rotate(Math.PI);
			ctx?.drawImage(img, -width, -height, width, height);

			const dataURL = canvas.toDataURL(imgType);
			console.log("dataURL: ", dataURL);
			resolve(dataURL);
		};
		img.onerror = () => {
			reject();
		};
	});
};

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len: number, date?: boolean) => {
	let random = "";
	random = Math.ceil(Math.random() * 100000000000000)
		.toString()
		.substring(0, len || 4);
	if (date) random = random + Date.now();
	return random;
};

/**
 * 密码加密处理
 */
// export const encryption = params => {
// 	let { data, type, param, key } = params;
// 	const result = JSON.parse(JSON.stringify(data));
// 	if (type === "Base64") {
// 		param.forEach(ele => {
// 			result[ele] = btoa(result[ele]);
// 		});
// 	} else {
// 		param.forEach(ele => {
// 			var data = result[ele];
// 			key = CryptoJS.enc.Latin1.parse(key);
// 			var iv = key;
// 			// 加密
// 			var encrypted = CryptoJS.AES.encrypt(data, key, {
// 				iv: iv,
// 				mode: CryptoJS.mode.CFB,
// 				padding: CryptoJS.pad.NoPadding
// 			});
// 			result[ele] = encrypted.toString();
// 		});
// 	}
// 	return result;
// };

//   获取路由参数
export const getUrlParam = (key: string) => {
	const params = new URLSearchParams(window.location.search)
	return params.get(key)
}

export // 格式化JSON数据
const transitionJsonToString = (jsonObj: string) => {
	// 转换后的jsonObj受体对象
	// let _jsonObj: any = null; // ts写法
	let _jsonObj = "";
	// 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
	if (Object.prototype.toString.call(jsonObj) !== "[object String]") {
		try {
			_jsonObj = JSON.stringify(jsonObj);
		} catch (error) {
			// 转换失败错误信息
			// callback(error);
		}
	} else {
		try {
			jsonObj = jsonObj.replace(/(\')/g, '"');
			_jsonObj = JSON.stringify(JSON.parse(jsonObj));
		} catch (error) {
			// 转换失败错误信息
			// callback(error);
		}
	}
	return _jsonObj;
};

// json格式化
export const formatJson = (jsonObj: string) => {
	//  console.log(jsonObj)
	//  console.log(callback)
	// 正则表达式匹配规则变量
	const reg = null;
	// 转换后的字符串变量
	let formatted = "";
	// 换行缩进位数
	let pad = 0;
	// 一个tab对应空格位数
	const PADDING = "\t";
	// json对象转换为字符串变量
	let jsonString = transitionJsonToString(jsonObj);
	if (!jsonString) {
		return jsonString;
	}
	// 存储需要特殊处理的字符串段
	const _index: { start: number; end: number }[] = [];
	// 存储需要特殊处理的“再数组中的开始位置变量索引
	let _indexStart: number | null = null;
	// 存储需要特殊处理的“再数组中的结束位置变量索引
	let _indexEnd: number | null = null;
	// 将jsonString字符串内容通过\r\n符分割成数组
	let jsonArray: string[] = [];
	// 正则匹配到{,}符号则在两边添加回车换行
	jsonString = jsonString.replace(/([\{\}])/g, "\r\n$1\r\n");
	// 正则匹配到[,]符号则在两边添加回车换行
	jsonString = jsonString.replace(/([\[\]])/g, "\r\n$1\r\n");
	// 正则匹配到,符号则在两边添加回车换行
	jsonString = jsonString.replace(/(\,)/g, "$1\r\n");
	// 正则匹配到要超过一行的换行需要改为一行
	jsonString = jsonString.replace(/(\r\n\r\n)/g, "\r\n");
	// 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
	jsonString = jsonString.replace(/\r\n\,/g, ",");
	// 特殊处理双引号中的内容
	jsonArray = jsonString.split("\r\n");
	jsonArray.forEach((node: string, index) => {
		// 获取当前字符串段中"的数量
		const num = node.match(/\"/g)?.length || 0;
		// 判断num是否为奇数来确定是否需要特殊处理
		if (num % 2 && !_indexStart) {
			_indexStart = index;
		}
		if (num % 2 && _indexStart && _indexStart != index) {
			_indexEnd = index;
		}
		// 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
		if (_indexStart && _indexEnd) {
			_index.push({
				start: _indexStart,
				end: _indexEnd,
			});
			_indexStart = null;
			_indexEnd = null;
		}
	});
	// 开始处理双引号中的内容，将多余的"去除
	_index.reverse().forEach(function (item, index) {
		const newArray = jsonArray.slice(item.start, item.end + 1);
		jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(""));
	});
	// 将处理后的数组通过\r\n连接符重组为字符串
	jsonString = jsonArray.join("\r\n");
	// 将匹配到:后为回车换行加大括号替换为冒号加大括号
	jsonString = jsonString.replace(/\:\r\n\{/g, ":{");
	// 将匹配到:后为回车换行加中括号替换为冒号加中括号
	jsonString = jsonString.replace(/\:\r\n\[/g, ":[");
	// 将上述转换后的字符串再次以\r\n分割成数组
	jsonArray = jsonString.split("\r\n");
	// 将转换完成的字符串根据PADDING值来组合成最终的形态
	jsonArray.forEach(function (item, index) {
		// console.log(item);
		let i = 0;
		// 表示缩进的位数，以tab作为计数单位
		let indent = 0;
		// 表示缩进的位数，以空格作为计数单位
		let padding = "";
		if (item.match(/\{$/) || item.match(/\[$/)) {
			// 匹配到以{和[结尾的时候indent加1
			indent += 1;
		} else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
			// 匹配到以}和]结尾的时候indent减1
			if (pad !== 0) {
				pad -= 1;
			}
		} else {
			indent = 0;
		}
		for (i = 0; i < pad; i++) {
			padding += PADDING;
		}
		formatted += padding + item + "\r\n";
		pad += indent;
	});
	// 返回的数据需要去除两边的空格和换行
	return formatted.trim().replace(new RegExp("^\\" + "<br />" + "+|\\" + "<br />" + "+$", "g"), "");
};

// json校验
export const validJson = (jsonStr: any) => {
    try { 
        const str = jsonStr.replace(/[\r\n\t]/g, "");
        let json = JSON.stringify(JSON.parse(str));
        return {
            isValid: true,
            data:json,
            errorData: []
        };
    } catch (error) {
        let res = jsonStr;
        const valueStr = jsonStr
        const stack: any[] = [];
        const stackPos: {row: number,col:number,letter:string|number}[] = [];
        const vaildStrPos: {row: number,col:number,letter:string|number}[] = [];
        let rowCount = 1; // 行号
        let letterCount = 0; // 字符位置
        let strFlagCount = 0; // 判断是否在输入string

        const check = (chart: string) => {
            return ['\n','\t','\r',' '].includes(chart)
        }

        for(let i=0;i<valueStr.length;i++) {
            // stack.push(valueStr[i]); 
            // continue; 
            letterCount++;
            if(check(valueStr[i])) {
                if(valueStr[i]==='\n') {
                    rowCount++;
                    letterCount = 0;
                }
                continue;
            }
            // 压栈
            if(i === 0) {
                if(!['{','[','"'].includes(valueStr[i])) { // 首行校验
                    vaildStrPos.push({
                        row: 1,
                        col: 1,
                        letter: valueStr[i]
                    });
                } else {
                    stack.push(valueStr[i]);
                    stackPos.push({
                        row: 1,
                        col: 1,
                        letter: valueStr[i]
                    });
                    continue;
                }
            }
            if(valueStr[i]==='{') {
                if(strFlagCount%2===1) continue;
                if((i===1 && valueStr[i-1]==='' && check(valueStr[i-1])) || valueStr[i-1]===':') { // { 必须在首行首字，或者冒号后出现
                    stack.push(valueStr[i]);
                    stackPos.push({
                        row: rowCount,
                        col: letterCount,
                        letter: valueStr[i]
                    });
                } else { 
                    vaildStrPos.push({
                        row: rowCount,
                        col: letterCount,
                        letter: valueStr[i]
                    });
                }
            }else if(valueStr[i]==='[') {
                if(strFlagCount%2===1) continue;
                if((i===1 && valueStr[i-1]==='') || valueStr[i-1]===':') { // [ 必须在首行首字，或者冒号后出现
                    stack.push(valueStr[i]);
                    stackPos.push({
                        row: rowCount,
                        col: letterCount,
                        letter: valueStr[i]
                    });
                } else { 
                    vaildStrPos.push({
                        row: rowCount,
                        col: letterCount,
                        letter: valueStr[i]
                    });
                }
            }else if(valueStr[i]==='"') {
                strFlagCount++;
                if(!['{','[',',',':'].includes(stack[stack.length-1]) && strFlagCount%2===1) {
                    vaildStrPos.push({
                        row: rowCount,
                        col: letterCount,
                        letter: valueStr[i]
                    });
                }
                if(stack.length===0 || (stack.length>0 && stack[stack.length-1] !=='"')) {
                    // '"' 必须在首行首字，或者冒号后出现
                    stack.push(valueStr[i]);
                    stackPos.push({
                        row: rowCount,
                        col: letterCount,
                        letter: valueStr[i]
                    });
                    continue;
                } else {
                    stack.pop();
                    stackPos.pop();
                }
                
            } else if(valueStr[i]===':') {
                if(strFlagCount%2===1) continue;
                stack.push(valueStr[i]);
                stackPos.push({
                    row: rowCount,
                    col: letterCount,
                    letter: valueStr[i]
                });
                if(valueStr[i-1]!=='"' || ['}',']',',','\n'].includes(valueStr[i+1])) {
                    vaildStrPos.push({
                        row: rowCount,
                        col: letterCount,
                        letter: valueStr[i]
                    });
                }
                continue;
            } else if (valueStr[i]===',') {
                if(strFlagCount%2===1) { 
                    letterCount++;
                    continue; 
                }
                let lastChart = "";
                for(let j=i+1;j<valueStr.length;j++) {
                    if(check(valueStr[j])) continue;
                    if([',',']'].includes(valueStr[j])) break;
                    if(valueStr[j]==='}') {
                        vaildStrPos.push({
                            row: rowCount,
                            col: letterCount,
                            letter: valueStr[i]
                        });
                        lastChart=valueStr[j]; break;
                    }
                }
                if(stack[stack.length-1] === ':' && valueStr[i-1]==='"') {
                    stack.pop();
                    stackPos.pop();
                    continue;
                }
                if (stack[stack.length-1]==='[') {
                    continue;
                }
            } else if(strFlagCount%2!==1 && !['}',']',',','-'].includes(valueStr[i])) {
                const word = valueStr[i]+valueStr[i+1]+valueStr[i+2]+valueStr[i+3]+valueStr[i+4]
                if(!(valueStr[i]==='t' && word.includes('true')) &&
                !(valueStr[i]==='f' && word.includes('false')) &&
                !(valueStr[i]==='n' && word.includes('null'))) {
                    vaildStrPos.push({
                        row: rowCount,
                        col: letterCount,
                        letter: valueStr[i]
                    });
                }
            }
            if(stack.length===0) continue;
            // 出栈
            const lastSign = stack[stack.length-1];
            if(valueStr[i]===']' && lastSign==='[') {
                stack.pop();
                stackPos.pop();
                continue;
            }
            if(valueStr[i]==='}'&& stack[stack.length-1]==='{') {
                stack.pop();
                stackPos.pop();
                continue;
            }
        }
		const errorData: {
			row:number;
			cols: {
				col: number;
				letter: string | number;
			}[];
		}[] = [];
		if(stack.length!==0 || vaildStrPos.length>0) {
			vaildStrPos.concat(stackPos).map(v=>{
				const { row,col,letter } = v
				const index = errorData.findIndex(v2=>v2.row===row);
				if(index !== -1) { errorData[index].cols.push({
					col,
					letter
				})} else {
					errorData.push({
						row,
						cols: [{
							col,
							letter
						}]
					})
				}
				return v;
			})
		}
        return {
            isValid: !(stack.length!==0 || vaildStrPos.length>0),
            data: stack.length!==0 || vaildStrPos.length>0 ? res : formatJson(jsonStr),
            errorData
        };
    }
}

// 向量COS相关度
export function cosineSimilarity(a: any[], b: any[]) {
	const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
	const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
	const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
	return dotProduct / (magnitudeA * magnitudeB);
}


// 返回JSON
export function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2); //返回要JSON化的对象，2是spacing
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span style="color: green;">' + match + '</span>';
        }
    );
}
