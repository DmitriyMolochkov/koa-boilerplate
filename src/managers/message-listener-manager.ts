import { BaseMessage, BaseMessageListener } from '#message-bus';
import * as NoteMessageListeners from '#modules/notes/message-listeners';

type ListenerType = BaseMessageListener<BaseMessage>;

class MessageListenerManager {
  private listeners: ListenerType[];

  constructor(listenerGroups: Record<string | symbol, Constructor<ListenerType>>[]) {
    this.listeners = [...new Set<ListenerType>(
      listenerGroups
        .flatMap((group) => Object.values(group).map((Listener) => new Listener())),
    )];
  }

  public async init() {
    await Promise.all(this.listeners.map(async (listener) => listener.init()));
  }

  public async start() {
    await Promise.all(this.listeners.map(async (listener) => listener.start()));
  }

  public async stop() {
    await Promise.all(this.listeners.map(async (listener) => listener.stop()));
  }

  public async terminate() {
    await Promise.all(this.listeners.map(async (listener) => listener.terminate()));
  }
}

export default new MessageListenerManager([
  NoteMessageListeners,
]);
