import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CallStartingType } from './types/startship';

@Injectable()
export class AppService {
  private readonly apiUrl = process.env.CONTACTSHIP_URL as string;
  private readonly apiKey = process.env.CONTACTSHIP_API_KEY as string; // Reemplaza con tu API Key

  constructor() {}

  async startCall(data: CallStartingType) {
    const payload = {
      from_number: data.from_number,
      to_number: data.to_number,
      full_name: data.full_name,
      agent_id: data.agent_id,
      email: data.email,
      country: data.country,
      additional_data: data.additional_data,
    };

    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return { status: 'error', message: error.message };
      }
    }
    // Simular una llamada a la API de ContactShip
    return { callId: `call-${Date.now()}`, status: 'started' };
  }

  getHello() {
    return 'Hi, from Contactship microservice';
  }
}
