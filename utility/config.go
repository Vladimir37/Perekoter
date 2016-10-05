package utility

import (
	"encoding/json"
	"io/ioutil"
)

func Read() Config {
	file, errRead := ioutil.ReadFile("./config.json")
	var config Config
	errFormatting := json.Unmarshal(file, &config)
	if (errRead != nil) || (errFormatting != nil) {
		panic("Configuration is not readed")
	}
	return config
}

func Write(data Config) bool {
	newConfig, errFormat := json.Marshal(data)
	if errFormat != nil {
		return false
	}

	errWriting := ioutil.WriteFile("./config", newConfig, 0777)
	if errWriting == nil {
		return false
	} else {
		return true
	}
}
