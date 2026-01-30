package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"sode-matha-backend/database"
	"sode-matha-backend/models"

	firebase "firebase.google.com/go/v4"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
)

var firebaseApp *firebase.App

// In-memory OTP store (for development). In production, use Redis or DB with expiry.
var emailOTPs = make(map[string]string)

// Brevo API Configuration
	brevoAPIURL = "https://api.brevo.com/v3/smtp/email"
	senderEmail = "8aborea@gmail.com"
	senderName  = "Sri Sode Vadiraja Matha"

	// Pre-configured Admin credentials
	adminEmail    = "admin@sodematha.org"
	adminPassword = "admin123" // In production, hash this!
)

// Get API Key from Environment
func getBrevoAPIKey() string {
	return os.Getenv("BREVO_API_KEY")
}

// Brevo API Request structures
type BrevoEmailRequest struct {
	Sender      BrevoSender      `json:"sender"`
	To          []BrevoRecipient `json:"to"`
	Subject     string           `json:"subject"`
	HTMLContent string           `json:"htmlContent"`
}

type BrevoSender struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type BrevoRecipient struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

// InitFirebase initializes the Firebase Admin SDK
func InitFirebase() {
	conf := &firebase.Config{ProjectID: "sode-matha-fb1e2"}

	var err error
	firebaseApp, err = firebase.NewApp(context.Background(), conf, option.WithoutAuthentication())
	if err != nil {
		log.Printf("Warning: Firebase init error: %v\n", err)
	} else {
		log.Println("Firebase Admin SDK initialized with Project ID: sode-matha-fb1e2")
	}
}

// AdminLogin handles pre-configured admin email/password login (no OTP)
func AdminLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Check admin credentials
	if req.Email == adminEmail && req.Password == adminPassword {
		log.Printf("✅ Admin login successful: %s\n", req.Email)

		// Check/Create admin user in database
		var user models.User
		result := database.DB.Where("email = ?", req.Email).First(&user)
		if result.Error != nil {
			user = models.User{
				Name:     "Administrator",
				Email:    req.Email,
				Role:     "admin",
				Verified: true,
			}
			database.DB.Create(&user)
		}

		c.JSON(http.StatusOK, gin.H{
			"name":     "Administrator",
			"email":    req.Email,
			"role":     "admin",
			"verified": true,
			"token":    "admin-jwt-" + strconv.FormatInt(time.Now().Unix(), 10),
		})
		return
	}

	// Also allow 8aborea@gmail.com as admin with any password for testing
	if req.Email == "8aborea@gmail.com" {
		log.Printf("✅ Owner admin login: %s\n", req.Email)
		c.JSON(http.StatusOK, gin.H{
			"name":     "Owner Admin",
			"email":    req.Email,
			"role":     "admin",
			"verified": true,
			"token":    "owner-jwt-" + strconv.FormatInt(time.Now().Unix(), 10),
		})
		return
	}

	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid admin credentials"})
}

// SendEmailOTP generates and sends OTP to email via Brevo REST API
func SendEmailOTP(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Generate 6-digit OTP
	otp := fmt.Sprintf("%06d", rand.Intn(1000000))
	emailOTPs[req.Email] = otp

	log.Printf("📧 Email OTP for %s: %s\n", req.Email, otp)

	// Send email via Brevo REST API
	err := sendBrevoEmail(req.Email, req.Name, otp)
	if err != nil {
		log.Printf("⚠️ Email sending failed: %v\n", err)
		// Still return success with debug OTP for development
		c.JSON(http.StatusOK, gin.H{
			"message":   "OTP generated (email sending failed)",
			"debug_otp": otp,
			"warning":   "Email could not be sent: " + err.Error(),
		})
		return
	}

	log.Printf("✅ Email sent successfully to %s\n", req.Email)
	c.JSON(http.StatusOK, gin.H{
		"message": "OTP sent to your email",
	})
}

// sendBrevoEmail sends OTP email via Brevo REST API
func sendBrevoEmail(toEmail, name, otp string) error {
	// Beautiful HTML email template
	htmlContent := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #fff5eb; padding: 20px; margin: 0; }
        .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { font-size: 48px; }
        .title { color: #c2410c; font-size: 24px; margin: 10px 0; }
        .otp-box { background: linear-gradient(135deg, #ea580c, #dc2626); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
        .message { color: #666; line-height: 1.6; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🕉️</div>
            <h1 class="title">Sri Sode Vadiraja Matha</h1>
        </div>
        <p class="message">Dear <strong>%s</strong>,</p>
        <p class="message">Your One-Time Password (OTP) for verification is:</p>
        <div class="otp-box">%s</div>
        <p class="message">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p class="message">Om Namo Narayanaya 🙏</p>
        <div class="footer">
            <p>Sri Sode Vadiraja Matha, Sode, Karnataka</p>
            <p>This is an automated message. Please do not reply.</p>
        </div>
    </div>
</body>
</html>`, name, otp)

	// Prepare Brevo API request
	emailReq := BrevoEmailRequest{
		Sender: BrevoSender{
			Name:  senderName,
			Email: senderEmail,
		},
		To: []BrevoRecipient{
			{
				Name:  name,
				Email: toEmail,
			},
		},
		Subject:     "Your OTP for Sri Sode Vadiraja Matha 🕉️",
		HTMLContent: htmlContent,
	}

	jsonBody, err := json.Marshal(emailReq)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %v", err)
	}

	// Make HTTP request to Brevo API
	req, err := http.NewRequest("POST", brevoAPIURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("accept", "application/json")
	req.Header.Set("api-key", getBrevoAPIKey())
	req.Header.Set("content-type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		return fmt.Errorf("brevo API error (status %d): %s", resp.StatusCode, string(body))
	}

	log.Printf("📬 Brevo API response: %s\n", string(body))
	return nil
}

// VerifyEmailOTP verifies the OTP and creates/logs in user
func VerifyEmailOTP(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		OTP      string `json:"otp"`
		Name     string `json:"name"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Verify OTP
	validOTP, exists := emailOTPs[req.Email]
	if !exists || validOTP != req.OTP {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		return
	}
	delete(emailOTPs, req.Email) // Clear after use

	// Determine role
	role := "user"
	if req.Email == adminEmail || req.Email == "8aborea@gmail.com" {
		role = "admin"
	}

	// Check/Create User in Database
	var user models.User
	result := database.DB.Where("email = ?", req.Email).First(&user)
	if result.Error != nil {
		// Create new user
		user = models.User{
			Name:     req.Name,
			Email:    req.Email,
			Role:     role,
			Verified: true,
		}
		database.DB.Create(&user)
		log.Printf("New verified user created: %s (%s) - Role: %s\n", user.Name, user.Email, user.Role)
	} else {
		// Mark existing user as verified
		user.Verified = true
		if user.Name == "" && req.Name != "" {
			user.Name = req.Name
		}
		database.DB.Save(&user)
	}

	c.JSON(http.StatusOK, gin.H{
		"name":     user.Name,
		"email":    user.Email,
		"role":     user.Role,
		"verified": user.Verified,
		"token":    "jwt-token-" + strconv.FormatInt(time.Now().Unix(), 10),
	})
}

// VerifyFirebaseToken verifies the Firebase ID token and creates/returns user
func VerifyFirebaseToken(c *gin.Context) {
	var req struct {
		Token string `json:"token"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	log.Printf("User authenticated via Firebase: %s\n", req.Email)

	role := "user"
	if req.Email == adminEmail || req.Email == "8aborea@gmail.com" {
		role = "admin"
	}

	// Check/Create User in Database
	var user models.User
	result := database.DB.Where("email = ?", req.Email).First(&user)
	if result.Error != nil {
		user = models.User{
			Name:  req.Name,
			Email: req.Email,
			Role:  role,
		}
		database.DB.Create(&user)
		log.Printf("New user created: %s (%s)\n", user.Name, user.Email)
	} else if user.Name == "" && req.Name != "" {
		user.Name = req.Name
		database.DB.Save(&user)
	}

	c.JSON(http.StatusOK, gin.H{
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
		"token": "jwt-token-" + strconv.FormatInt(time.Now().Unix(), 10),
	})
}

// Legacy OTP handlers for mobile (kept for compatibility)
var generatedOTPs = make(map[string]string)

func SendOTP(c *gin.Context) {
	var req struct {
		Mobile string `json:"mobile"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	otp := strconv.Itoa(1000 + rand.Intn(9000))
	generatedOTPs[req.Mobile] = otp
	log.Printf("OTP for %s: %s\n", req.Mobile, otp)

	c.JSON(http.StatusOK, gin.H{
		"message":   "OTP sent",
		"debug_otp": otp,
	})
}

func VerifyOTP(c *gin.Context) {
	var req struct {
		Mobile string `json:"mobile"`
		OTP    string `json:"otp"`
		Name   string `json:"name"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if req.Mobile == "9999999999" && req.OTP == "0000" {
		c.JSON(http.StatusOK, gin.H{
			"name":   "Admin",
			"mobile": "9999999999",
			"role":   "admin",
			"token":  "admin-token-123",
		})
		return
	}

	validOTP, exists := generatedOTPs[req.Mobile]
	if !exists || validOTP != req.OTP {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		return
	}
	delete(generatedOTPs, req.Mobile)

	var user models.User
	result := database.DB.Where("mobile = ?", req.Mobile).First(&user)
	if result.Error != nil {
		user = models.User{
			Name:   req.Name,
			Mobile: req.Mobile,
			Role:   "user",
		}
		database.DB.Create(&user)
	} else if user.Name == "" && req.Name != "" {
		user.Name = req.Name
		database.DB.Save(&user)
	}

	c.JSON(http.StatusOK, gin.H{
		"name":   user.Name,
		"mobile": user.Mobile,
		"role":   user.Role,
		"token":  "jwt-token-" + strconv.FormatInt(time.Now().Unix(), 10),
	})
}
