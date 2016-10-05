package utility

type Config struct {
	Login    string
	Password string
	Period   int
	Passcode string
	Port     string
	Base     string
}

type PostJSON struct {
	comment string
}

type ThreadsJSON struct {
	posts []PostJSON
}

type ThreadJSON struct {
	Board   string
	threads ThreadsJSON
}
