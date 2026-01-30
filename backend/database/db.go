package database

import (
	"log"
	"sode-matha-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(connectionString string) {
	var err error
	DB, err = gorm.Open(postgres.Open(connectionString), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")

	// Migration
	log.Println("Running migrations...")
	err = DB.AutoMigrate(
		&models.User{},
		&models.Seva{},
		&models.Event{},
		&models.Timing{},
		&models.VideoCategory{},
		&models.Video{},
		&models.Room{},
		&models.AdminLog{},
	)
	if err != nil {
		log.Fatal("Migration failed:", err)
	}
	log.Println("Migrations completed")
}
