// ==================
// 组件
// ==================
import LoadingPage from "@/components/LoadingPage";
import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import routers from './routerList';
export interface Router {
  name?: string,
  path: string,
  children?: Array<Router>,
  component?: any,
  redirect?: string
}

const RouterComs = ():JSX.Element => {
    // 递归生成Route组件树
    const RouteComs = (routers: Array<Router>):JSX.Element => {
        return <>
            {routers.map((item, i) => {
                return <Route 
                    key={i} 
                    path={item.path}
                    element={
                        item.redirect? <Navigate to={item.redirect} replace={true} /> :
                        item.component && <Suspense fallback={
                            <LoadingPage/>
                        }>
                            < item.component />
                        </Suspense>
                    }
                    {...item.children && item.children.length>0 && {children:RouteComs(item.children)}}
                />
            })}
        </>
    }

    return (
        <Routes>
            {RouteComs(routers)}
        </Routes>
    );
}

export default RouterComs