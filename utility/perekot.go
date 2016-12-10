package utility

import (
	"Perekoter/models"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strconv"

	"time"

	"github.com/StefanSchroeder/Golang-Roman"
	"github.com/parnurzeal/gorequest"
)

func Perekot(thread models.Thread) error {
	config := Config.Get()
	db := models.DB()
	defer db.Close()

	oldThread := thread.CurrentThread
	threadID := strconv.Itoa(int(thread.ID))

	urlPath := config.Base + "/makaba/posting.fcgi?json=1"
	imgPath := "./covers/" + thread.Image

	title, errTitle := createTitle(thread)
	post, errPost := generatePost(thread)
	file, errFile := ioutil.ReadFile(imgPath)

	if (errTitle != nil) || (errPost != nil) || (errFile != nil) {
		NewError("Failed to create content of thread " + threadID)
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
		Send("json=1").
		Send("comment=" + post).
		Send("task=post").
		Send("board=" + thread.Board.Addr).
		Send("thread=0").
		Send("name=" + config.Botname).
		Send("subject=" + title).
		AddCookie(&cookie).
		End()

	if errSend != nil {
		NewError("Failed to send Perekot (thread " + threadID + ")")
		NewHistoryPoint("Failed to send Perekot (thread " + threadID + ")")
		return errors.New("Perekot not sended")
	}

	var responseBody PostResponse
	errFormate := json.Unmarshal([]byte(body), &responseBody)

	if errFormate != nil {
		NewError("Failed to send Perekot (thread " + threadID + ") - incorrect server response")
		NewHistoryPoint("Failed to send Perekot (thread " + threadID + ") - incorrect server response")
		return errors.New("Perekot not sended")
	}

	if responseBody.Error != 0 {
		NewError("Failed to send Perekot (thread " + threadID + ") - error " + responseBody.Reason)
		NewHistoryPoint("Failed to send Perekot (thread " + threadID + ") - error " + responseBody.Reason)
		return errors.New("Perekot not sended")
	}

	NewHistoryPoint("Perekot was created (thread " + threadID + ")")

	targetNum := responseBody.Target

	updateThreadAddr(thread, targetNum)

	if thread.Numbering {
		threadIncrement(thread)
	}

	if config.Notification {
		time.Sleep(60 * time.Second)
		notification(thread, oldThread, targetNum)
	}

	if config.OldLink {
		time.Sleep(60 * time.Second)
		oldLink(thread, oldThread, targetNum)
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
		request := gorequest.New()

		_, body, errSend := request.Get(thread.Header).End()
		if errSend != nil {
			threadID := strconv.Itoa(int(thread.ID))
			NewError("Failed to get the post header (thread " + threadID + ")")
			return "", errors.New("Not created")
		}

		post = body
	} else {
		post = thread.Header
	}

	return post, nil
}

func generateNotification(newNum int) string {
	notification := Config.Get().NotificationText + strconv.Itoa(newNum)
	return notification
}

func generateOldLink(newNum int) string {
	notification := Config.Get().OldLinkText + strconv.Itoa(newNum)
	return notification
}

func notification(thread models.Thread, oldNum int, newNum int) {
	config := Config.Get()
	path := config.Base + "/makaba/posting.fcgi"
	notification := generateNotification(newNum)
	threadID := strconv.Itoa(int(thread.ID))

	cookie := http.Cookie{
		Name:  "passcode_auth",
		Value: CurrentUsercode.Usercode,
	}

	request := gorequest.New()
	_, body, errSend := request.Post(path).
		Type("multipart").
		Send("task=post").
		Send("board=" + thread.Board.Addr).
		Send("thread=" + strconv.Itoa(oldNum)).
		Send("name=" + config.Botname).
		Send("subject=PEREKOT").
		Send("comment=" + notification).
		AddCookie(&cookie).
		End()

	if errSend != nil {
		NewError("Failed to send notification (thread " + threadID + ")")
		NewHistoryPoint("Failed to send notification (thread " + threadID + ")")
		return
	}

	var responseBody PostResponse
	errFormate := json.Unmarshal([]byte(body), &responseBody)

	if errFormate != nil {
		NewError("Failed to convert server response to JSON (notification in thread " + threadID + ")")
		NewHistoryPoint("Failed to convert server response to JSON (notification in thread " + threadID + ")")
		return
	}

	if responseBody.Error != 0 {
		NewError("Failed to create notification (thread " + threadID + ") - error " + responseBody.Reason)
		NewHistoryPoint("Failed to create notification (thread " + threadID + ") - error " + responseBody.Reason)
	} else {
		NewHistoryPoint("Notification in thread \"" + thread.Title + "\" was created")
	}
}

func oldLink(thread models.Thread, oldNum int, newNum int) {
	config := Config.Get()
	path := config.Base + "/makaba/posting.fcgi"
	notification := generateOldLink(oldNum)
	threadID := strconv.Itoa(int(thread.ID))

	cookie := http.Cookie{
		Name:  "passcode_auth",
		Value: CurrentUsercode.Usercode,
	}

	request := gorequest.New()
	_, body, errSend := request.Post(path).
		Type("multipart").
		Send("task=post").
		Send("board=" + thread.Board.Addr).
		Send("thread=" + strconv.Itoa(newNum)).
		Send("name=" + config.Botname).
		Send("subject=PEREKOT").
		Send("comment=" + notification).
		AddCookie(&cookie).
		End()

	if errSend != nil {
		NewError("Failed to send old link (thread " + threadID + ")")
		NewHistoryPoint("Failed to send old link (thread " + threadID + ")")
		return
	}

	var responseBody PostResponse
	errFormate := json.Unmarshal([]byte(body), &responseBody)

	if errFormate != nil {
		NewError("Failed to convert server response to JSON (old link notification in thread " + threadID + ")")
		NewHistoryPoint("Failed to convert server response to JSON (old link notification in thread " + threadID + ")")
		return
	}

	if responseBody.Error != 0 {
		NewError("Failed to create old link notification (thread " + threadID + ") - error " + responseBody.Reason)
		NewHistoryPoint("Failed to create old link notification (thread " + threadID + ") - error " + responseBody.Reason)
	} else {
		NewHistoryPoint("Old link notification in thread \"" + thread.Title + "\" was created")
	}
}

func threadIncrement(oldThread models.Thread) {
	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, oldThread.ID)

	thread.CurrentNum++
	db.Save(&thread)
}

func updateThreadAddr(oldThread models.Thread, newThread int) {
	db := models.DB()
	defer db.Close()

	var thread models.Thread
	db.First(&thread, oldThread.ID)

	thread.CurrentThread = newThread
	db.Save(&thread)
}
