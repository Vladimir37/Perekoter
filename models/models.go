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
	db.AutoMigrate(&Board{}, &Thread{})
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
	Numbering     bool
	Roman         bool
	CurrentNum    int
	CurrentThread int
	Title         string
	HeaderLink    bool
	Header        string
	Image         string
	Board         Board
	BoardID       int
	Active        bool
}
