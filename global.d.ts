/// <reference types="node" />
/// <reference types="react-dom" />
import * as React from "react";

declare namespace NodeJS {
	interface ProcessEnv {
		readonly NODE_ENV: "development" | "production" | "test";
		readonly PUBLIC_URL: string;
		readonly SERVICE_URL: string;
	}
}

declare module "*.bmp" {
	const src: string;
	export default src;
}

declare module "*.gif" {
	const src: string;
	export default src;
}

declare module "*.jpg" {
	const src: string;
	export default src;
}

declare module "*.jpeg" {
	const src: string;
	export default src;
}

declare module "*.png" {
	const src: string;
	export default src;
}

declare module "*.webp" {
	const src: string;
	export default src;
}

declare module "*.svg" {

	export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

	const src: string;
	export default src;
}

declare module "*.css" {
	const classes: { readonly [key: string]: string };
	export default classes;
}

declare module "*.scss" {
	const classes: { readonly [key: string]: string };
	export default classes;
}

declare module "*.sass" {
	const classes: { readonly [key: string]: string };
	export default classes;
}

declare module "*.less" {
	const classes: { readonly [key: string]: string };
	export default classes;
}

// interface Window {
// 	graph: Graph
// }
// declare const window: Window & typeof globalThis

// 标准分页数据
type ListData = {
	list: any[],
	total: number,
	pageSize: number,
	pageNum: number,
	records?: any[]
}

// src/global.d.ts
declare global {
    interface Window {
		[prop: `__${string}`]: any;
    }
}
export {}