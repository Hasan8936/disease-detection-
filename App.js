import React, { useState } from 'react';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const handleSubmit = async() => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            setResult({ error: "Failed to get prediction. Make sure the backend is running." });
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div className = "App" >
        <
        header className = "header" >
        <
        h1 > Chest X - Ray Pneumonia Detection < /h1> <
        /header>

        <
        div className = "container" >
        <
        div className = "upload-section" >
        <
        h2 > Upload Chest X - Ray Image < /h2> <
        input type = "file"
        accept = "image/*"
        onChange = { handleFileChange }
        className = "file-input" /
        >
        <
        button onClick = { handleSubmit }
        disabled = {!file || loading }
        className = "predict-button" >
        { loading ? 'Analyzing...' : 'Analyze X-Ray' } <
        /button> <
        /div>

        {
            previewUrl && ( <
                div className = "image-preview" >
                <
                h3 > Image Preview < /h3> <
                img src = { previewUrl }
                alt = "Preview"
                className = "xray-image" /
                >
                <
                /div>
            )
        }

        {
            result && !result.error && ( <
                div className = "results-section" >
                <
                h2 > Analysis Results < /h2>

                <
                div className = "probability-display" >
                <
                div className = "probability-box normal" >
                <
                h3 > Normal Probability < /h3> <
                div className = "probability-value" > {
                    (result.normal_probability * 100).toFixed(2) } %
                <
                /div> <
                /div> <
                div className = "probability-box pneumonia" >
                <
                h3 > Pneumonia Probability < /h3> <
                div className = "probability-value" > {
                    (result.pneumonia_probability * 100).toFixed(2) } %
                <
                /div> <
                /div> <
                /div>

                <
                div className = "diagnosis" >
                <
                h3 > Diagnosis: < span className = { result.diagnosis === 'NORMAL' ? 'normal-text' : 'pneumonia-text' } > { result.diagnosis } <
                /span></h
                3 >
                <
                p > < strong > Status: < /strong> {result.status}</p >
                <
                /div>

                <
                div className = "clinical-report" >
                <
                h3 > Clinical Recommendations < /h3> <
                p > { result.recommendation } < /p> <
                /div> <
                /div>
            )
        }

        {
            result && result.error && ( <
                div className = "error-section" >
                <
                h3 > Error < /h3> <
                p className = "error-message" > { result.error } < /p> <
                /div>
            )
        } <
        /div>

        <
        footer className = "footer" >
        <
        p > Note: This AI tool assists healthcare professionals and should not replace clinical judgment. < /p> <
        p > Always consult a qualified radiologist
        for final diagnosis. < /p> <
        /footer> <
        /div>
    );
}

export default App;