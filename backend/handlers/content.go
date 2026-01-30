package handlers

import (
	"net/http"
	"sode-matha-backend/database"
	"sode-matha-backend/models"

	"github.com/gin-gonic/gin"
)

// --- Public Getters ---

func GetSevas(c *gin.Context) {
	var sevas []models.Seva
	database.DB.Find(&sevas)
	c.JSON(http.StatusOK, sevas)
}

func GetEvents(c *gin.Context) {
	var events []models.Event
	database.DB.Find(&events)
	c.JSON(http.StatusOK, events)
}

func GetTimings(c *gin.Context) {
	var timings []models.Timing
	database.DB.Find(&timings)
	c.JSON(http.StatusOK, timings)
}

func GetVideoCategories(c *gin.Context) {
	var categories []models.VideoCategory
	database.DB.Preload("Videos").Find(&categories)
	c.JSON(http.StatusOK, categories)
}

func GetRooms(c *gin.Context) {
	var rooms []models.Room
	database.DB.Find(&rooms)
	c.JSON(http.StatusOK, rooms)
}

// --- Admin Setters (CRUD) ---

func CreateSeva(c *gin.Context) {
	var seva models.Seva
	if err := c.ShouldBindJSON(&seva); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&seva)
	c.JSON(http.StatusOK, seva)
}

func UpdateSeva(c *gin.Context) {
	id := c.Param("id")
	var seva models.Seva
	if err := database.DB.First(&seva, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seva not found"})
		return
	}
	var input models.Seva
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Model(&seva).Updates(input)
	c.JSON(http.StatusOK, seva)
}

func DeleteSeva(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Seva{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// ... Similar handlers would be needed for Events, Timings, Rooms ...
// For brevity, I will implement a generic handler or just these for now as examples
// The user asked for Admin features, so basic CRUD is essential.

func CreateEvent(c *gin.Context) {
	var event models.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&event)
	c.JSON(http.StatusOK, event)
}

func DeleteEvent(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Event{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
