import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function run() {
  try {
    // 1. Register
    const username = `test_repro_${Date.now()}`;
    console.log(`Registering user: ${username}`);
    const regRes = await axios.post(`${API_URL}/auth/register`, {
      username,
      password: 'password123'
    });
    const token = regRes.data.token;
    console.log('Registered. Token received.');

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // 2. Create Workout
    console.log('Creating workout...');
    const createRes = await axios.post(`${API_URL}/workouts`, {
      name: 'Test Workout',
      data: { exercises: [] }
    }, config);
    const workoutId = createRes.data.id;
    console.log(`Workout created. ID: ${workoutId}`);

    // 3. Update Workout
    console.log(`Updating workout ${workoutId}...`);
    const updateRes = await axios.put(`${API_URL}/workouts/${workoutId}`, {
      name: 'Updated Workout',
      data: { exercises: [{ id: 1, name: 'Pushups' }] }
    }, config);

    console.log('Update response:', updateRes.status, updateRes.data);

  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
    if (err.response) {
        console.error('Status:', err.response.status);
    }
  }
}

run();
