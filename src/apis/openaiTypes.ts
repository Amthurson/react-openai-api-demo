export interface CompletionType {
    id: string,
    object: string,
    created: number,
    model: string,
    choices: [
        {
            text: string,
            index: number,
            logprobs: number | null,
            finish_reason: string
        }
    ],
    usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number
    }
}

export interface ImageType {
    created: number,
    data: {url: string;}[]
  }
  