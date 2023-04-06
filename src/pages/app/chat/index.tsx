import { FC, useRef, useState } from "react";
import { History } from "history";
import { createChatCompletion } from "@/apis/openai";
import styles from "./index.module.css";

type Props = {
    location: Location;
    history: History;
    model: string
}

const settings = {
    questionerName: "John", // 提问者名称
    sampleQuestion: "Are you happy?", // 问题示例
    chatGPTRoleName: "ChatGPT", // ChatGPT回答角色名称
    sampleAnswer: "Not realy, but still fine with me?", // 回答示例
}

const Chat: FC<Props> = (props: Props): JSX.Element => {
    const model = props.model || 'text-davinci-003';
    const [prompt, setPrompt] = useState("");
    const [question,setQuestion] = useState("");
    const [completions,setCompletions] = useState<any[]>([]); // 问答数组
    const [loading,setLoading] = useState(false); // 是否加载答案
    const dialogRef = useRef(null);

    // 设置前置的回答格式示例prompt，用于请求在（对话者名称等）
    const getPromptForm = () => {
        const { 
            questionerName,
            sampleQuestion,
            chatGPTRoleName,
            sampleAnswer 
        } = settings;
        return `${questionerName?`${questionerName}: `:""}${sampleQuestion?sampleQuestion+'\n\n':''}${chatGPTRoleName?`${chatGPTRoleName}: `:""}${sampleAnswer?sampleAnswer+'\n\n':''}`
    }

    // 滚动到底部
    const scrollBottom = () => {
        let ele = dialogRef.current as HTMLElement | null;
        if(!ele) return;
        ele.scrollTop = ele.scrollHeight  
    }

    // 提问
    const onSubmit2 = async () => {
        try {
            setLoading(true);
            // 获取个性化配置（提问者，回答者名称等）
            const { questionerName } = settings;
            // 问题为空，返回
            if(!question) return;
            // 创建一个问答
            completions.push({question:`${questionerName?`${questionerName}: `:""}${question}`,answer:[]});
            setCompletions(completions);
            // 循环请求OpenAI所有回答
            const requestPrompt = getPromptForm() + prompt + `${questionerName?`${questionerName}: `:""}` + question;
            // 清空输入框
            setQuestion("");
            scrollBottom();
            const res = await makeRequest(requestPrompt);
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
                model,
                prompt: newPrompt
            }
            // openai API
            const data = await createChatCompletion(params)
            const { text, finish_reason } = data.choices[0];
            completions[completions.length-1].answer.push(text);
            setCompletions(completions);
            if(finish_reason !== 'stop') {
                return await makeRequest(newPrompt+text);
            } else {
                setLoading(false);
                return completions;
            }
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
            onSubmit2()
        }
    }

    return (
        <div>
            <main className={styles.main}>
                <h3>OpenAI GPT 对话 - By Anderon</h3>
                <div className={styles.dialog}>
                <div className={styles.dialogWrap}>
                    {
                        completions && completions.length>0 && completions.map((v: any,i)=>(
                            <div className={styles.completions} key={`completion-${i}`}>
                            <div className={styles.questions}>
                                <div className={styles.headimg}>{settings.questionerName?settings.questionerName[0].toUpperCase():''}</div>
                                <div className={styles.contentWrap}>
                                <div className={styles.userName}>{settings.questionerName}</div>
                                <div className={styles.content}>{v.question.split(': ')[1]}</div>
                                </div>
                            </div>
                            <div className={styles.answers}>
                                <div className={styles.headimg}>{settings.chatGPTRoleName?settings.chatGPTRoleName[0].toUpperCase():''}</div>
                                <div className={styles.contentWrap}>
                                <div className={styles.userName}>{settings.chatGPTRoleName}</div>
                                <div className={styles.content}>{loading && i===completions.length-1?"...":combindAnsers(v.answer)}</div>
                                </div>
                            </div>
                            </div>
                        ))
                    }
                </div>
                    <div className={styles.inputWrap}>
                        <input disabled={loading} onInput={handleInput} className={loading ? styles.question+" "+styles.loading : styles.question} type="input" value={question}/>
                        <input disabled={loading} onClick={onSubmit2} onKeyUp={onkeyup} className={loading ? styles.button+" "+styles.loading : styles.button} value="提问" type="button"/>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Chat