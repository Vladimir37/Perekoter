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
	config := Config.Get()
	path := config.Base + "makaba/makaba.fcgi"

	postForm := url.Values{
		"task":     {"auth"},
		"usercode": {config.Passcode},
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
		NewError("Incorrect passcode")
		return false
	}
	setCookie = strings.Split(setCookie[0], ";")
	setCookie = strings.Split(setCookie[0], "=")

	c.Usercode = setCookie[0]
	c.Error = false

	return true
}

var CurrentUsercode Passcode = Passcode{
	Usercode: "",
	Error:    false,
}
