package main

import (
	"log"

	"sode-matha-backend/config"
	"sode-matha-backend/database"
	"sode-matha-backend/handlers"
	"sode-matha-backend/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Config
	cfg := config.LoadConfig()

	// 2. Connect Database
	database.Connect(cfg.DatabaseURL)

	// 3. Seed Data (if empty)
	seedData()

	// 4. Init Firebase
	handlers.InitFirebase()

	// 5. Setup Router
	r := gin.Default()

	// CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(corsConfig))

	// Routes
	api := r.Group("/api")
	{
		// Public
		api.GET("/timings", handlers.GetTimings)
		api.GET("/events", handlers.GetEvents)
		api.GET("/sevas", handlers.GetSevas)
		api.GET("/videos", handlers.GetVideoCategories)
		api.GET("/rooms", handlers.GetRooms)

		// Auth
		api.POST("/auth/verify-token", handlers.VerifyFirebaseToken)
		api.POST("/auth/send-otp", handlers.SendOTP)
		api.POST("/auth/verify-otp", handlers.VerifyOTP)

		// Email OTP Auth
		api.POST("/auth/send-email-otp", handlers.SendEmailOTP)
		api.POST("/auth/verify-email-otp", handlers.VerifyEmailOTP)

		// Admin Login (pre-configured email/password)
		api.POST("/auth/admin-login", handlers.AdminLogin)

		// Admin (Should be protected with middleware in real usage)
		admin := api.Group("/admin")
		{
			admin.GET("/logs", handlers.GetAdminLogs)

			admin.POST("/sevas", handlers.CreateSeva)
			// admin.PUT("/sevas/:id", handlers.UpdateSeva)
			admin.DELETE("/sevas/:id", handlers.DeleteSeva)

			admin.POST("/events", handlers.CreateEvent)
			admin.DELETE("/events/:id", handlers.DeleteEvent)
		}
	}

	// Run
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal("Unable to start server: ", err)
	}
}

func seedData() {
	// Check if data exists
	var count int64
	database.DB.Model(&models.Seva{}).Count(&count)
	if count > 0 {
		return // Already seeded
	}

	log.Println("Seeding initial data...")

	// Sevas
	sevas := []models.Seva{
		{Name: "Abhisheka", Description: "Sacred bath ritual", Donation: "₹500+"},
		{Name: "Pooja", Description: "Daily worship service", Donation: "₹250+"},
		{Name: "Anna Daana", Description: "Food offering service", Donation: "₹1000+"},
		{Name: "Paada Pooja", Description: "Worship of holy feet", Donation: "₹300+"},
	}
	database.DB.Create(&sevas)

	// Timings
	timings := []models.Timing{
		{Title: "Nirmalya Visarjane & Ushaha Pooja", Time: "5:00 AM - 6:00 AM", Type: "morning"},
		{Title: "Panchamruta Abhisheka", Time: "7:00 AM - 7:30 AM", Type: "morning"},
		{Title: "Mahapooja (Main Worship)", Time: "8:00 AM - 9:00 AM", Type: "morning"},
		{Title: "Anna Prasadam (Lunch)", Time: "11:30 AM - 1:30 PM", Type: "prasadam"},
		{Title: "Ratri Pooja & Bhootharaja Pooja", Time: "6:00 PM - 7:30 PM", Type: "evening"},
		{Title: "Ratri Prasadam (Dinner)", Time: "7:30 PM - 9:00 PM", Type: "prasadam"},
	}
	database.DB.Create(&timings)

	// Events
	events := []models.Event{
		{Name: "Rathotsava (Car Festival)", Date: "Holi Poornima (March)", Description: "Annual chariot festival celebration"},
		{Name: "Vadiraja Aradhana", Date: "Kartika Month", Description: "Commemoration of Sri Vadiraja entering Vrindavana"},
		{Name: "Daily Bhootharaja Pooja", Date: "Every Evening 7:00 PM", Description: "Special worship of Sri Bhootharaja"},
	}
	database.DB.Create(&events)

	// Rooms
	rooms := []models.Room{
		{Type: "General Room", Price: "₹300 - ₹500", Description: "Basic amenities with attached bathroom. Ideal for small families."},
		{Type: "Semi-Deluxe", Price: "₹600 - ₹800", Description: "Equipped with basic furniture and better ventilation."},
		{Type: "Deluxe Room", Price: "₹1000+", Description: "Modern amenities, spacious, and closer to the main temple complex."},
	}
	database.DB.Create(&rooms)

	// Videos
	// Category 1
	cat1 := models.VideoCategory{Name: "Daily Darshan"}
	database.DB.Create(&cat1)
	database.DB.Create(&models.Video{Title: "SODE UTSAVA | ಸೋದೆ ಉತ್ಸವ 2025", Views: "Live", Thumbnail: "🔴", CategoryID: cat1.ID})
	database.DB.Create(&models.Video{Title: "Sri Bhootharaja Pooja & Dandebali", Views: "2.1K", Thumbnail: "🙏", CategoryID: cat1.ID})

	log.Println("Seeding completed.")
}
