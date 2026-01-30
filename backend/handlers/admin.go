package handlers

import (
	"net/http"
	"sode-matha-backend/database"
	"sode-matha-backend/models"

	"github.com/gin-gonic/gin"
)

func GetAdminLogs(c *gin.Context) {
	var logs []models.AdminLog
	database.DB.Order("timestamp desc").Limit(50).Find(&logs)
	c.JSON(http.StatusOK, logs)
}
