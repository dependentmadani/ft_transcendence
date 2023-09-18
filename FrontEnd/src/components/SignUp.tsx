import { useEffect, useState } from 'react'
import '/src/css/SignUp.css';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SetInfo() {
    
    let fileUploaded: File;
    const navigate = useNavigate();
    const [userId, setUserId] = useState();
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("src/imgs/user-img.png");
    const [disable, setDisable] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageFile, setErrorMessageFile] = useState("")

    useEffect(() => {
        fetch(`http://${import.meta.env.VITE_ADDRESS}:8000/auth/me`, {
            method: 'GET',
            credentials: 'include'
          })
           .then((res) => res.json())
           .then((data) => {
                setUserId(data['id']);
                setAvatar(data['avatar']);
           })
     }, []);

    function handleChangeAvatar(file: FileList | null) {
        if (file) {
            // if (file[0].size > 20000) {
            //     setErrorMessageFile("Image size is limited to 20 kb!")
            //     return ;
            // }
            fileUploaded = file[0];
            setErrorMessageFile("");
            const fileRef= file[0] || ""
            const fileType = fileRef.type
            const reader = new FileReader()
            reader.readAsBinaryString(fileRef)
            reader.onload=(ev: any) => {
                setAvatar(`data:${fileType};base64,${btoa(ev.target.result)}`)
            }
            // axios({
            //     method: "POST",
            //     withCredentials: true,
            //     url: `http://${import.meta.env.VITE_ADDRESS}:8000/users/${userId}/infos`,
            //     headers: {'Content-Type':'multipart/form-data'},
            //     data: {
            //         avatar: fileUploaded,
            //         username: username,
            //     },
            // });
        }
    }
    // console.log(avatar)

    function handleChangeUsername(event: any) {

        fetch(`http://${import.meta.env.VITE_ADDRESS}:8000/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type':'application/json' },
            credentials: 'include',
            body: JSON.stringify( { username: event.target.value } ) 
            })
           .then((res) => {
                if (!res.ok) {
                    if (event.target.value && event.target.value.length > 0) {
                        setErrorMessage("username already taken");
                    }
                    setDisable(true)
                }
                else {
                    setDisable(false)
                    setErrorMessage("");
                }
            })
        setUsername(event.target.value)
    }

    function handleSubmit() {
        
        //need to add axios to update the avatar here.
        // axios.get(`http://${import.meta.env.VITE_ADDRESS}:5173/`);
        navigate('/');
    }

    return (
        <div className='main-signup'>
            <h1 id='signup-header'><span >Please </span> Enter Your <br /> Information</h1>
            <form className='signup-form' onSubmit={handleSubmit}>
                <div className='updateAvatar'>
                    <img src={avatar} className='img-avatar'/>
                    <input id='file' type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleChangeAvatar(e.target.files)}/>
                    <label htmlFor="file" className='choose-img'>
                        <img src="src/imgs/change-img.png" alt="Upload" />
                    </label>
                </div>
                <input type="text" name="username" id="name" value={username} onChange={handleChangeUsername}  required />
                <input id='submit-button' type="submit" value="Next ➝" onChange={handleSubmit} />
            </form>
        </div>
    )
}


export default SetInfo;