import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // console.log('Cliente conectado', client);
    const token = client.handshake.headers.authentication as string;
    console.log(token);
    /* let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      client.disconnect();
      return;
    } */
    this.messagesWsService.registerClient(client);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);

    // Asi emite unicamente al cliente que emitio el mensaje
    /*     client.emit('message-from-server', {
      nameUser: 'Soy yo!',
      message: payload.message || 'no-message!!',
    }); */

    // Emitir a todos menos al cliente emisor
    /*     client.broadcast.emit('message-from-server', {
      nameUser: 'Soy yo!',
      message: payload.message || 'no-message!!',
    }); */

    // Emitir a todos los clientes
    this.wss.emit('message-from-server', {
      nameUser: 'Soy yo!',
      message: payload.message || 'no-message!!',
    });
  }
}
