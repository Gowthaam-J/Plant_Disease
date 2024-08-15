#!/usr/bin/env python
# coding: utf-8

# In[3]:
import tensorflow as tf
from fastapi import FastAPI,File,UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import requests
from io import BytesIO



# In[4]:


app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Classes=['Apple___Apple_scab',
 'Apple___Black_rot',
 'Apple___Cedar_apple_rust',
 'Apple___healthy',
 'Blueberry___healthy',
 'Cherry_(including_sour)___Powdery_mildew',
 'Cherry_(including_sour)___healthy',
 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
 'Corn_(maize)___Common_rust_',
 'Corn_(maize)___Northern_Leaf_Blight',
 'Corn_(maize)___healthy',
 'Grape___Black_rot',
 'Grape___Esca_(Black_Measles)',
 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
 'Grape___healthy',
 'Orange___Haunglongbing_(Citrus_greening)',
 'Peach___Bacterial_spot',
 'Peach___healthy',
 'Pepper,_bell___Bacterial_spot',
 'Pepper,_bell___healthy',
 'Potato___Early_blight',
 'Potato___Late_blight',
 'Potato___healthy',
 'Raspberry___healthy',
 'Soybean___healthy',
 'Squash___Powdery_mildew',
 'Strawberry___Leaf_scorch',
 'Strawberry___healthy',
 'Tomato___Bacterial_spot',
 'Tomato___Early_blight',
 'Tomato___Late_blight',
 'Tomato___Leaf_Mold',
 'Tomato___Septoria_leaf_spot',
 'Tomato___Spider_mites Two-spotted_spider_mite',
 'Tomato___Target_Spot',
 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
 'Tomato___Tomato_mosaic_virus',
 'Tomato___healthy']


# In[ ]:

endpoint= "http://localhost:8605/v1/models/plant-model:predict"
def read_file(data):
    image=np.array(Image.open(BytesIO(data)))
    return image
@app.post("/predict")
async def predict(file:UploadFile=File(...)):
    image=read_file(await file.read())
    image_batch=np.expand_dims(image,0)
    json_data={
        "instances":image_batch.tolist()
    }
    response=requests.post(endpoint,json=json_data)
    prediction=np.array(response.json()["predictions"][0])
    predicted_class=np.argmax(prediction)
    confidence=np.max(prediction)
    return{
        "class":Classes[predicted_class],
        "confidence":confidence
    }

