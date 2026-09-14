export interface ContactoFormPayload {
  nombre: string;
  apellido: string;
  email: string;
  mensaje: string;
}

export interface ContactoApiResponse {
  ok: boolean;
  error?: string;
}
