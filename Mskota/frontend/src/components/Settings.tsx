import React from 'react';
import axios from "axios"
import { useEffect, useState, useRef } from 'react'
import '../css/Settings.css';

// import './SettingsV2.css';

const SettingsComponent: React.FC = () => {

    const [avatar, setAvatar] = useState<string>('user-avatar.png');   // change it to user.avatar

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = () => {
        // Create an invisible file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
      
        // Listen for file selection
        fileInput.addEventListener('change', (e) => {
          const selectedFile = e.target.files[0];
      
          if (selectedFile) {
            // Read the selected file and update the avatar state
            const reader = new FileReader();
            reader.onload = (e) => {
              setAvatar(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
          }
        });
      
        // Trigger the file input to open the file selection dialog
        fileInput.click();
      };
      


    return (
    <div className="settings-card">
        <div className="image-section">
        <div className="image-frame">
            <img className="user-img" src={avatar} alt="User Image" />
            <div className="change-image-container" onClick={handleImageChange}>
            <img src="../imgs/change_img.png" alt="Image Icon" />
            </div>
        </div>
        <div className="username-frame">
            <input type="text" id="new-username" placeholder="New username (optional)" />
        </div>
        </div>
        <div className="two-fact-section">
        <div className="container">
            <input type="checkbox" id="check" />
            <label htmlFor="check" className="switch"></label>
            <span>2FA</span>
        </div>
        <div className="container-mail">
            <input type="text" id="mail-for-qr" placeholder="Enter mail for QR code" />
        </div>
        <div className="container-qrcode">
            <div className="sms-input">
            <input type="text" id="sms-code" placeholder="Enter code" />
            </div>
            <div className="qr-space"></div>
        </div>
        <button className="submit-data">
            <p className="submit">Submit</p>
        </button>
        </div>
    </div>
    );
}

export default SettingsComponent;
