package utility

import (
	"encoding/json"
	"io/ioutil"

    "Perekoter/utility"
)

func Read() utility.Config {
	file, errRead := ioutil.ReadFile("./config.json")
	var config utility.Config
	errFormatting := json.Unmarshal(file, &config)
	if (errRead != nil) || (errFormatting != nil) {
		panic("Configuration is not readed")
	}
	return config
}

func Write(data utility.Config) bool {
	new_config, errFormat := json.Marshal(data)
    if errFormat != nil {
        return false
    }

    errWriting := ioutil.WriteFile("./config", new_config, 0777)
    if errWriting := nil {
        return false
    } else {
        return true
    }
}
