package utility

import
//"net/http"

(
	"Perekoter/models"
	"strconv"
)

func CheckThread(thread models.Thread) bool {
	config := Read()
	path := config.Base + thread.Board.Addr + "/res/" + strconv.Itoa(thread.CurrentThread) + ".json"

	//response, err := http.Get(path)
	return true
}
