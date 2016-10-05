package utility

import
//"net/http"

(
	"Perekoter/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
)

func CheckThread(thread models.Thread) bool {
	path := Config.Get().Base + thread.Board.Addr + "/res/" + strconv.Itoa(thread.CurrentThread) + ".json"

	response, errSend := http.Get(path)
	if errSend != nil {
		return false
	}

	threadResponse, errSave := ioutil.ReadAll(response.Body)

	if errSave != nil {
		return false
	}

	var responseJSON ThreadJSON
	errFormate := json.Unmarshal(threadResponse, &responseJSON)
	if errFormate != nil {
		fmt.Println(errFormate)
		return false
	}

	if responseJSON.Posts_count >= thread.Board.Bumplimit {
		go Perekot(thread)
	}

	return true
}
