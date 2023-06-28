
// ==================
// 第三方库
// ==================
import { useMemo, useState } from 'react'
import { 
    MenuUnfoldOutlined,
    MenuFoldOutlined
 } from "@ant-design/icons"
import React from 'react';
import CustomMenu from '../components/menus';

import style from './index.module.less';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { History } from "history";

// ==================
// 组件
// ==================
type Props = {
    location: Location;
    navigator: History;
}

import menus from './menus';

import { Breadcrumb, Layout, theme } from 'antd'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
const { Sider,Header, Content } = Layout;



const Screen = (props: Props):JSX.Element => {
    const [collapsed, setCollapsed] = useState(false);
    const { location } = props;
    const navigate = useNavigate();
    const curLocation = useLocation();

    const {
      token: { colorBgContainer },
    } = theme.useToken();

    // ================== 选择菜单 ==================
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

    const breadItem = useMemo((): BreadcrumbItemType[] => {
        const items = curLocation.pathname.split('/');
        let key = "/";
        return items.filter(item=>item).map((item, index) => {
            key += item + '/';
            console.log(key)
            return {
                key,
                title: item,
                onClick: () => navigate(key),
                className: 'breadcrumb-item'
            }
        });
    },[curLocation])

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
                <Content className='content'>
                    <Breadcrumb style={{ margin: '16px 0' }}
                        items={breadItem}
                    />
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