package utility

import (
	"bytes"
	"net/http"
	"net/url"
	"strings"
)

type Passcode struct {
	Usercode string
	Error    bool
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
		NewError("Failed to passcode request")
		return false
	}

	setCookie := response.Header["Set-Cookie"]
	if len(setCookie) == 0 {
		c.Error = true
		NewError("Incorrect password")
		return false
	}
	setCookie = strings.Split(setCookie[0], ";")
	setCookie = strings.Split(setCookie[0], "=")

	c.Usercode = setCookie[0]
	return true
}

var CurrentUsercode Passcode = Passcode{
	Usercode: "",
	Error:    false,
}
