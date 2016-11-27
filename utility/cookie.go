package utility

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func SetCookie(c *gin.Context, key string, value string) {
	expiration := time.Now().Add(365 * 24 * time.Hour)
	cookie := http.Cookie{
		Name:    key,
		Value:   value,
		Expires: expiration,
		Path:    "/",
	}
	http.SetCookie(c.Writer, &cookie)
}

func GetCookie(c *gin.Context, key string) (string, error) {
	cookie, err := c.Request.Cookie(key)
	if err != nil {
		return "", errors.New("No cookie")
	} else {
		return cookie.Value, nil
	}
}
