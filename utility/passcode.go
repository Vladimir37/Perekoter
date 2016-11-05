package utility

import (
	"bytes"
	"fmt"
	"net/http"
	"net/url"
)

type Passcode struct {
	Get   string
	Error bool
}

func (c *Passcode) PasscodeAuth() bool {
	path := Config.Get().Base + "makaba/makaba.fcgi"

	postForm := url.Values{
		"task":     {"auth"},
		"usercode": {Config.Get().Passcode},
	}

	request, errReq := http.NewRequest("POST", path, bytes.NewBufferString(postForm.Encode()))

	response, errRes := http.DefaultTransport.RoundTrip(request)

	if errReq != nil || errRes != nil {
		c.Error = true
	}

	fmt.Println(response.Header["Set-Cookie"])
	return true
}

var CurrentUsercode Passcode = Passcode{
	Get:   "",
	Error: false,
}
