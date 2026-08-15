/**
 * Composer voice input client half: a mic button in the input tool row that
 * transcribes speech into the draft via the browser Web Speech API. Listening
 * is continuous until the user clicks the button again to stop and commit.
 * @module @deepseek-ai/dsh-voice-input/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import * as React from 'react'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import css from './panel.module.css'

/** Required client services. */
export const inject = ['slots']

interface VoiceStore {
  listening: boolean
  text: string
  error: string
  patch(p: { listening?: boolean; text?: string; error?: string }): void
  subscribe(f: () => void): () => void
}

const subs = new Set<() => void>()

const store: VoiceStore = {
  listening: false,
  text: '',
  error: '',
  patch(p) {
    Object.assign(store, p)
    subs.forEach((f) => f())
  },
  subscribe(f) {
    subs.add(f)
    return () => subs.delete(f)
  },
}

function useStore(): VoiceStore {
  const [, force] = React.useState(0)
  React.useEffect(() => store.subscribe(() => force((x) => x + 1)), [])
  return store
}

/** Minimal shape of the SpeechRecognition API this plugin drives. */
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror: ((event: SpeechErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechResultEvent {
  resultIndex: number
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>
}

interface SpeechErrorEvent {
  error?: string
}

let recognition: SpeechRecognitionLike | null = null
let latestDraft = ''
let accumulated = ''
let shouldStop = false

function startListening(inputActions: MicButtonProps['inputActions']): void {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
  if (SR === undefined) {
    store.patch({ error: '此浏览器不支持语音识别，请用 Chrome/Edge', listening: false })
    return
  }
  const rec = new SR()
  rec.lang = 'zh-CN'
  rec.interimResults = true
  rec.continuous = true
  shouldStop = false
  accumulated = ''
  rec.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i]
      if (r === undefined) continue
      const first = r[0]
      if (first === undefined) continue
      if (r.isFinal) accumulated += first.transcript
      else interim += first.transcript
    }
    store.patch({ text: accumulated + interim })
  }
  rec.onerror = (event) => {
    const err = event.error ?? '识别出错'
    if (err === 'no-speech' || err === 'aborted') return
    shouldStop = true
    store.patch({ listening: false, text: '', error: err })
    recognition = null
  }
  rec.onend = () => {
    if (shouldStop) {
      store.patch({ listening: false, text: '', error: '' })
      if (accumulated) {
        const draft = latestDraft
        inputActions?.setDraft?.(draft ? `${draft} ${accumulated}` : accumulated)
      }
      recognition = null
    } else {
      try {
        rec.start()
      } catch {
        // Already started; keep the same recognition alive.
      }
    }
  }
  recognition = rec
  store.patch({ listening: true, text: '', error: '' })
  rec.start()
}

interface MicButtonProps {
  inputActions?: {
    setDraft?(text: string): void
  }
  input?: {
    draft: string
  }
}

function MicButton(props: MicButtonProps): React.ReactElement {
  const s = useStore()
  latestDraft = props.input?.draft ?? ''
  const listening = s.listening
  return React.createElement(
    'button',
    {
      type: 'button',
      className: `${css.vmicBtn}${listening ? ` ${css.vmicBtnOn}` : ''}`,
      title: listening ? '停止' : '语音输入',
      'aria-label': '语音输入',
      onClick: () => {
        if (listening) {
          shouldStop = true
          if (recognition) {
            try {
              recognition.stop()
            } catch {
              store.patch({ listening: false, text: '', error: '' })
            }
          } else {
            store.patch({ listening: false, text: '', error: '' })
          }
        } else {
          startListening(props.inputActions)
        }
      },
    },
    '🎤',
  )
}

function LivePill(): React.ReactElement | null {
  const s = useStore()
  if (!s.listening && !s.error) return null
  return React.createElement(
    'div',
    { className: css.vmicPill },
    s.error
      ? React.createElement('span', { className: css.vmicErr }, s.error)
      : s.text || '正在聆听…（点 🎤 停止）',
  )
}

/** Mount the mic button into the composer tool row and the live transcript pill. */
export function apply(ctx: ClientContext): void {
  ctx.slots.inject('conversation.input.left', () => ctx.slots.register(
    { name: 'conversation.input.left', id: 'voice-input', order: 100, label: '语音输入' },
    (props) => React.createElement(MicButton, props as MicButtonProps),
  ))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'voice-input-pill', order: 100, label: '语音输入' },
    () => React.createElement(LivePill, null),
  ))
}
