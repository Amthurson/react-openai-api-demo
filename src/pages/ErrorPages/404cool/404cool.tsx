import style from "./404cool.module.less";
import { useEffect, useRef } from "react"
import { particleSystem } from './particle'

export default ()=> {
    const canvasRef = useRef(null);
    useEffect(()=>{
        const system = new particleSystem({ canvas_id: 'notfound-aniamtion-container'});
        system.start();
        console.log('start-animation',system)
    },[])
    return <div className={style.wrap}>
        <canvas ref={canvasRef} id="notfound-aniamtion-container"></canvas>
        <div onClick={()=>window.location.replace('/app/chat')} className="back">
            Back To Home
        </div>
    </div>
}
