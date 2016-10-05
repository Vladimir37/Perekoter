package utility

import (
	"net/http"
	"net/url"
)

type Passcode struct {
	Get   string
	Error bool
}

func (c *Passcode) PasscodeAuth() {
	config := Read()
	path := config.Base + "/makaba/posting.fcgi"

	postForm := url.Values{
		"task":     {"auth"},
		"usercode": {config.Passcode},
	}

	response, err := http.PostForm(path, postForm)
	if err != nil {
		c.Error = true
	}

	usercode := response.Header["Set-Cookie"]
}

var CurrentUsercode Passcode = Passcode{
	Get:   "",
	Error: false,
}
