package utility

import (
	"Perekoter/models"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/StefanSchroeder/Golang-Roman"
)

func Perekot(thread models.Thread) {
	db := models.DB()
	defer db.Close()

	path := Config.Get().Base + "/makaba/posting.fcgi"

	postForm := url.Values{
		"json":    {"1"},
		"task":    {"post"},
		"board":   {thread.Board.Addr},
		"thread":  {"0"},
		"name":    {Config.Get().Botname},
		"subject": {createTitle(thread)},
		"comment": {"text"},
	}

	http.PostForm(path, postForm)
}

func createTitle(thread models.Thread) string {
	title := thread.Title
	currentNum := thread.CurrentNum + 1

	if thread.Numbering {
		if thread.Roman {
			title += " #" + roman.Roman(currentNum)
		} else {
			title += " #" + strconv.Itoa(currentNum)
		}
	}

	return title
}

func generatePost(thread models.Thread) {
	var post string
	if thread.HeaderLink {
		response, errSend := http.Get(thread.Header)
		if errSend != nil {
			fmt.Println()
		}
	} else {
		post = thread.Header
	}
}
