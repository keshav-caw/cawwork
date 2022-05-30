import { ResponsePayloadBase } from './base-response.payload';

export class JWTAuthPayload extends ResponsePayloadBase {
  userId: string
}
