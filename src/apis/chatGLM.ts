import axios from "@/utils/axios";
import { chatGLMResType } from "./chatGLMTypes";

/**
 * ChatGLM对话接口
 * **/
 export const chatGLMchat = async(params:{
    prompt:string,
    histroy:string[][],
    max_length:number,
    top_p:number,
    temperature:number
}): Promise<chatGLMResType> => {
    const res = await axios.post(import.meta.env.VITE_CHATGLM_SERVICE_URL+"/chatglmApi",params);
    return res;
}