
// ==================
// 第三方库
// ==================
import { useState } from 'react'
import { 
    MenuUnfoldOutlined,
    MenuFoldOutlined
 } from "@ant-design/icons"
import React from 'react';
import CustomMenu from '../components/menus';

import {
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons"
import style from './index.module.less';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Outlet, useNavigate } from 'react-router-dom';
import { History } from "history";

// ==================
// 组件
// ==================
type Props = {
    location: Location;
    navigator: History;
}

import { Layout, theme } from 'antd'
const { Sider,Header, Content } = Layout;

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

const Screen = (props: Props):JSX.Element => {
    const [collapsed, setCollapsed] = useState(false);
    const { location } = props;
    const navigate = useNavigate();

    const {
      token: { colorBgContainer },
    } = theme.useToken();

    const onSelect = (info: {
        key: string;
        keyPath: string[];
        /** @deprecated This will not support in future. You should avoid to use this */
        item: React.ReactInstance;
        domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
    }) => {
        const {keyPath} = info;
        const to = keyPath[0];
        navigate(to)
    }

    return (
        <Layout className={style.container}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <CustomMenu onSelect={onSelect} items={menus}></CustomMenu>
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: colorBgContainer }}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: () => setCollapsed(!collapsed),
                })}
                </Header>
                <Content>
                    <ErrorBoundary location={location}>
                        <Outlet></Outlet>
					</ErrorBoundary>
                {/* Content */}
                </Content>
            </Layout>
        </Layout>
    )
}

export default Screen