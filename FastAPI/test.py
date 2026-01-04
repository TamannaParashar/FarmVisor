import tensorflow as tf

MODEL_PATH = "plant_disease_model.keras"

# Load the model without compiling
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

# Print the Keras version used in your current TF
print("Current Keras version in this TF:", tf.keras.__version__)
