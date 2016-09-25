package utility

import (
	"time"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetCookie(c *gin.Context, key string, value string) {
	expiration := time.Now().Add(365 * 24 * time.Hour)
	cookie := http.Cookie{
		Name:    key,
		Value:   value,
		Expires: expiration,
	}
    http.SetCookie(c.Writer, &cookie)
}

func GetCookie(c *gin.Context, key string) (string, string) {
    cookie, err := c.Request.Cookie(key)
    if err != nil {
        return nil, "Error"
    } else {
        return cookie, nil
    }
}