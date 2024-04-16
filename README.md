# ks_mqtt

基于goframe和EMQX对接的mqtt操作库

### 配置

```config.yaml
mqtt:
  clientAdmin: # 此位置就是 clietName
        debug : false # 是否开启debug
        url : "mqtt://123.207.210.226:1883" # 连接目标
        clientId : "mqttx_8779ecf7" # 客户端id
        subscribe : "testAtopic/#" # 订阅频道 无需订阅 写 false
        qos : 1 # 协议质量 0 1 2
        username : "aaa" # 用户名密码
        password : "123456" # 密码
        cleanSession : false # 清空 session
```
### 代码演示
```go
package main

import (
	"fmt"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/util/gconv"
	"github.com/kshdb/ks_mqtt/cmqtt"
)

func main() {
	cmqtt.CreateClient(func(option *cmqtt.ClientCallBackOption, config *cmqtt.Config) {
		option.MessageCallbackFunc = func(data *cmqtt.MessageHandlerData) {
			fmt.Println("接收到消息", data.GetMessageId(), data.GetTopic(), data.GetMsg())
			
		}
	})
	select {}
}

```

### 快速接入示例

```go
package mqtt

import (
    "demo/src/service/mqtt/handler"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/kshdb/ks_mqtt/mqtt"
)

// 注册 MQTT 处理
var register = map[string]func(data *xmqtt.EventHandlerData){
    xmqtt.ConnectEvent:    handler.Connect,   // 客户端连接事件
    xmqtt.DisconnectEvent: handler.Connect,   // 客户端断开连接事件
    xmqtt.NullEvent:       handler.NullEvent, // 没有事件时触发
}

func Service() {
    ctx := gctx.New()
    xmqtt.CreateClient(func(option *xmqtt.ClientCallBackOption, config *xmqtt.Config) {
        option.MessageCallbackFunc = func(data *xmqtt.MessageHandlerData) {
            // 获取 事件
            eventName, eventData, eventErr := data.GetEvent()
            if eventErr != nil {
                g.Log().Error(ctx, "MQTT 事件出错", eventErr)
                return
            }
            // 处理 事件
            register[eventName](&xmqtt.EventHandlerData{EventData: eventData, MsgHandlerData: data})
        }
    })
}

```

#### 处理事件

```go
package handler

import (
    "fmt"
    "github.com/gogf/gf/v2/frame/g"
    "github.com/kshdb/ks_mqtt/mqtt"
)

func NullEvent(data *cmqtt.EventHandlerData) {
    fmt.Println(data.MsgHandlerData.GetTopic(), data.MsgHandlerData.GetMsg())
	data.CMQTT.SendMsg(g.Map{
		"code": 0,
		"msg":  "收到了消息：",
		"data": gconv.Map(data.GetMsg()),
	}, "testtopic")
}
```

**PS: ``*cmqtt.EventHandlerData`` 中已实现 ``SendMsg``  操作 默认使用接收客户端用户进行发送操作 **

> *cmqtt.EventHandlerData 操作对象内的函数

SendMsg(msg any, topic string, qos ...byte) error 

**``*cmqtt.Client`` 中的 ``SendMsg`` 函数是此函数的原型 **

- ``GetJson`` 函数 获取订阅频道接收到的数据的json对象 **需要确保接收数据为 JSON**

GetJson() (json *gjson.Json)

### 细节操作

> 获取 ``MQTT`` 操作对象

```go
cmqtt.MqttList.Get("{配置里设置的MQTT名称}") // 获取到 *cmqtt.Client 操作对象
```

> *cmqtt.Client 操作对象内函数

- ``SendMsg`` 函数

SendMsg(msg any, topic string, qos ...byte) error

1. 参数 ``msg`` **要发送给客户端的数据输入任何类型会自动被转换成 json 数据发送给客户端**
2. 参数 ``topic`` **发送到那个订阅频段 例:** ``a/1``

3. qos **发送模式默认** ``0``

> 快速返回 json

```go
cmqtt.MqttList.Get(global.DefaultMqttClientName).Json().SetData(g.Map{
	"msg":  msg,
	"mode": mode,
	"from": from,
	"to":   to,
}).Resp(lib.GetMqttClientTopic(userId), "wsMessage")
```

### 推荐服务端

> EMQX 免费好用的 MQTT 服务端

[EMQX: 大规模分布式 MQTT 消息服务器](https://www.emqx.io/zh)

> MQTTX 方便开发调试的客户端

[MQTTX：全功能 MQTT 客户端工具](https://mqttx.app/zh)

