export interface Token {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token: string
}

export interface User {
  country: string
  display_name: string
  email: string
  external_urls: {
    spotify: string
  }
  id: string
  images: {
    url: string
    height: number
    width: number
  }[]
}
