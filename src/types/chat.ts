export type Message = {
  id: string
  text: string
  direction: 'incoming' | 'outgoing'
  time: string
  status?: 'sending' | 'sent' | 'error'
}

export type GreenApiCredentials = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type GreenApiChat = {
  chatId: string
  name: string
  type: string
  username?: string
  phoneNumber?: number
}
