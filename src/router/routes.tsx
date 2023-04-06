import { lazy } from 'react'
// ==================
// 组件
// ==================
import LoadingPage from "@/components/LoadingPage";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom"
import routers from './routerList';

export interface Router {
  name?: string,
  path: string,
  children?: Array<Router>,
  component: any
}

const RouterComs = ():JSX.Element => {
    // 递归生成Route组件树
    const RouteComs = (routers: Array<Router>):JSX.Element => {
        return <>
            {routers.map((item, i) => (
                <Route 
                    key={i} 
                    path={item.path}
                    element={
                        <Suspense fallback={
                            <LoadingPage/>
                        }>
                            < item.component />
                        </Suspense>
                    }
                    {...item.children && item.children.length>0 && {children:RouteComs(item.children)}}
                />
            ))}
        </>
    }

    return (
        <Routes>
            {RouteComs(routers)}
        </Routes>
    );
}

export default RouterComs