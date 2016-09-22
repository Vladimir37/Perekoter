package utility

import (
	"time"

	"github.com/gin-gonic/gin"
)

func SetCookie(c *gin.Context, key string, value string) {
	expiration := time.Now().Add(365 * 24 * time.Hour)
	cookie := c.Cookie{
		Name:    key,
		Value:   value,
		Expires: expiration,
	}
	c.SetCookie(c, &cookie)
}
