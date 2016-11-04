package core

import (
	"Perekoter/controllers"

	"github.com/gin-gonic/gin"
)

func GetRouter() *gin.Engine {
	router := gin.Default()

	router.Static("/src", "./client/front/files/")
	getApiRouter(router)

	return router
}

func getApiRouter(baseRouter *gin.Engine) {
	api := baseRouter.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", controllers.Login)
			auth.POST("/logout", controllers.Logout)
			auth.GET("/check", controllers.CheckRequest)
		}

		boards := api.Group("/boards")
		{
			boards.GET("get_all_boards", controllers.GetAllBoards)
			boards.GET("get_board", controllers.GetBoard)
			boards.POST("add_board", controllers.AddBoard)
			boards.POST("edit_board", controllers.EditBoard)
			boards.POST("delete_board", controllers.DeleteBoard)
		}

		threads := api.Group("/threads")
		{
			threads.GET("get_all_threads", controllers.GetAllThreads)
			threads.GET("get_thread", controllers.GetThread)
			threads.POST("add_thread", controllers.AddThread)
			threads.POST("edit_thread", controllers.EditThread)
			threads.POST("upload_image", controllers.UploadImage)
			threads.POST("delete_thread", controllers.DeleteThread)
		}

		settings := api.Group("/settings")
		{
			settings.GET("/get_settings", controllers.GetSettings)
			settings.POST("/set_settings", controllers.SetSetting)
			settings.POST("/set_user", controllers.SetUser)
			settings.POST("/change_passcode", controllers.ChangePasscode)
		}
	}
}
