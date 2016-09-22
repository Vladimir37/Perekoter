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

type Config struct {
	Login    string
	Password string
	Period   int
	Passcode string
	Port     string
}
