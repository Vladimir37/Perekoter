package utility

import (
	"Perekoter/models"
	"net/http"
	"net/url"
)

func Perekot(thread models.Thread) {
	db := models.DB()
	defer db.Close()

	config := Read()
	path := config.Base + "/makaba/posting.fcgi"

	postForm := url.Values{
		"json":    {"1"},
		"task":    {"post"},
		"board":   {thread.Board.Addr},
		"thread":  {"0"},
		"name":    {config.Botname},
		"subject": {"title"},
		"comment": {"text"},
	}

	http.PostForm(path, postForm)
}
