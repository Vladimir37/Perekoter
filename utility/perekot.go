package utility

import (
	"Perekoter/models"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"github.com/StefanSchroeder/Golang-Roman"
)

func Perekot(thread models.Thread) error {
	db := models.DB()
	defer db.Close()

	urlPath := Config.Get().Base + "/makaba/posting.fcgi"
	//imgPath := "./covers/" + thread.Image

	//TODO - загрузка и отправка изображения

	title, errTitle := createTitle(thread)
	post, errPost := generatePost(thread)

	if (errTitle != nil) || (errPost != nil) {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to create thread " + threadID)
		return errors.New("Not created")
	}

	postForm := url.Values{
		"json":    {"1"},
		"task":    {"post"},
		"board":   {thread.Board.Addr},
		"thread":  {"0"},
		"name":    {Config.Get().Botname},
		"subject": {title},
		"comment": {post},
	}

	response, errSend := http.PostForm(urlPath, postForm)

	if errSend != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to send Perekot (thread " + threadID + ")")
		NewHistoryPoint("Failed to send Perekot (thread " + threadID + ")")
		return errors.New("Perekot not sended")
	}

	defer response.Body.Close()
	postResponse, errSave := ioutil.ReadAll(response.Body)
	if errSave != nil {
		NewError("Failed to create notification (thread " + thread.Title + ")")
		NewHistoryPoint("Failed to create notification (thread " + thread.Title + ")")
		return errors.New("Perekot not created")
	}

	var responseJSON PostResponse
	errFormate := json.Unmarshal(postResponse, &responseJSON)
	if errFormate != nil {
		NewError("Failed to convert server response to JSON (Perekot in thread " + thread.Title + ")")
		NewHistoryPoint("Failed to convert server response to JSON (Perekot in thread " + thread.Title + ")")
		return errors.New("Perekot response not formatted")
	}

	if responseJSON.Status != "OK" {
		NewError("Failed to create notification (thread " + thread.Title + ")")
		NewHistoryPoint("Failed to create Perekot (thread " + thread.Title + ")")
	} else {
		NewHistoryPoint("Perekot " + thread.Title + "was created")
		// TODO - Запоминание нового треда
	}

	return nil
}

func createTitle(thread models.Thread) (string, error) {
	title := thread.Title
	currentNum := thread.CurrentNum + 1

	if thread.Numbering {
		if thread.Roman {
			title += " #" + roman.Roman(currentNum)
		} else {
			title += " #" + strconv.Itoa(currentNum)
		}
	}

	return title, nil
}

func generatePost(thread models.Thread) (string, error) {
	var post string
	if thread.HeaderLink {
		response, errSend := http.Get(thread.Header)
		if errSend != nil {
			threadID := strconv.Itoa(int(thread.ID))
			NewError("Failed to get the post header (thread " + threadID + ")")
			return "", errors.New("Not created")
		}

		headerResponse, errSave := ioutil.ReadAll(response.Body)
		defer response.Body.Close()

		if errSave != nil {
			threadID := strconv.Itoa(int(thread.ID))
			NewError("Failed to read the post header (thread " + threadID + ")")
			return "", errors.New("Not created")
		}

		post = string(headerResponse)
	} else {
		post = thread.Header
	}

	return post, nil
}

func generateNotification(thread models.Thread) string {
	notification := Config.Get().NotificationText + strconv.Itoa(thread.CurrentThread)
	return notification
}

func notification(thread models.Thread, oldNum int) {
	path := Config.Get().Base + "/makaba/posting.fcgi"
	notification := generateNotification(thread)

	postForm := url.Values{
		"json":    {"1"},
		"task":    {"post"},
		"board":   {thread.Board.Addr},
		"thread":  {strconv.Itoa(oldNum)},
		"name":    {Config.Get().Botname},
		"comment": {notification},
	}

	response, errSend := http.PostForm(path, postForm)

	if errSend != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to send notification (thread " + threadID + ")")
		NewHistoryPoint("Failed to send notification (thread " + threadID + ")")
		return
	}

	defer response.Body.Close()
	postResponse, errSave := ioutil.ReadAll(response.Body)
	if errSave != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to create notification (thread " + threadID + ")")
		NewHistoryPoint("Failed to create notification (thread " + threadID + ")")
		return
	}

	var responseJSON PostResponse
	errFormate := json.Unmarshal(postResponse, &responseJSON)
	if errFormate != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to convert server response to JSON (notification in thread " + threadID + ")")
		NewHistoryPoint("Failed to convert server response to JSON (notification in thread " + threadID + ")")
		return
	}

	if responseJSON.Status != "OK" {
		NewError("Failed to create notification (thread " + thread.Title + ")")
		NewHistoryPoint("Failed to create notification (thread " + thread.Title + ")")
	} else {
		NewHistoryPoint("Notification in thread " + thread.Title + "was created")
	}

	fmt.Println(response.Body)
}
