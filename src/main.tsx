import React from 'react'
import ReactDOM from 'react-dom/client'
import "@/assets/styles/default.less";
import "@/assets/styles/global.less";
import RouterCom from './router'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RouterCom />
)
