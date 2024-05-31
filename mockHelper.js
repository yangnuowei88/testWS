import Mock from "./mock.js";
import MessageHandler from "./messageHandler.js";
export default class MockHelper {
  constructor() {
    // 用于存储消息处理器
    this.messageHandlers = [];

    // 模拟消息发送（websocket）
    this.mock = new Mock();

    // 模拟消息接收
    this.mock.onmessage = (data) => {
      // 熔断器
      let fusing = false;
      const fused = () => {
        fusing = true;
      };

      // 执行消息处理
      for (let i = 0; i < this.messageHandlers.length; i++) {
        const handler = this.messageHandlers[i];
        try {
          // 执行消息处理器
          handler.handle(data, fused);
        } catch (e) {
          // 消息处理器执行失败
          handler.reject(e);
          this.messageHandlers.splice(i, 1);
          i--;
        }

        // 熔断
        if (fusing) {
          this.messageHandlers.splice(i, 1);
          return;
        }
      }

      this.onmessage(data);
    };
  }

  send(data, handler) {
    debugger;
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
      // 创建消息处理器
      const messageHandler = new MessageHandler();
      messageHandler.callback = handler;
      messageHandler.resolve = resolve;
      messageHandler.reject = reject;
      messageHandler.data = data;

      // 设置超时，3s
      messageHandler.timer = setTimeout(() => {
        messageHandler.reject(new Error("timeout"));
        this.messageHandlers.splice(
          this.messageHandlers.indexOf(messageHandler),
          1
        );
      }, 3000);

      // 添加到消息处理器列表
      this.messageHandlers.push(messageHandler);

      // 发送消息
      this.mock.send(data);
    });
  }

  onmessage() {}
}
