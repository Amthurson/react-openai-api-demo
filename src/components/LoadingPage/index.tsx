/**
 * LoadingPage组件
 * 用于按需加载时过渡显示等
 */
import React, { useEffect, FC } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const LoadingPage: FC = () => {
	useEffect(() => {
		NProgress.start();
		return () => {
			NProgress.done();
		};
	}, []);
	return <div className="load-component" />;
};

export default LoadingPage;
