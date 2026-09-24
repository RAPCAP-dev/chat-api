import type { GreenApiChat, GreenApiCredentials } from "../types/chat";

export type IncomingNotification = {
  receiptId: number
  body?: {
    typeWebhook?: string
    messageData?: {
      typeMessage?: string
      textMessageData?: { textMessage?: string }
    }
    senderData?: { chatId?: string }
  }
}

export const isIncomingGreenApiMessage = (notification: IncomingNotification) =>
  notification.body?.typeWebhook === "incomingMessageReceived";

export type GreenApiState = { stateInstance: string }
export type GreenApiCheckAccount = { exist: boolean; chatId: string; username?: string; phoneNumber?: number }

export type GreenApiHistoryMessage = {
  type: 'incoming' | 'outgoing'
  idMessage: string
  timestamp: number
  typeMessage?: string
  chatId: string
  textMessage?: string
  statusMessage?: string
}

const baseUrl = (apiUrl: string) => apiUrl.trim().replace(/\/$/, '')

const endpoint = (credentials: GreenApiCredentials, method: string) =>
  `${baseUrl(credentials.apiUrl)}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}`

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json().catch(() => ({}))) as T
  const errorData = data as T & { error?: string; message?: string; errorCode?: string }
  if (!response.ok || errorData?.error || errorData?.errorCode) {
    throw new Error(errorData?.message ?? errorData?.error ?? errorData?.errorCode ?? 'GREEN-API request failed')
  }
  return data
}

export const sendGreenApiMessage = async (
  credentials: GreenApiCredentials,
  phone: string,
  text: string,
) => {
  const response = await fetch(endpoint(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId: phone.trim(), message: text }),
  })
  return parseResponse<{ idMessage: string }>(response)
}

export const receiveGreenApiNotification = async (
  credentials: GreenApiCredentials,
) => {
  const response = await fetch(endpoint(credentials, 'receiveNotification'))
  const data = await parseResponse<IncomingNotification | null>(response)
  if (!data?.receiptId) return null
  return { ...data, receiptId: data.receiptId }
}

export const deleteGreenApiNotification = async (
  credentials: GreenApiCredentials,
  receiptId: number,
) => {
  const response = await fetch(`${endpoint(credentials, 'deleteNotification')}/${receiptId}`, { method: 'DELETE' })
  return parseResponse<unknown>(response)
}

export const getGreenApiState = async (credentials: GreenApiCredentials) => {
  const response = await fetch(endpoint(credentials, 'getStateInstance'))
  return parseResponse<GreenApiState>(response)
}

export const getGreenApiSettings = async (credentials: GreenApiCredentials) => {
  const response = await fetch(endpoint(credentials, 'getSettings'))
  return parseResponse<Record<string, string>>(response)
}

export const configureGreenApiReceiving = async (credentials: GreenApiCredentials) => {
  const response = await fetch(endpoint(credentials, 'setSettings'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      webhookUrl: '',
      incomingWebhook: 'yes',
      outgoingWebhook: 'yes',
      outgoingMessageWebhook: 'yes',
      outgoingAPIMessageWebhook: 'yes',
      stateWebhook: 'yes',
    }),
  })
  return parseResponse<{ saveSettings: boolean }>(response)
}

export const getGreenApiChats = async (credentials: GreenApiCredentials) => {
  const response = await fetch(endpoint(credentials, 'getChats'))
  return parseResponse<GreenApiChat[]>(response)
}

export const checkGreenApiAccount = async (credentials: GreenApiCredentials, username: string) => {
  const isUsername = username.startsWith('@') || /[a-z_]/i.test(username)
  const value = username.trim()
  const response = await fetch(endpoint(credentials, 'checkAccount'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(isUsername
      ? { username: value.startsWith('@') ? value : `@${value}` }
      : { phoneNumber: Number(value.replace(/\D/g, '')), force: true }),
  })
  return parseResponse<GreenApiCheckAccount>(response)
}

export const getGreenApiChatHistory = async (credentials: GreenApiCredentials, chatId: string) => {
  const response = await fetch(endpoint(credentials, 'getChatHistory'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, count: 100 }),
  })
  return parseResponse<GreenApiHistoryMessage[]>(response)
}