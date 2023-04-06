import { Menu } from "antd";
import { FC, useEffect, useState } from "react";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useLocation } from "react-router-dom";

type Props = {
    items: ItemType[],
    defaultSelectedKeys?: [],
    onSelect?: (info:{
        key: string;
        keyPath: string[];
        /** @deprecated This will not support in future. You should avoid to use this */
        item: React.ReactInstance;
        domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
    })=>void
}

const CustomMenu: FC<Props> = (props:Props) => {
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    useEffect(()=>{
        setSelectedKeys([location.pathname])
    },[location])
    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={props.defaultSelectedKeys}
            items={props?.items||[]}
            onSelect={props.onSelect}
            selectedKeys={selectedKeys}
        />
    ) 
}

export default CustomMenu;