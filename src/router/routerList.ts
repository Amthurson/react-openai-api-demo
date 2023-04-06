import { lazy } from 'react'

// 路由表
export default [
    {
        path: '/404',
        component: lazy(() => import('@/pages/ErrorPages/404'))
    },
    {
        path: '/nopower',
        component: lazy(() => import('@/pages/ErrorPages/401'))
    },
    {
        path: '/app',
        component: lazy(() => import('@/layout')),
        children: [
            {
                path: '/app/chat',
                component: lazy(() => import('@/pages/app/chat'))
            },
            {
                path: '/app/image',
                component: lazy(() => import('@/pages/app/image'))
            },
            {
                path: '/app/embeddings',
                component: lazy(() => import('@/pages/app/embeddings'))
            }
        ]
    },
    {
        path: '/settings',
        component: lazy(() => import('@/layout')),
        children: [
            {
                path: '/settings/models/list',
                component: lazy(() => import('@/pages/settings/models/list'))
            }
        ]
    }
]