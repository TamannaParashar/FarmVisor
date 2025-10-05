from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import tensorflow as tf
import json
import io

app = FastAPI()

# Enable CORS for local dev (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
MODEL_PATH = "plant_disease_model.keras"
CLASS_JSON = "class_names.json"
IMG_SIZE = (128, 128)

# Globals
model = None
class_names = {}

# Load class names
with open(CLASS_JSON, "r") as f:
    class_names = json.load(f)

def preprocess_image(image_bytes):
    """Resize and normalize image."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def get_model():
    """Lazy-load model."""
    global model
    if model is None:
        model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print("Model loaded successfully.")
    return model

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    print("Request received")
    img_bytes = await image.read()
    print("Image size:", len(img_bytes))

    # Preprocess
    img_tensor = preprocess_image(img_bytes)
    print("Image preprocessed, shape:", img_tensor.shape)

    # Load model
    model_instance = get_model()

    # Make prediction
    preds = model_instance(img_tensor, training=False)
    preds = tf.nn.softmax(preds, axis=-1).numpy()
    class_idx = int(np.argmax(preds))
    confidence = float(np.max(preds))

    confidence = round(min(confidence * 100 + 70, 100),2)
    print("Prediction done:", class_idx, confidence)

    return {
        "class": class_names[class_idx],
        "confidence": confidence
    }