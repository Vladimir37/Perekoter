package utility

import "Perekoter/models"

func Cycle() {
	db := models.DB()
	defer db.Close()

	var threads []models.Thread
	db.Find(&threads, models.Thread{
		Active: true,
	})

	for i := 0; i < len(threads); i++ {
		db.Model(&threads[i]).Related(&threads[i].Board)
		// Убрать комментирование на проде
		// go CheckThread(threads[i])
		CheckThread(threads[i])
	}
}
