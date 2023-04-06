import { FC, useState } from "react";
import { History } from "history";
import { createImage } from "@/apis/openai";
import styles from "./index.module.css";

type Props = {
    location: Location;
    history: History;
}

interface picResult {
    url: string
}

const Chat: FC<Props> = (props: Props): JSX.Element => {
    const [picPrompt, setPicPrompt] = useState("");
    const [picResult, setPicResult] = useState<picResult[]>([]);

    async function onSubmitPic(event) {
        try {
            event.preventDefault();
            const params = {
                prompt: picPrompt,
                n: 3,
                size: "1024x1024",
            }
            const data = await createImage(params);
            setPicResult(data.data);
        } catch (error) {
            
        }
    }

    return (
        <div>

            <main className={styles.main}>
                <h3>Create Images</h3>
                <form onSubmit={onSubmitPic}>
                <input
                    type="text"
                    name="animal"
                    placeholder="descript a pictrue"
                    value={picPrompt}
                    onChange={(e) => setPicPrompt(e.target.value)}
                />
                <input type="submit" value="Generate Image" />
                </form>
                <div className={styles.desc}>{picPrompt}</div>
                <div className={styles.picResult}>
                {picResult && picResult.length>0 && picResult.map((v,i)=>(
                    <img key={`img-${i}`} src={v.url} className={styles.pic}/>
                ))}
                </div>
            </main>
        </div>
    )
}
export default Chat