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
