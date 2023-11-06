import React from 'react';
import axios from "axios"
import { useEffect, useState, useRef } from 'react'
import './Settings.css';
import { useClient } from '@/context/clientContext';
import { ToastContainer, toast } from 'react-toastify';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { useSetting } from '@/context/SettingContext';


const SettingsComponent: React.FC = () => {

	const {client, updateClient} = useClient();
    
    const [avatar, setAvatar] = useState<string>(client.avatar);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(client.twoEnabled);   
    const [email, setEmail] = useState(client.twofaEmail);
    const [qrCode, setQrCode] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [username, setUsername] = useState<string>(client.username);
    const [fileUpload, setFileUpload] = useState();
    const [popSettings, setPopSettings] = useSetting();

    const fileInputRef = useRef<HTMLInputElement | null>(null);

        
    const handleImageChange = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
      
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

        fileInput.click();
      };

    const changeUsername = (name: string) => {
        setUsername(name);
        //console.log(`Username: ${username}`)
        //console.log(`daba twoFactorEnabled: ${twoFactorEnabled}`)
    };
    
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const handleEmailSubmit = () => {
      toast.promise(
        (async () => {
          try {
            //console.log(`mail: ${email}|`);
            const response = await axios.post(
              `http://${import.meta.env.VITE_BACK_ADDRESS}/auth/2fa/setup`,
              { email },
              { withCredentials: true }
            );
            const qrCodeUrl = response.data;
            await delay(1000); 
            setQrCode(qrCodeUrl);
          } catch (error) {
            await delay(1000);
          }
        })(),
        {
          pending: "Generating QR Code...",
          success: {
            render: "QR Code generated successfully!",
            icon: <img src='/src/imgs/qr-code.gif' width='25px' alt='qr-code' />,
            },
          error: {
            render: 'Gmail address Error',
          },
        }
      );
    };
    
      

    const handleSmsCodeSubmit = async () => {
        toast.promise(
            (async () => {
              try {
                //console.log(`mail: ${email}|`);
                const response = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/2fa/verify`,
                { code: smsCode },
                { withCredentials: true }
                );
                await delay(1000);
                if (response.data) 
                    return "Enabled 2FA successfully!";
                throw 'incorrect QrCode';
              } catch (error) {
                await delay(1000);
                throw 'incorrect QrCode';
              }
            })(),
            {
              pending: "Check Code...",
              success: {
                render: ({ data }) => `${data}`,
                icon: <img src='/src/imgs/password.gif' width='25px' alt='password' />,
                },
              error: {
                render:({ data }) => `${data}`,
              },
            }
          );

      };


    useEffect (() => {

        const informTwoFactorState = async () => {
            try {
              //console.log( `twoFactorEnabled : [${twoFactorEnabled}], smsCode : [${smsCode}]`)
                if (!twoFactorEnabled && smsCode)
                {
                    await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/2fa/disable`,
                    { withCredentials: true },
                    );
                    toast.info("Disabled 2FA !", {
                      position: toast.POSITION.TOP_RIGHT
                    });
                }
            } catch (error) {
              //console.log('error in disbale of 2fa : ',error);
            }
        }

        informTwoFactorState();
    }, [twoFactorEnabled])


    const handleSubmit = async () => {

      if (!username) {
        toast.warn('Please enter a username');
        return;
      }
      toast.promise(
          (async () => {
            try {
              if (username) {

                  await axios.patch(
                      `http://${import.meta.env.VITE_BACK_ADDRESS}/users/${client.id}`,
                      {username: username,},
                      {
                          withCredentials: true,
                          headers: { 'Content-Type': 'application/json' },
                      }  
                  );
              }
              if (avatar != client.avatar) {
                  const gg = await axios.post(
                  `http://${import.meta.env.VITE_BACK_ADDRESS}/users/${client.id}/infos`,
                  {avatar: fileUpload,},
                  {
                      withCredentials: true,
                      headers: { 'Content-Type': 'multipart/form-data' },
                  }
                  );
              }

              await delay(1000);
              const response = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`, { withCredentials: true });
              await updateClient({ ...client, ...response.data, signedIn: true });
              //console.log(client)
              setPopSettings(false);
            } catch (error) {
              await delay(1000);
              throw 'Error Update';
            }
          })(),
          {
            pending: "Updating Profile...",
            success: {
              render: "Update Profile successfully!",
              icon: <img src='/src/imgs/life-cycle.gif' width='25px' alt='profile' />,
              },
            error: {
              render: ({ data }) => `${data}`,
            },
          }
    );

  };
      

  const handleKeyDown = (event) => {
        if (event.key === 'Enter' && twoFactorEnabled) {
            handleEmailSubmit();
            //console.log(`QrCode: ${qrCode}`);
        }
  };
    

  const handleKeyDown2 = (event) => {
      if (event.key === 'Enter' && twoFactorEnabled) {
          handleSmsCodeSubmit();
          //console.log(`QrCode: ${qrCode}`);
      }
  };

  //console.log('client.twoEnabled : ', client.twoEnabled)

    return (
    <div className="settings-card">
        <div className="image-section">
            <div className="image-frame">
                <img src={avatar} alt="User Image" onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} />
                <div className="change-image-container" onClick={handleImageChange}>
                    <img src="/src/imgs/change-img.png" alt="Image Icon" />
                </div>
            </div>
            <div className="username-frame">
                <input type="text"
                    id="new-username" placeholder="New username " autoComplete='off'
                    value={username}
                    onChange={(e) => changeUsername(e.target.value)}
                     />
            </div>
        </div>
        <div className="two-fact-section">
            <div className="two-fa-switch">
                <input type="checkbox" id="check"  autoComplete='off'
                    checked={twoFactorEnabled}
                    onChange={() => setTwoFactorEnabled(!twoFactorEnabled) }
                />
                <label htmlFor="check" className="switch"></label>
                <span>2FA</span>
            </div>
        <div className="container-mail">
            <input type="text" id="mail-for-qr" placeholder="Enter mail for QR code"  autoComplete='off'
                     value={email} onKeyDown={handleKeyDown} onChange={(e) => setEmail(e.target.value)}
                     disabled={twoFactorEnabled ? twoFactorEnabled : !twoFactorEnabled} />
        </div>
        <div className="container-qrcode">
            <div className="sms-input">
                <input type="text" id="sms-code" placeholder="Enter code"  autoComplete='off'
                    value={smsCode} onKeyDown={handleKeyDown2} onChange={ (e) => setSmsCode(e.target.value)}
                      disabled={twoFactorEnabled ? twoFactorEnabled : !twoFactorEnabled} 
                />
            </div>
            <div className="qr-space">
                {twoFactorEnabled && qrCode && (<img src={qrCode} alt="QR Code" />)}
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