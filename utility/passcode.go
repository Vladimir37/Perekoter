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
	path := Config.Get().Base + "/makaba/posting.fcgi"

	postForm := url.Values{
		"task":     {"auth"},
		"usercode": {Config.Get().Passcode},
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
