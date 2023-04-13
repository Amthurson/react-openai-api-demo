import { lazy } from 'react'
import NotFound from '@/pages/ErrorPages/404cool/404cool'

// 路由表
export default [
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
            },
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
    },
    {
        path: '/*',
        component: lazy(() => import('@/layout')),
        children: [
            {
                path:"*",
                component: NotFound
            }
        ]
    },
]