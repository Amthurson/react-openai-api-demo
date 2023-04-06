import { BrowserRouter } from "react-router-dom"
import { createBrowserHistory } from 'history'

// ==================
// 组件
// ==================
import RouterComs from "./routes";

const RouterCom = ():JSX.Element => {
    const history = createBrowserHistory();
    const routerProps = { location, history }

    // 路由拦截
    const onEnter = (Com: (...args: any[])=>JSX.Element, props?: any):JSX.Element | null => {
        /** 用于判断登录逻辑等 */
        if(location.pathname==='/') {
            history.replace('/app/chat');
            return null;
        }
        return <Com {...props} />;
    }

    return (
        <BrowserRouter>
            {onEnter(RouterComs,routerProps)}
        </BrowserRouter>
    );
}

export default RouterCom