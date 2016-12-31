package models

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func Init() {
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("Failed to connect database")
	}
	db.AutoMigrate(&Board{}, &Thread{}, &Issue{}, &Error{}, &HistoryPoint{})
	db.Close()
}

func DB() *gorm.DB {
	db, err := gorm.Open("sqlite3", "test.db")
	if err != nil {
		panic("Failed to connect database")
	}
	return db
}

type Board struct {
	gorm.Model
	Addr      string
	Name      string
	Bumplimit int
}

type Thread struct {
	gorm.Model
	Numbering       bool
	Roman           bool
	NumberingSymbol string
	CurrentNum      int
	CurrentThread   int
	Title           string
	HeaderLink      bool
	Header          string
	Image           string
	LastPerekot     int
	LastPosts       int
	Board           Board
	BoardID         uint
	Active          bool
}

type Issue struct {
	gorm.Model
	Title  string
	Text   string
	Link   string
	Active bool
}

type Error struct {
	gorm.Model
	Text   string
	Active bool
}

type HistoryPoint struct {
	gorm.Model
	Text string
}
