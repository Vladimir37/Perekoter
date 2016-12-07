package utility

import (
	"bytes"
	"encoding/json"
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

func (c *ConfigOperator) Write(data ConfigStruct) error {
	var niceConfig bytes.Buffer

	newConfig, errFormat := json.Marshal(data)
	errPrettify := json.Indent(&niceConfig, newConfig, "", "  ")

	if (errFormat != nil) || (errPrettify != nil) {
		NewError("Failed to formate new config (utility)")
		return errFormat
	}

	errWriting := ioutil.WriteFile("./config.json", niceConfig.Bytes(), 0777)
	if errWriting != nil {
		NewError("Failed to write new config (utility)")
		return errWriting
	} else {
		c.Config = data
		return nil
	}
}

func (c *ConfigOperator) Get() ConfigStruct {
	return c.Config
}

var Config ConfigOperator = ConfigOperator{
	Config: ConfigStruct{},
}
