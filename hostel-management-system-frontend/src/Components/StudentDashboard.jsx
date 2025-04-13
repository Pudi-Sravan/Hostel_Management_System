import { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('user')); // Get user object from localStorage
  const userId = user?.user_id; // Safely get student_id

  const [student, setStudent] = useState({});
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (!userId) {
      alert('Student ID not found. Please login again.');
      return;
    }

    axios.get(`http://localhost:3000/api/student/profile?user_id=${userId}`)
      .then(response => {
        setStudent(response.data);
        setPhone(response.data.phone || '');
        setDepartment(response.data.department || '');
      })
      .catch(error => {
        console.error("Failed to fetch profile", error);
      });
  }, [userId]);

  const handleUpdate = () => {
    axios.put('http://localhost:3000/api/student/update-profile', {
      student_id: userId,
      phone,
      department
    })
    .then(res => alert(res.data.message))
    .catch(err => console.error("Failed to update profile", err));
  };

  return (
    <div>
      <h2>Student Dashboard</h2>

      <p><strong>Name:</strong> {student.name || 'Loading...'}</p>
      <p><strong>Email:</strong> {student.email || 'Loading...'}</p>

      <p>
        <strong>Phone:</strong>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </p>
      <p>
        <strong>Department:</strong>
        <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} />
      </p>
      <button onClick={handleUpdate}>Update Profile</button>

      <div>
        <h3>Room Allocation</h3>
        <p>{student.room_number || 'Not allocated'}</p>
      </div>

      <div>
        <h3>Payment Status</h3>
        <p>{student.payment_status || 'Not paid'}</p>
      </div>
    </div>
  );
}

export default StudentDashboard;
