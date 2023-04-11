/* 404 NotFound */

import { Button } from "antd";
import Img from "@/assets/error.gif";
import "./index.less";


export default function NotFoundContainer(): JSX.Element {
	const gotoHome = (): void => {
		window.location.replace('/')
	};
	return (
		<div className="page-error">
			<div>
				<div className="title">404</div>
				<div className="info">Oh dear</div>
				<div className="info">这里什么也没有</div>
				<Button className="backBtn" type="primary" ghost onClick={gotoHome}>
					返回首页
				</Button>
			</div>
			<img src={Img + `?${new Date().getTime()}`} />
		</div>
	);
}
