package utility

import "Perekoter/models"

func Cycle() {
	db := models.DB()
	defer db.Close()

	var threads []models.Thread
	db.Preload("Board").Find(&threads, models.Thread{
		Active: true,
	})

	for i := 0; i < len(threads); i++ {
		db.Model(&threads[i]).Related(&threads[i].Board)
		go CheckThread(threads[i])
	}
}
