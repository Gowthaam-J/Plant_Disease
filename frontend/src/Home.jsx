import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie'
import Ani1 from './Animation.json';
import Button from '@mui/material/Button';

export const Home1 = () => {
    const REACT_APP_API_URL = "http://localhost:8000/predict";
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [progress, setProgress] = useState({ started: false, pc: 0 });
    const [msg, setMsg] = useState(null);
    const [prediction, setPrediction] = useState({ className: '', confidence: '' });

    function handleUpload() {
        if (!file) {
            console.log("No File Selected");
            setMsg("No File Selected");
            return;
        }
        const fd = new FormData();
        fd.append('file', file);

        setMsg("Uploading...");
        setProgress(prevState => ({ ...prevState, started: true }));

        axios.post(REACT_APP_API_URL, fd, {
            onUploadProgress: (ProgressEvent) => {
                setProgress(prevState => ({
                    ...prevState,
                    pc: (ProgressEvent.loaded / ProgressEvent.total) * 100
                }));
            },
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then(res => {
            setMsg("Upload Successful ✅");
            setPrediction({ className: res.data.class, confidence: res.data.confidence });
            console.log(res.data);
        })
        .catch(err => {
            setMsg("Upload failed");
            console.error("Error:", err.response ? err.response.data : err.message);
            console.error("Full error object:", err);
        });
    }

    // Function to handle file selection and image preview
    function handleFileSelect(e) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Generate preview of the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    }
    const defaultOptions ={
        loop:true,
        autoplay:true,
        animationData : Ani1,
    };
    return (
        <div style={{lineHeight:'300%'}}>
            <h1 style={{color:'green'}}> Plant Disease Prediction
            <Lottie  options={defaultOptions} width={150} height={150} />
            </h1>
            <div style={{marginLeft:'80px'}}>
            <input style={{fontFamily:'cursive',fontSize:'25px'}}
                onChange={handleFileSelect}
                type='file'
            />
            </div>
            <Button variant="contained" href="#contained-buttons" onClick={handleUpload}>Upload
      </Button>
            {imagePreview && (
                <div>
                    <h2>Selected Image Preview:</h2>
                    <img src={imagePreview} alt="Selected" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                </div>
            )}
            <div style={{color:'white',fontSize:'Large'}}>
            {progress.started && <progress max="100" value={progress.pc}></progress>}
            {msg && <b>{msg}</b>}
            {prediction.className && (
                <div>
                    <h2>Prediction Result:</h2>
                    <h4>Class Name: {prediction.className}</h4>
                    <h4>Confidence: {prediction.confidence}</h4>
                </div>
            )}
            </div>
        </div>
    );
};
