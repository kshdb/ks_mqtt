package test

import (
	"fmt"
	"testing"

	"github.com/kshdb/ks_mqtt/cmqtt"
)

func TestRun(t *testing.T) {
	cmqtt.CreateClient(func(option *cmqtt.ClientCallBackOption, config *cmqtt.Config) {
		option.MessageCallbackFunc = func(data *cmqtt.MessageHandlerData) {
			fmt.Println(data.GetMessageId(), data.GetTopic(), data.GetMsg())
			//client.SendMsg("收到", "sdt/c/1")
		}
	})
	select {}
}
