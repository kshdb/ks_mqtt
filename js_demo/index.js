const mqtt = require('mqtt');
 
// MQTT代理的连接信息
const brokerAddress = 'mqtt://192.168.1..226:1883';  // 更换为实际的MQTT代理地址
const options = {
  username: 'aaa',  // 更换为实际的用户名
  password: '123456'   // 更换为实际的密码
};
 
// 创建MQTT客户端
const client = mqtt.connect(brokerAddress, options);
 
// 连接MQTT代理后的回调函数
client.on('connect', function () {
 // console.log('Connected to MQTT broker');
  client.subscribe('testBtopic');  // 订阅名为"testBtopic"的主题
});
 
// 接收到新消息后的回调函数
client.on('message', function (topic, message) {
  console.log(`接收到消息: ${message.toString()}`);
  client.publish('testtopic', '我接收到了转发了的消息 Hello, MQTT!'+message.toString());
});
 
// 发布消息
client.publish('testtopic', '我接收到了转发了的消息 Hello, MQTT!');