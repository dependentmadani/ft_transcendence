import React from 'react';
import axios from "axios"
import { useEffect, useState, useRef } from 'react'
import './Settings.css';
import { useClient } from '@/context/clientContext';

// import './SettingsV2.css';

const SettingsComponent: React.FC = () => {

	const {client, updateClient} = useClient();
    
    const [avatar, setAvatar] = useState<string>(client.avatar);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);    // change it to its initial value;
    const [email, setEmail] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [username, setUsername] = useState<string>('');
    const [fileUpload, setFileUpload] = useState();

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
            const reader = new FileReader();
            reader.onload = (e) => {
              setAvatar(e.target.result);
            };
            setFileUpload(selectedFile);
            reader.readAsDataURL(selectedFile);
          }
        });
      
        // Trigger the file input to open the file selection dialog
        fileInput.click();
      };

    const changeUsername = (name: string) => {
        setUsername(name);
        console.log(`Username: ${username}`)
        console.log(`daba twoFactorEnabled: ${twoFactorEnabled}`)
    };
    
    const handleEmailSubmit = async () => {
        try {
            console.log(`mail: ${email}|`)
            const response = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/2fa/setup`,
            { email },
            {withCredentials: true}
            );
            // Parse the response to get the QR code
            const qrCodeUrl = response.data;
            setQrCode(qrCodeUrl);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleSmsCodeSubmit = async () => {
        try {
                console.log(`smscode: ${smsCode}|`);
                const response = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/2fa/verify`,
                { code: smsCode },
                { withCredentials: true }
                );
                console.log('response data', response.data);
        } catch (error) {
            console.log("incorrect QrCode");
            console.error('Error fetching data: ', error);
        }


      };

    const informTwoFactorState = async () => {
        try {
            setTwoFactorEnabled(!twoFactorEnabled);
            if (!twoFactorEnabled)
            {
                await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/2fa/disable`,
                { withCredentials: true },
                );
            }
        } catch (error) {
            console.log("incorrect QrCode");
            console.error('Error fetching data: ', error);
        }
    }

    const handleSubmit = async () => {
        try {
            if (username) {

                await axios.patch(
                    `http://${import.meta.env.VITE_BACK_ADDRESS}/users/${client.id}`,
                    {
                        username: username,
                    },
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' },
                    }  
                );
            }
            if (avatar != client.avatar) {
                const gg = await axios.post(
                `http://${import.meta.env.VITE_BACK_ADDRESS}/users/${client.id}/infos`,
                {
                    avatar: fileUpload,
                },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
                );
                console.log('dataupdate : ' , gg.data)
            }
            // if (twoFactorEnabled)
            // {
            //     await axios.patch(
            //         `http://${import.meta.env.VITE_BACK_ADDRESS}/users/${userId}`,
            //         {
            //             twofa: twoFactorEnabled,
            //         },
            //         {
            //             withCredentials: true,
            //             headers: { 'Content-Type': 'application/json' },
            //         }  
            //     );
            // }
        } catch (error) {
          console.error('Error submitting data:', error);
        }
        try {
            const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`, { withCredentials: true });
            await updateClient({ ...client, ...response.data, signedIn: true });
            console.log('data of client : ', response.data);
        }catch{
            
        }
        // setFetchData(true);
      };
      

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && twoFactorEnabled) {
          // console.log('hlwa')
            handleEmailSubmit();
            console.log(`QrCode: ${qrCode}`);
        }
    };

    const handleKeyDown2 = (event) => {
        if (event.key === 'Enter' && twoFactorEnabled) {
            handleSmsCodeSubmit();
            console.log(`QrCode: ${qrCode}`);
        }
    };


    return (
    <div className="settings-card">
        <div className="image-section">
            <div className="image-frame">
                <img src={avatar} alt="User Image" />
                <div className="change-image-container" onClick={handleImageChange}>
                    <img src="/src/imgs/change_img1.png" alt="Image Icon" />
                </div>
            </div>
            <div className="username-frame">
                <input type="text"
                    id="new-username" placeholder="New username (optional)" autoComplete='off'
                    value={username}
                    onChange={(e) => changeUsername(e.target.value)}
                     />
            </div>
        </div>
        <div className="two-fact-section">
            <div className="two-fa-switch">
                <input type="checkbox" id="check"  autoComplete='off'
                    onChange={ informTwoFactorState }
                />
                <label htmlFor="check" className="switch"></label>
                <span>2FA</span>
            </div>
        <div className="container-mail">
            <input type="text" id="mail-for-qr" placeholder="Enter mail for QR code"  autoComplete='off'
                     value={email} onKeyDown={handleKeyDown} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="container-qrcode">
            <div className="sms-input">
                <input type="text" id="sms-code" placeholder="Enter code"  autoComplete='off'
                    value={smsCode} onKeyDown={handleKeyDown2} onChange={ (e) => setSmsCode(e.target.value) } 
                />
            </div>
            <div className="qr-space">
                {twoFactorEnabled && (<img src={qrCode} alt="QR Code" />)}
            </div>
        </div>
            <button className="submit-data" onClick={handleSubmit}>
                <p className="submit">Submit</p>
            </button>
        </div>
    </div>
    );
}

export default SettingsComponent;