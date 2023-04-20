import { FC, useRef, useState } from "react";
import { History } from "history";
import { chatGLMchat } from "@/apis/chatGLM";
import styles from "./index.module.css";

type Props = {
    location: Location;
    history: History;
    model: string
}

// gpt参数
const settings = {
    max_length:2048,
    top_p:0.7,
    temperature:0.95
}

// 对话角色设定
const roleSettings = {
    questionerName: "John", // 提问者名称
    chatGPTRoleName: "ChatGLM", // ChatGPT回答角色名称
}

const Chat: FC<Props> = (props: Props): JSX.Element => {
    const [prompt, setPrompt] = useState("");
    const [question,setQuestion] = useState("");
    const [history,setHistory] = useState<string[][]>([]);
    const [completions,setCompletions] = useState<any[]>([]); // 问答数组
    const [loading,setLoading] = useState(false); // 是否加载答案
    const dialogRef = useRef(null);

    // 滚动到底部
    const scrollBottom = () => {
        let ele = dialogRef.current as HTMLElement | null;
        if(!ele) return;
        ele.scrollTop = ele.scrollHeight  
    }

    // 提问
    const onSubmit = async () => {
        try {
            setLoading(true);
            // 问题为空，返回
            if(!question) return;
            // 创建一个问答
            completions.push({question:`${question}`,answer:[]});
            setCompletions(completions);
            // 循环请求OpenAI所有回答
            const requestPrompt = question;
            // 清空输入框
            setQuestion("");
            scrollBottom();
            const res = await makeRequest(requestPrompt);
            if(!res) return;
            // 组成新的Prompt
            const newPrompt = setCompletionsToPrompt(res);
            // 重置Prompt给下一次提问准备
            setPrompt(newPrompt);
            scrollBottom();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // 将问答记录转为入参prompt
    const setCompletionsToPrompt = (completions: any[]) => {
        if(!completions) return "";
        let newPromot = "";
        completions.map(v=>{
            newPromot += v.question;
            v.answer.map((v2: string)=>{
                newPromot += v2
            });
            newPromot += '\n\n';
        });
        return newPromot;
    }

    // 合并回答断句
    const combindAnsers = (answers: any[]) => {
        let answer = "";
        answers && answers.length>0 && answers.map(v=>{answer+=v});
        return answer.substring(2,answer.length-1);
    }

    // recursion request answer
    const makeRequest = async (newPrompt: any) =>{
        try {
            console.log(newPrompt);
            const params = {
                prompt: newPrompt,
                histroy: completions.map(v=>([v.question,combindAnsers(v.answer)])),
                ...settings
            }
            // openai API
            const data = await chatGLMchat(params)
            const { response,history,time } = data;
            completions[completions.length-1].answer.push(response);
            setHistory(history);
            setCompletions(completions);
            setLoading(false);
            return completions;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const handleInput = (e) => {
        setQuestion(e.target.value)
    }
          
    const onkeyup = (e) => {
        if(e.keyCode === 13) {
            onSubmit()
        }
    }

    return (
        <div>
            <main className={styles.main}>
                <h3>ChatGLM 对话</h3>
                <div className={styles.dialog}>
                <div className={styles.dialogWrap}>
                    {
                        completions && completions.length>0 && completions.map((v: any,i)=>(
                            <div className={styles.completions} key={`completion-${i}`}>
                            <div className={styles.questions}>
                                <div className={styles.headimg}>{roleSettings.questionerName?roleSettings.questionerName[0].toUpperCase():''}</div>
                                <div className={styles.contentWrap}>
                                <div className={styles.userName}>{roleSettings.questionerName}</div>
                                <div className={styles.content}>{v.question}</div>
                                </div>
                            </div>
                            <div className={styles.answers}>
                                <div className={styles.headimg}>{roleSettings.chatGPTRoleName?roleSettings.chatGPTRoleName[0].toUpperCase():''}</div>
                                <div className={styles.contentWrap}>
                                <div className={styles.userName}>{roleSettings.chatGPTRoleName}</div>
                                <div className={styles.content}>
                                    <pre>{loading && i===completions.length-1?"...":combindAnsers(v.answer)}
                                    </pre>
                                </div>
                                </div>
                            </div>
                            </div>
                        ))
                    }
                </div>
                    <div className={styles.inputWrap}>
                        <input disabled={loading} onInput={handleInput} className={loading ? styles.question+" "+styles.loading : styles.question} type="input" value={question}/>
                        <input disabled={loading} onClick={onSubmit} onKeyUp={onkeyup} className={loading ? styles.button+" "+styles.loading : styles.button} value="提问" type="button"/>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Chat