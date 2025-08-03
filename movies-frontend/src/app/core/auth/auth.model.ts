export interface ResponseAuth {
  message: string,
  token: string,
  expiresIn: string,
  tokenType: string

}

export interface RequestAuth {
    usuario: string,
    senha: string
}