import axios from "@/utils/axios";
import { CompletionType, ImageType } from "./openaiTypes";
/**
 * Get Models List
 * **/
export const getModelsList = async() => {
    const res = await axios.get("/v1/models");
    return res;
}

/**
 * Create Chat Completion
 * **/
export const createChatCompletion = async(params: {
    model: string;
    prompt: string;
    temperature?: number; // 0 - 2  1 by default
    top_p?: number; // 0 - 2  1 by default
    n?: number; // 0 - 2  1 by default
    stream?: boolean; // 0 - 2  false by default
    stop?: string | string[] | null; // Defaults to null
    max_tokens?: number; // Defaults to inf
    presence_penalty?: number; // Defaults to 0
    frequency_penalty?: number; // Defaults to 0
    logit_bias?: Record<string,any> | null; // Defaults to 0
    user?: string;
}): Promise<CompletionType> => {
    const res  = await axios.post("/v1/completions",params);
    return res;
}

/**
 * Create Image
 * **/
 export const createImage = async(params: {
    prompt: string;
    n?: number; // 0 - 2  1 by default
    size?: string; // "256x256" or "512x512" or "1024x1024" Defaults to "1024x1024"
    response_format?: string; // "url" /  "b64_json" Defaults to url
    user?: string;
}): Promise<ImageType> => {
    const res  = await axios.post("/v1/images/generations",params);
    return res;
}

export interface EmbeddingsResultType {
    object: string,
    data: {
        object: string,
        index: number,
        embedding: number[]
    }[],
    model: string,
    usage: {
        prompt_tokens: number,
        total_tokens: number
    }
}

/**
 * Create Embeddings
 * **/
 export const createEmbeddings = async(params: {
    model: string;
    input: string | string[]; // 0 - 2  1 by default
    user?: string; 
}): Promise<EmbeddingsResultType> => {
    const res  = await axios.post("/v1/embeddings",params);
    return res;
}