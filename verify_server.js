import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testServer() {
  try {
    console.log('Testing connection to ' + API_URL);
    // Try to login to get a token (or just hit a public endpoint if any? No public endpoints except auth)
    // Let's try to register a dummy user to get a token, then create a schedule.

    const username = 'test_user_' + Date.now();
    console.log('Registering user:', username);

    const regRes = await axios.post(`${API_URL}/auth/register`, {
      username: username,
      password: 'password123'
    });

    const token = regRes.data.token;
    console.log('Got token:', token ? 'Yes' : 'No');

    // Now try to create a workout
    const workoutRes = await axios.post(`${API_URL}/workouts`, {
      name: 'Test Workout',
      data: []
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const workoutId = workoutRes.data.id;
    console.log('Created workout:', workoutId);

    // Now try to schedule it with a TIME
    const time = '14:30';
    console.log('Scheduling workout at:', time);

    const scheduleRes = await axios.post(`${API_URL}/schedules`, {
      workout_id: workoutId,
      date: '2025-12-01',
      time: time
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Schedule response:', scheduleRes.data);

    if (scheduleRes.data.time === time) {
      console.log('SUCCESS: Time was saved correctly!');
    } else {
      console.log('FAILURE: Time was NOT saved correctly. Got:', scheduleRes.data.time);
    }

  } catch (err) {
    console.error('Test failed:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

testServer();
