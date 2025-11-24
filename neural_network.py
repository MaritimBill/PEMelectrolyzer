import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import StandardScaler
import joblib
import logging
from datetime import datetime

class NeuralNetworkPredictor:
    def __init__(self):
        self.model = None
        self.scaler_x = StandardScaler()
        self.scaler_y = StandardScaler()
        self.is_trained = False
        self.logger = logging.getLogger(__name__)

    def build_model(self, input_dim):
        """Build LSTM neural network model for time series prediction"""
        model = keras.Sequential([
            keras.layers.LSTM(64, return_sequences=True, input_shape=(None, input_dim)),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(32, return_sequences=False),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dense(3, activation='linear')  # Output: production, efficiency, safety
        ])
        
        model.compile(
            optimizer='adam',
            loss='mse',
            metrics=['mae']
        )
        
        return model

    def prepare_data(self, historical_data):
        """Prepare training data from historical system data"""
        X, y = [], []
        
        sequence_length = 24  # 24-hour sequences
        
        for i in range(len(historical_data) - sequence_length):
            # Input features
            sequence = historical_data[i:i + sequence_length]
            X.append(sequence[:, :-3])  # All columns except last 3 (targets)
            
            # Targets (next time step)
            y.append(historical_data[i + sequence_length, -3:])
        
        return np.array(X), np.array(y)

    def train(self, historical_data):
        """Train the neural network model"""
        try:
            X, y = self.prepare_data(historical_data)
            
            # Scale the data
            X_scaled = self.scaler_x.fit_transform(X.reshape(-1, X.shape[-1])).reshape(X.shape)
            y_scaled = self.scaler_y.fit_transform(y)
            
            # Build and train model
            self.model = self.build_model(X.shape[-1])
            
            history = self.model.fit(
                X_scaled, y_scaled,
                epochs=100,
                batch_size=32,
                validation_split=0.2,
                verbose=1
            )
            
            self.is_trained = True
            self.logger.info("Neural network training completed")
            
            return history
            
        except Exception as e:
            self.logger.error(f"Training failed: {e}")
            raise

    def predict(self, input_sequence):
        """Make predictions using the trained model"""
        if not self.is_trained:
            raise RuntimeError("Model not trained")
        
        # Scale input
        input_scaled = self.scaler_x.transform(input_sequence)
        input_scaled = input_scaled.reshape(1, input_scaled.shape[0], input_scaled.shape[1])
        
        # Make prediction
        prediction_scaled = self.model.predict(input_scaled)
        
        # Inverse transform
        prediction = self.scaler_y.inverse_transform(prediction_scaled)
        
        return {
            'production': prediction[0, 0],
            'efficiency': prediction[0, 1],
            'safety_margin': prediction[0, 2]
        }

    def generate_synthetic_data(self, num_samples=1000):
        """Generate synthetic training data for demonstration"""
        np.random.seed(42)
        
        data = []
        for i in range(num_samples):
            # Features: hour, pv_power, electricity_price, oxygen_demand, temperature, pressure
            hour = i % 24
            pv_power = max(0, 100 * np.sin((hour - 6) * np.pi / 13) + np.random.normal(0, 10))
            electricity_price = 0.15 + 0.1 * np.sin(hour * np.pi / 12) + np.random.normal(0, 0.02)
            oxygen_demand = 40 + 20 * np.sin((hour - 8) * np.pi / 12) + np.random.normal(0, 5)
            temperature = 65 + 10 * np.sin(hour * np.pi / 12) + np.random.normal(0, 2)
            pressure = 50 + 10 * np.random.random()
            
            # Targets: production, efficiency, safety_margin (simulated relationships)
            production = 70 + 0.3 * pv_power + 0.2 * oxygen_demand + np.random.normal(0, 3)
            efficiency = 75 - 0.1 * (temperature - 65) + np.random.normal(0, 1)
            safety_margin = 25 - 0.2 * (pressure - 50) + np.random.normal(0, 2)
            
            row = [hour, pv_power, electricity_price, oxygen_demand, temperature, pressure,
                  production, efficiency, safety_margin]
            data.append(row)
        
        return np.array(data)

    def save_model(self, filepath):
        """Save trained model and scalers"""
        if self.is_trained:
            self.model.save(f"{filepath}_model.h5")
            joblib.dump(self.scaler_x, f"{filepath}_scaler_x.pkl")
            joblib.dump(self.scaler_y, f"{filepath}_scaler_y.pkl")
            self.logger.info(f"Model saved to {filepath}")

    def load_model(self, filepath):
        """Load pre-trained model and scalers"""
        try:
            self.model = keras.models.load_model(f"{filepath}_model.h5")
            self.scaler_x = joblib.load(f"{filepath}_scaler_x.pkl")
            self.scaler_y = joblib.load(f"{filepath}_scaler_y.pkl")
            self.is_trained = True
            self.logger.info(f"Model loaded from {filepath}")
        except Exception as e:
            self.logger.error(f"Model loading failed: {e}")

# Example usage
if __name__ == "__main__":
    nn = NeuralNetworkPredictor()
    
    # Generate and train on synthetic data
    data = nn.generate_synthetic_data(2000)
    nn.train(data)
    
    # Save the model
    nn.save_model("he_nmpc_model")
    
    # Example prediction
    sample_input = data[:24, :-3]  # Last 24 hours of features
    prediction = nn.predict(sample_input)
    print("Neural Network Prediction:", prediction)