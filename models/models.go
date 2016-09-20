package models

import (
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/sqlite"
)

func Start() {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("failed to connect database")
    }
    db.AutoMigrate(&Board{}, &Thread{})
    defer db.Close()
}

func DB() *gorm.DB {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("failed to connect database")
    }
    db.AutoMigrate(&Board{}, &Thread{})
    return db
}

type Board struct {
    gorm.Model
    Addr string
    Bumplimit int
}

type Thread struct {
    gorm.Model
    Numbering bool
    Roman bool
    CurrentNum int
    Title string
    Header string
    Image string
    Board Board
}