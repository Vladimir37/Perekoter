package utility

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
)

type ConfigOperator struct {
	Config ConfigStruct
}

func (c *ConfigOperator) Read() {
	file, errRead := ioutil.ReadFile("./config.json")
	var config ConfigStruct
	errFormatting := json.Unmarshal(file, &config)
	if (errRead != nil) || (errFormatting != nil) {
		panic("Configuration is not readed")
	}
	c.Config = config
}

func (c *ConfigOperator) Write(data ConfigStruct) {
	newConfig, errFormat := json.Marshal(data)
	if errFormat != nil {
		NewError("Failing to formate new config")
		fmt.Println(errFormat)
	}

	errWriting := ioutil.WriteFile("./config", newConfig, 0777)
	if errWriting == nil {
		NewError("Failing to write new config")
	} else {
		c.Config = data
	}
}

func (c *ConfigOperator) Get() ConfigStruct {
	return c.Config
}

var Config ConfigOperator = ConfigOperator{
	Config: ConfigStruct{},
}
