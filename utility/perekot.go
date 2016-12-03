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
	"github.com/parnurzeal/gorequest"
)

func Perekot(thread models.Thread) error {
	config := Config.Get()
	db := models.DB()
	defer db.Close()

	urlPath := config.Base + "/makaba/posting.fcgi?json=1"
	imgPath := "./covers/" + thread.Image

	title, errTitle := createTitle(thread)
	post, errPost := generatePost(thread)
	file, errFile := ioutil.ReadFile(imgPath)

	if (errTitle != nil) || (errPost != nil) || (errFile != nil) {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to create header of thread " + threadID)
		return errors.New("Not created")
	}

	cookie := http.Cookie{
		Name:  "passcode_auth",
		Value: CurrentUsercode.Usercode,
	}

	request := gorequest.New()
	_, body, errSend := request.Post(urlPath).
		Type("multipart").
		SendFile(file, thread.Image, "formimages[]").
		Send("task=post").
		Send("board=" + thread.Board.Addr).
		Send("thread=0").
		Send("name=" + config.Botname).
		Send("subject=" + title).
		Send("comment=" + post).
		AddCookie(&cookie).
		End()

	if errSend != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to send Perekot (thread " + threadID + ")")
		NewHistoryPoint("Failed to send Perekot (thread " + threadID + ")")
		return errors.New("Perekot not sended")
	}

	var responseBody PostResponse
	errFormate := json.Unmarshal([]byte(body), &responseBody)

	if errFormate != nil {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to send Perekot (thread " + threadID + ") - incorrect server response")
		NewHistoryPoint("Failed to send Perekot (thread " + threadID + ") - incorrect server response")
		return errors.New("Perekot not sended")
	}

	if responseBody.Error != 0 {
		threadID := strconv.Itoa(int(thread.ID))
		NewError("Failed to send Perekot (thread " + threadID + ")")
		NewHistoryPoint("Failed to send Perekot (thread " + threadID + ") - error " + responseBody.Reason)
		return errors.New("Perekot not sended")
	}

	targetNum := responseBody.Target

	// postResponse, errSave := ioutil.ReadAll(response.Body)
	// if errSave != nil {
	// 	NewError("Failed to create notification (thread " + thread.Title + ")")
	// 	NewHistoryPoint("Failed to create notification (thread " + thread.Title + ")")
	// 	return errors.New("Perekot not created")
	// }

	// var responseJSON PostResponse
	// errFormate := json.Unmarshal(postResponse, &responseJSON)
	// if errFormate != nil {
	// 	NewError("Failed to convert server response to JSON (Perekot in thread " + thread.Title + ")")
	// 	NewHistoryPoint("Failed to convert server response to JSON (Perekot in thread " + thread.Title + ")")
	// 	return errors.New("Perekot response not formatted")
	// }

	// if responseJSON.Status != "OK" {
	// 	NewError("Failed to create notification (thread " + thread.Title + ")")
	// 	NewHistoryPoint("Failed to create Perekot (thread " + thread.Title + ")")
	// } else {
	// 	NewHistoryPoint("Perekot " + thread.Title + "was created")
	// 	// TODO - Запоминание нового треда
	// }

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
