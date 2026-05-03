import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { apiBaseUrl } from '../config/api';

let connection: HubConnection | null = null;

export const createLogHubConnection = (): HubConnection => {
  if (!connection) {
    const hubUrl = apiBaseUrl
      ? `${apiBaseUrl.replace(/\/$/, '')}/loghub`
      : '/loghub';

    connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();
  }
  return connection;
};
