package utility

import (
	"Perekoter/models"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
)

func CheckThread(thread models.Thread) bool {
	path := Config.Get().Base + thread.Board.Addr + "/res/" + strconv.Itoa(thread.CurrentThread) + ".json"

	response, errSend := http.Get(path)
	if errSend != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to check thread " + threadID)
		return false
	}

	threadResponse, errSave := ioutil.ReadAll(response.Body)

	if errSave != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to read server response (thread " + threadID + ")")
		return false
	}

	var responseJSON ThreadJSON
	errFormate := json.Unmarshal(threadResponse, &responseJSON)
	if errFormate != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to convert server response to JSON (thread " + threadID + ")")
		return false
	}

	if responseJSON.Posts_count >= thread.Board.Bumplimit {
		go Perekot(thread)
	}

	return true
}
