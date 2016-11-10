package utility

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"errors"
)

var iv = []byte{35, 46, 57, 24, 85, 35, 24, 74, 87, 35, 88, 98, 66, 32, 14, 05}

func encodeBase64(b []byte) string {
	return base64.StdEncoding.EncodeToString(b)
}

func decodeBase64(s string) ([]byte, error) {
	data, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return []byte{}, errors.New("Error")
	}
	return data, nil
}

func Encrypt(key, text string) (string, error) {
	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return "", errors.New("Error")
	}
	plaintext := []byte(text)
	cfb := cipher.NewCFBEncrypter(block, iv)
	ciphertext := make([]byte, len(plaintext))
	cfb.XORKeyStream(ciphertext, plaintext)
	return encodeBase64(ciphertext), nil
}

func Decrypt(key, text string) (string, error) {
	block, errAes := aes.NewCipher([]byte(key))
	if errAes != nil {
		return "", errors.New("Error")
	}
	ciphertext, errDecode := decodeBase64(text)
	if errDecode != nil {
		return "", errors.New("Error")
	}
	cfb := cipher.NewCFBEncrypter(block, iv)
	plaintext := make([]byte, len(ciphertext))
	cfb.XORKeyStream(plaintext, ciphertext)
	return string(plaintext), nil
}
