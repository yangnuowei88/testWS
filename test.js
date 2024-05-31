import MockHelper from "./mockHelper.js";
// 消息处理器

const mockHelper = new MockHelper();
mockHelper.onmessage = (data) => {
  insertResult({
    receiveData: data,
  });
};

document.getElementById("hello").addEventListener("click", () => {
  mockHelper
    .send("hello", (data, fused) => {
      if (data === "world") {
        fused();
        return "hello world";
      }
    })
    .then(insertResult);
});

document.getElementById("world").addEventListener("click", () => {
  mockHelper
    .send("world", (data, fused) => {
      if (data === "hello") {
        fused();
        return "hello world";
      }
    })
    .then(insertResult);
});

document.getElementById("你好").addEventListener("click", () => {
  mockHelper
    .send("你好", (data, fused) => {
      if (data === "好个der") {
        fused();
        return;
      }
    })
    .then(insertResult)
    .catch((err) => {
      insertResult({
        sendData: "你好",
        receiveData: "超时未回复",
      });
    });
});

document.getElementById("text").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const value = e.target.value;
    if (value) {
      mockHelper
        .send(value, (data, fused) => {
          if (data === value) {
            fused();
          }
        })
        .then((data) => {
          e.target.value = "";
          insertResult(data);
        });
    }
  }
});

const result = document.getElementById("result");
function insertResult(data) {
  const messageItem = document.createElement("div");
  messageItem.classList.add("message-item");

  const time = document.createElement("span");
  time.classList.add("time");
  time.innerText = new Date().toLocaleTimeString();
  messageItem.appendChild(time);

  if (data.sendData) {
    const send = document.createElement("p");
    send.innerText = "发送：" + data.sendData;
    messageItem.appendChild(send);
  }

  const receive = document.createElement("p");
  receive.innerText = "收到：" + data.receiveData;
  messageItem.appendChild(receive);

  result.appendChild(messageItem);

  // xingx
  // setTimeout(() => {
  //   messageItem.scrollIntoView({
  //     behavior: 'smooth'
  //   })
  // })
}
