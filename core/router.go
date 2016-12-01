package core

import (
	"Perekoter/controllers"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetRouter() *gin.Engine {
	router := gin.Default()
	router.LoadHTMLGlob("client/page.html")

	router.Static("/src", "./client/front/files/")
	getApiRouter(router)

	router.NoRoute(func(c *gin.Context) {
		path := strings.Split(c.Request.URL.Path, "/")
		if (path[1] != "") && (path[1] == "api") {
			c.JSON(404, gin.H{
				"status": 10,
			})
		} else {
			c.HTML(http.StatusOK, "page.html", "")
		}
	})

	return router
}

func getApiRouter(baseRouter *gin.Engine) {
	api := baseRouter.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.GET("/check", controllers.CheckRequest)
			auth.GET("/admin", controllers.CheckMiddleware, controllers.AdminData)
			auth.POST("/login", controllers.Login)
			auth.POST("/logout", controllers.Logout)
		}

		boards := api.Group("/boards")
		{
			boards.GET("get_all_boards", controllers.GetAllBoards)
			boards.GET("get_board", controllers.GetBoard)
			boards.POST("add_board", controllers.CheckMiddleware, controllers.AddBoard)
			boards.POST("edit_board", controllers.CheckMiddleware, controllers.EditBoard)
			boards.POST("delete_board", controllers.CheckMiddleware, controllers.DeleteBoard)
		}

		threads := api.Group("/threads")
		{
			threads.GET("get_all_threads", controllers.GetAllThreads)
			threads.GET("get_thread", controllers.GetThread)
			threads.POST("add_thread", controllers.CheckMiddleware, controllers.AddThread)
			threads.POST("edit_thread", controllers.CheckMiddleware, controllers.EditThread)
			threads.POST("upload_image", controllers.CheckMiddleware, controllers.UploadImage)
			threads.POST("delete_thread", controllers.CheckMiddleware, controllers.DeleteThread)
		}

		settings := api.Group("/settings")
		{
			settings.GET("/get_settings", controllers.CheckMiddleware, controllers.GetSettings)
			settings.POST("/set_settings", controllers.CheckMiddleware, controllers.SetSetting)
			settings.POST("/set_user", controllers.CheckMiddleware, controllers.SetUser)
			settings.POST("/change_passcode", controllers.CheckMiddleware, controllers.ChangePasscode)
		}

		issues := api.Group("/issues")
		{
			issues.GET("/get_all_issues", controllers.CheckMiddleware, controllers.GetAllIssues)
			issues.POST("/send_issue", controllers.SendIssue)
			issues.POST("/close_issue", controllers.CheckMiddleware, controllers.CloseIssue)
		}

		errors := api.Group("/errors")
		{
			errors.GET("/get_all_errors", controllers.CheckMiddleware, controllers.GetAllErrors)
			errors.POST("/close_error", controllers.CheckMiddleware, controllers.CloseError)
			errors.POST("/close_all_errors", controllers.CheckMiddleware, controllers.CloseAllErrors)
		}

		history := api.Group("/history")
		{
			history.GET("/get_all_history", controllers.CheckMiddleware, controllers.GetAllHistory)
		}
	}
}
