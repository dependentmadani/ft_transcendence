import  { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPaperPlane, faImage, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

export const RoomCreationModal = ({ onClose }: any) => {

    const [roomName, setRoomName] = useState('')
    const [roomAvatar, setRoomAvatar] = useState<File | null>(null)

    
    // const createNewRoom = async () => {
    //     const formData = new FormData()
    //     formData.append("image", roomAvatar)
    //     console.log('Form data ', formData)
    //     try {
    //       return await axios.post('http://localhost:8000/room', {
    //         roomName: roomName,
    //         roomAvatar: roomAvatar,
    //         roomUsers: [1],
    //         role: 'ADMIN'
    //       })
    //     }
    //     catch (err)
    //     {
    //       console.log(`Couldn't create new Room: `, err)
    //     }
    // }

    // const handleClick = () => {
    //     if (roomName.trim() !== '' && roomAvatar) {
    //         // we create a room
    //         const formData = new FormData()
    //         formData.append("image", roomAvatar)
    //         console.log('Form data ', formData)
    //         console.log('room name: ', roomName, ' | room avatar', formData)
    //         createNewRoom()
    //         setRoomName('')
    //         // setRoomAvatar('')
    //     }
    // }

    // const [selectedImage, setSelectedImage] = useState(null);

    // const handleImageChange = (e: any) => {
    //     const file = e.target.files[0];
    //     setRoomAvatar(file);
    // };

    // // console.log('room name is ', roomName)

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const selectedFile = event.target.files?.[0];
    //     if (selectedFile) {
    //       setRoomAvatar(selectedFile);
    //     }
    // };

    // const handleUpload = async () => {
    //     if (!roomAvatar) return;
      
    //     const formData = new FormData();
    //     // formData.append('roomName', roomName);
    //     formData.append('roomAvatar', roomAvatar);
      
    //     try {
    //       const response = await axios.post('http://localhost:8000/room', formData, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       });
      
    //       console.log('Image uploaded:', response.data.imagePath);
    //     } catch (error) {
    //       console.error('Error uploading image:', error);
    //     }
    // };

    // console.log('room name: ', roomName, ' | room avatar', roomAvatar)

    const [image, setImage] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  

  //////////////////////////////////////

  let fileUploaded: File;

  const [avatar, setAvatar] = useState("");
  const [errorMessageFile, setErrorMessageFile] = useState("")

  const handleChangeAvatar = (file: FileList | null) => {
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
        console.log('everytning went well')
    }
}
const uploadImage = async () => {
        console.log('vvvvvv', fileUploaded)
        //   if (image) {
        //       let formData = new FormData();
        //       formData.append('image', image);
        //       console.log('hhh', formData)

        //   try {
        //     const response = await axios.post('http://localhost:8000/room', formData, {
        //       headers: { 'Content-Type': 'multipart/form-data' },
        //     });

        //     if (response.data.imagePath) {
        //       // Handle successful upload, e.g., display a success message or update your UI.
        //     }
        //   } catch (error) {
        //     // Handle errors, e.g., display an error message.
        //     console.error(error);
        //   }
        // }
        console.log('gggg', fileUploaded)
        axios({
            method: "POST",
            // withCredentials: true,
            url: `http://localhost:8000/room`,
            headers: {'Content-Type':'multipart/form-data'},
            data: {
                roomName: '3a test',
                roomAvatar: fileUploaded,
                roomUsers: 1,
                role: 'ADMIN'
            },
        });
    };

    return (
        <div className="overlay">
        <div className="form-container">
            <h2>Fill the Form wlla sir tl3ab</h2>
            <div>
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleChangeAvatar(e.target.files)}/>
                {/* <div {...getRootProps()} style={dropzoneStyle}>
                    { <input {...getInputProps()} /> }
                    <p>Drag & drop an image here, or click to select one.</p>
                </div> */}
                {(
                    <div>
                    <p>Selected Image:</p>
                    {/* <img src={URL.createObjectURL(image)} alt="Selected" style={imageStyle} /> */}
                    <button onClick={uploadImage}>Upload</button>
                    </div>
                )}
                </div>
        </div>
        <span onClick={onClose}><FontAwesomeIcon icon={faCircleXmark} /></span>
        </div>
    );
};

const dropzoneStyle: React.CSSProperties = {
    border: '2px dashed #ccc',
    padding: '20px',
    textAlign: 'center',
  };
  
  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '200px',
  };
