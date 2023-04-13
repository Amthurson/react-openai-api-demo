/** 对axios做一些配置 **/

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";
import { clearNull } from "@/utils/tools";
import qs from "qs";

type Result<T> = T;

// 自定义RequestConfig扩展AxiosRequestConfig
type RequestConfig = AxiosRequestConfig & {
	isAbsentRespone?: boolean;
};

// 自定义Response扩展AxiosResponse
type Response<T = any> = AxiosResponse<T> & {
	config: RequestConfig;
};

// 请求字典
export const pendingRequest = new Map();

// 请求唯一标志
function generateReqKey(config: any) {
	const { method, url, params, data } = config;
	return [method, url, qs.stringify(params), qs.stringify(data)].join("&");
}

// 表单序列化
export const serialize = (data: any) => {
	let list: string[] = [];
	Object.keys(data).forEach(ele => {
		list.push(`${ele}=${data[ele]}`);
	});
	return list.join("&");
};

// 添加请求到字典
function addPendingRequest(config: any) {
	const requestKey = generateReqKey(config);
	config.cancelToken =
		config.cancelToken ||
		new axios.CancelToken(cancel => {
			if (!pendingRequest.has(requestKey)) {
				pendingRequest.set(requestKey, cancel);
			}
		});
}

// 删除重复请求
function removePendingRequest(config: any) {
	const requestKey = generateReqKey(config);
	if (pendingRequest.has(requestKey)) {
		const cancelToken = pendingRequest.get(requestKey);
		cancelToken(requestKey);
		pendingRequest.delete(requestKey);
	}
}

// 业务错误码
const codeMessage = {
	"-4001": "同步失败，请分配角色。",
};

const instance = axios.create({
	baseURL: import.meta.env.VITE_SERVICE_URL,
	timeout: 0,
	headers: {
		"Content-Type": "application/json;charset=utf-8",
	}
});

instance.interceptors.request.use(
	config => {
		removePendingRequest(config); // 检查是否存在重复请求，若存在则取消已发的请求
		addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中

		/**
		 * 业务部分
		 */
		config.headers!.Authorization = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`;
		// const accessToken = localStorage.getItem("accessToken");
		// if (accessToken) {
		// 	const { tokenType, tokenValue } = JSON.parse(accessToken);
		// 	config.headers!.Authorization = tokenType.value + " " + tokenValue;
		// }
		config.data = clearNull(config.data);
		// data中配置serialize为true开启序列化
		if (config.method === "post" && config.data?.serialize) {
			config.data = serialize(config.data);
			delete config.data.serialize;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

const handleResponseSuccess = (res: Response<any>) => {
	const { data, status, config } = res;

	removePendingRequest(config); // 从pendingRequest对象中移除请求

	/**
	 * 业务部分
	 */
	if (status === 200) {
		return data;
	}
	return Promise.reject(res);
};

const handleResponseError = (error: any) => {
	if (error.message?.includes("timeout")) {
		// 网络超时
		message.error("服务异常，请联系管理员");
		return Promise.reject(error);
	}
	const { response, config } = error;

	removePendingRequest(config || {}); // 从pendingRequest对象中移除请求

	if (axios.isCancel(error)) {
		console.log("已取消的重复请求：" + error.message);
	} else {
		let msg = "";
		console.log(error)
		switch (response?.status) {
			case 400:
				msg = "请求错误(400)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 401:
				msg = "未授权，请重新登录(401)" + response?.data?.msg.slice(0, 50) + "..." || "";
				// 这里可以做清空storage并跳转到登录页的操作
				break;
			case 403:
				msg = "拒绝访问(403)" + response?.data?.msg.slice(0, 50) + "..." + "..." || "";
				break;
			case 404:
				msg = "请求出错(404)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 424:
				msg = "请求出错(424)：" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 428:
				// msg = "接口请求错误，错误代码：428";
				msg = "";
				break;
			case 408:
				msg = "请求超时(408)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 500:
				msg = "服务器错误(500)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 501:
				msg = "服务未实现(501)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 502:
				msg = "网络错误(502)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 503:
				msg = "服务不可用(503)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 504:
				msg = "网络超时(504)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			case 505:
				msg = "HTTP版本不受支持(505)" + response?.data?.msg.slice(0, 50) + "..." || "";
				break;
			default:
				msg = `请求出错(${response.status})，请联系管理员!`;
				break;
		}
		msg && message.error(msg);
		if ([424, 401].includes(response?.status) && !window.location.pathname.includes("/user/login")) {
			window.location.href = window.location.origin + '/user/login';
		}
	}
	return Promise.reject(error);
};

console.log()
instance.interceptors.response.use(handleResponseSuccess, handleResponseError);

const http = {
	request<T = any>(config: RequestConfig): Promise<Result<T>> {
		return instance.request(config);
	},

	upload<T = any>(url: string, params: any, options?: RequestConfig): Promise<Result<T>> {
		const formData = new FormData();
		const reqs = { ...params };
		Object.keys(reqs).forEach(key => {
			formData.append(key, reqs[key]);
		});
		let Authorization = ''
		const accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			const { tokenType, tokenValue } = JSON.parse(accessToken);
			Authorization = tokenType.value + " " + tokenValue;
		}

		const config: any = {
			...options,
			method: "post",
			url: import.meta.env.VITE_SERVICE_URL+url,
			data: formData,
			headers: {
				Authorization,
				...(options?.headers ?? {}),
			},
		};
		return new Promise(async (resolve, reject) => {
			axios(config)
				.then(data => {
					return resolve(handleResponseSuccess(data));
				})
				.catch(error => {
					return reject(handleResponseError(error));
				});
		});
	},

	get<T = any>(url: string, config?: RequestConfig): Promise<Result<T>> {
		return instance.get(url, config);
	},

	post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Result<T>> {
		return instance.post(url, data, config);
	},

	put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Result<T>> {
		return instance.put(url, data, config);
	},

	delete<T = any>(url: string, data?: any, config?: RequestConfig): Promise<Result<T>> {
		config = config || {}
		data && (config.data = data)
		return instance.delete(url, config);
	},
};

// export const remoteList = async (url: string, params: Record<string, any>): Promise<ListData> => {
// 	const { data } = await http.post<ListData>(url, params)
// 	if (!data?.list) return { total: 0, list: Array.isArray(data) ? data : [], pageSize: 10, pageNum: 1 }
// 	return data
// }

export const remoteData = async <T>(url: string, params: Record<string, any>): Promise<T> => {
	const MethodAbbr = { p: 'post', g: 'get', d: 'delete' }
	const mUrl = url.split(':')
	url = mUrl.pop()!
	const m = mUrl[0]
	const method = m ? (MethodAbbr[m] || m) : 'post'
	const { data } = await http[method]<T>(url, params)
	return data
}
export default http
