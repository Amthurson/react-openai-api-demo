

import {
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons"

const menus = [
    {
        key: 'app',
        icon: <VideoCameraOutlined />,
        label: 'app',
        children: [
            {
                key: '/app/chat',
                label: 'chat'
            },
            {
                key: '/app/image',
                label: 'image'
            },
            {
                key: '/app/embeddings',
                label: 'embeddings'
            },
            {
                key: 'audio',
                label: 'audio',
                children: [
                    {
                        key: '/audio/create-transcription',
                        label: 'create-transcription',
                    },
                    {
                        key: '/audio/create-translation',
                        label: 'create-translation',
                    }
                ]
            },
            {
                key: 'files',
                label: 'files',
                children: [
                    {
                        key: '/files/list',
                        label: 'list',
                    },
                    {
                        key: '/files/upload',
                        label: 'upload',
                    },
                    {
                        key: '/files/retrieve',
                        label: 'retrieve',
                    }
                ]
            }
        ]
    },
    {
        key: '/settings',
        icon: <UserOutlined />,
        label: 'settings',
        children: [
            {
                key:'/settings/models',
                label: 'models',
                children: [
                    {
                        key:'/settings/models/list',
                        label: 'list',
                    },
                ]
            },
        ]
    },
    {
        key:'/chatglm',
        icon: <VideoCameraOutlined />,
        label: 'ChatGLM-6B-Local',
        children: [
            {
                key: '/chatglm/chat',
                label: 'chat'
            },
        ]
    }
]
export default menus