package utility

type ConfigStruct struct {
	Login            string
	Password         string
	Period           int
	Passcode         string
	Port             string
	Base             string
	Botname          string
	Notification     bool
	NotificationText string
}

type ThreadJSON struct {
	Board       string
	Posts_count int
}

type PostResponse struct {
	Error  int
	Reason string
	Status string
	Num    int
}

type NumRequest struct {
	Num int `json:"num" binding:"required"`
}

type LoginRequest struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type BoardRequest struct {
	ID        int    `json:"id"`
	Name      string `json:"name" binding:"required"`
	Address   string `json:"addr" binding:"required"`
	Bumplimit int    `json:"bumplimit" binding:"required"`
}

type ThreadRequest struct {
	ID            int    `json:"id"`
	Numbering     bool   `json:"numbering" binding:"required"`
	Roman         bool   `json:"roman" binding:"required"`
	CurrentNum    int    `json:"current_num" binding:"required"`
	CurrentThread int    `json:"current_thread" binding:"required"`
	Title         string `json:"title" binding:"required"`
	HeaderLink    bool   `json:"header_link" binding:"required"`
	Header        string `json:"header" binding:"required"`
	BoardNum      int    `json:"board_num" binding:"required"`
	Active        bool   `json:"active" binding:"required"`
}
