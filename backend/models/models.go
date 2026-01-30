package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique"`
	Mobile   string `json:"mobile"`
	Role     string `json:"role" gorm:"default:'user'"` // user, admin
	Verified bool   `json:"verified" gorm:"default:false"`
}

type Seva struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"desc"`
	Donation    string `json:"donation"`
}

type Event struct {
	gorm.Model
	Name        string `json:"name"`
	Date        string `json:"date"`
	Description string `json:"desc"`
}

type Timing struct {
	gorm.Model
	Title string `json:"title"`
	Time  string `json:"time"`
	Type  string `json:"type"` // morning, prasadam, evening
}

type VideoCategory struct {
	gorm.Model
	Name   string  `json:"name"`
	Videos []Video `json:"videos" gorm:"foreignKey:CategoryID"`
}

type Video struct {
	gorm.Model
	Title      string `json:"title"`
	Views      string `json:"views"`
	Thumbnail  string `json:"thumbnail"`
	VideoURL   string `json:"video_url"`
	CategoryID uint   `json:"category_id"`
}

type Room struct {
	gorm.Model
	Type        string `json:"type"`
	Price       string `json:"price"`
	Description string `json:"desc"`
}

type AdminLog struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Action    string    `json:"action"`
	Details   string    `json:"details"`
	Timestamp time.Time `json:"timestamp"`
	AdminID   uint      `json:"admin_id"`
}
