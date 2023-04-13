import { FC, useCallback, useEffect, useRef, useState } from "react";
import { History } from "history";
import { createEmbeddings, EmbeddingsResultType, createChatCompletion } from "@/apis/openai";
import styles from "./index.module.less";
import { cosineSimilarity, syntaxHighlight } from "@/utils/tools";
import price from "./price.json";

type Props = {
    location: Location;
    history: History;
    model: string
}

import EmbeddingsMemoryData from './embeddingDatas.json';
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface EmbeddingsDataType {
    text: string;
    embeddings: EmbeddingsResultType;
    similarity?: number;
}

interface TableDataType {
    id: string;
    key: string;
    text: string;
    model: string;
    prompt_tokens: number;
    total_tokens: number;
    similarity: number | string;
    embedding: string;
    cost:number;
    loading: boolean;
}

// 美元兑人民币汇率（04-06）
const exchangeRate = 6.8814;

const Embeddings: FC<Props> = (props: Props): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TableDataType[]>([]);
    const pagination = {
        pageSize: 12
    }
    const [text,setText] = useState("");
    const [question,setQuestion] = useState("");
    const [embeddingDatas,setEmbeddingDatas] = useState<EmbeddingsDataType[]>(EmbeddingsMemoryData);
    const [result,setResult] = useState<string>(JSON.stringify(EmbeddingsMemoryData));
    const [mostSimilarData,setMostSimilarData] = useState<EmbeddingsDataType | null>(null);
    const [answer,setAnswer] = useState("");
    const [similarity,setSimilarity] = useState(0);
    const onInput = (e: any) => {
        setText(e.target.value);
    }
    const onInputQue = (e: any) => {
        setQuestion(e.target.value)
    }
    const setEmbeddings = async (input: string) => {
        const params = {
            model: "text-embedding-ada-002",
            input,
        }
        const res = await createEmbeddings(params);
        return res
    }
    
    const handleCreateEmbeddings = useCallback(async () => {
        // console.log(text)
        if(!text && text==="") return;
        // const res = await setEmbeddings(text);
        embeddingDatas.push({
            text,
            embeddings: embeddingDatas[0].embeddings
        });
        setEmbeddingDatas(embeddingDatas);
        setResult(JSON.stringify(embeddingDatas));
        setData(embeddingDatas.map((v,i)=>({
            id: ""+(i+1),
            key: `embeddingData-${i}`,
            text: v.text,
            model: v.embeddings.model,
            prompt_tokens: v.embeddings.usage.prompt_tokens,
            total_tokens: v.embeddings.usage.total_tokens,
            similarity: v.similarity || '--',
            embedding: `[${v.embeddings.data[0].embedding.slice(0,4).map(v=>Math.round(v*10000)/10000).join(',')}...](${v.embeddings.data[0].embedding.length})`,
            loading: false,
            cost: Math.round(v.embeddings.usage.total_tokens*price.Embedding[0].price/1000*exchangeRate*10000000)/10000000
        })))
    },[text])

    const handleAsk = useCallback(async () => {
        if(!question && question==="") return;
        const queEmbeddings = await setEmbeddings(question);
        const { data } = queEmbeddings;
        const { embedding } = data[0];
        const newEmbeddingDatas = embeddingDatas.map(v=>({
            ...v,
            similarity: cosineSimilarity(v.embeddings.data[0].embedding,embedding)
        }));
        const similarities = newEmbeddingDatas.map(v=>v.similarity);
        setEmbeddingDatas(newEmbeddingDatas);
        const mostSimilarIndex = similarities.indexOf(Math.max(...similarities));
        const mostSimilarText = embeddingDatas[mostSimilarIndex].text;

        setSimilarity(Math.max(...similarities));
        setMostSimilarData(embeddingDatas[mostSimilarIndex]);

        const response = await createChatCompletion({
            model: "text-ada-001",
            prompt: `根据以下内容回答问题：${mostSimilarText}。问题：${question}。答案：`,
            max_tokens: 50,
            n: 1,
            stop: null,
            temperature: 0.5,
        });
        const answer = response.choices[0].text.trim();
        setAnswer(answer)
    },[question,embeddingDatas])

    const columns: ColumnsType<TableDataType> = [
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          width: "5%",
          render: (text) => <a>{text}</a>,
        },
        {
          title: '信息',
          dataIndex: 'text',
          key: 'text',
          width: "40%"
        },
        {
          title: '特征向量',
          dataIndex: 'embedding',
          key: 'vector',
          width: "20%"
        },
        {
          title: '与问题COS近似度',
          dataIndex: 'similarity',
          key: 'similarity',
          width: "15%",
          sorter: (a, b) => +a.similarity - +b.similarity
        },
        {
          title: '使用的模型',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: '消耗总Token数',
          key: 'total_tokens',
          dataIndex: 'total_tokens',
          width: "10%"
        },
        {
          title: '费用（元）',
          key: 'cost',
          dataIndex: 'cost',
          width: "10%"
        },
    ];

    useEffect(()=>{
        setData(embeddingDatas.map((v,i)=>({
            id: ""+(i+1),
            key: `embeddingData-${i}`,
            text: v.text,
            model: v.embeddings.model,
            prompt_tokens: v.embeddings.usage.prompt_tokens,
            total_tokens: v.embeddings.usage.total_tokens,
            similarity: v.similarity || '--',
            embedding: `[${v.embeddings.data[0].embedding.slice(0,4).map(v=>Math.round(v*10000)/10000).join(',')}...](${v.embeddings.data[0].embedding.length})`,
            loading: false,
            cost: Math.round(v.embeddings.usage.total_tokens*price.Embedding[0].price/1000*exchangeRate*10000000)/10000000
        })))
    },[embeddingDatas])

    return (
        <div>
            <div className={styles.container}>
                <div className="title">嵌入区</div>
                <div className="embed">
                    <label htmlFor="input">嵌入信息</label>
                    <input placeholder="输入嵌入信息（模拟pdf文档片段信息）" onInput={onInput} type="text" name="input" id="" />
                    <input type="button" onClick={handleCreateEmbeddings} value="嵌入到OpenAI（create embedding）" />
                    <label htmlFor="result">嵌入完成返回结果</label>
                    <div className="result">
                    {result}</div>
                    <div className="line"></div>
                    <label htmlFor="result">嵌入信息历史记录（因为每次都会收费，需要存储）</label>
                    <div className="embeddingDatas">
                        <Table loading={loading} pagination={pagination} columns={columns} dataSource={data} />
                    </div>
                </div>
                <div className="title">AI聊天区</div>
                <div className="completation">
                    <div className="question">
                        <label htmlFor="input">Question Relative To Text</label>
                        <input onInput={onInputQue} type="text" name="input" id="" />
                        <input type="button" onClick={handleAsk} value="ask" />
                    </div>
                    <div className="simliarity">
                        <div className="label">mostSimilarText：{mostSimilarData?.text}</div>
                        <div className="label">embed与question相似度：{similarity}</div>
                    </div>
                    <label htmlFor="result">Answer</label>
                    <div className="result">
                        {answer}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Embeddings