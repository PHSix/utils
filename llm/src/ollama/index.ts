export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface OllamaOpts {
  model?: string
}

export interface OllamaResponse {
  model: string
  created_at: string
  message: Message
  done: boolean
}

export interface IChatOpts {

  stream: boolean
  onProgress?: (result: OllamaResponse) => void
  onDone?: () => void
}

const defaultOpt: Required<OllamaOpts> = {
  model: 'llama3.1',
}

export class Ollama {
  private opts: Required<OllamaOpts>
  get Ollama() {
    return Ollama
  }

  constructor(private baseUrl: string = 'http://localhost:11434', opts: OllamaOpts) {
    this.opts = { ...defaultOpt, ...opts }
  }

  async chat(messages: Message[], { stream = false, onProgress, onDone }: IChatOpts): Promise<Message[]> {
    const url = `${this.baseUrl}/api/chat`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: this.opts.model,
          stream,
          format: 'json',
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error(`No response body!`)
      }
      let result: OllamaResponse = { message: { content: '' } } as any

      if (stream) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')

        while (true) {
          const { done, value } = await reader.read()
          if (done)
            break

          const chunk = decoder.decode(value, { stream: true })
          const parsedChunk = JSON.parse(chunk)
          result = { ...parsedChunk, message: { ...parsedChunk.message, content: result.message.content + parsedChunk.message.content } }
          onProgress?.(result)
        }

        onDone?.()
      } else {
        result = await response.json()
      }

      return [...messages, result as any]
    } catch (error) {
      console.error('Error during chat:', error)
      throw error
    }
  }
}

export const ollama = Ollama
