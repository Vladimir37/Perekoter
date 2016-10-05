package utility

type Config struct {
	Login    string
	Password string
	Period   int
	Passcode string
	Port     string
	Base     string
	Botname  string
}

type ThreadJSON struct {
	Board       string
	Posts_count int
}
