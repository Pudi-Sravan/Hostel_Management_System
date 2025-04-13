import React, { useState, useEffect } from 'react';

const ManagerDashboard = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomNumber, setroomNumber] = useState('');
  const [allocStudentId, setAllocStudentId] = useState(''); // Added allocStudentId state
  const [paymentStatus, setPaymentStatus] = useState('');
  const [allDetails, setAllDetails] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState('');

  // Fetch students and rooms
  useEffect(() => {
    fetch('http://localhost:3000/api/manager/students')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Handle Room Allocation
  const handleRoomOccupation = () => {
    if (!allocStudentId || !roomNumber) {
      alert('Please enter both Student ID and Room Number.');
      return;
    }

    console.log('Allocating Room:', { student_id: allocStudentId, room_number: roomNumber });

    fetch('http://localhost:3000/api/manager/allocate-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: allocStudentId, room_number: roomNumber }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Room is at full capacity') {
          alert('Room is at full capacity. Please choose another room.');
        } else if (data.message === 'Student already allocated a room') {
          alert('Student already has a room assigned.');
        } else if (data.message === 'Room allocated successfully') {
          alert('Room allocated successfully!');
        } else {
          // For any other unexpected messages
          alert('' + (data.message || 'An unknown error occurred.'));
        }

        setAllocStudentId('');
        setroomNumber('');
      })
      .catch((error) => {
        console.error('Error allocating room:', error);
        alert('A network or server error occurred. Please try again.');
      });
  };



  // Handle Room Creation
  const handleRoomCreation = () => {
    fetch('http://localhost:3000/api/manager/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_number: newRoomNumber, capacity: newRoomCapacity }),
    })
      .then((response) => response.json())
      .then((data) => alert(data.message))
      .catch((error) => console.log('Error creating room:', error));
  };

  // Handle Payment Status Update
  const handlePaymentStatusUpdate = (studentId, status) => {
    fetch(`http://localhost:3000/api/payment/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status: status }),
    })
      .then((response) => response.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error('Error updating payment status:', error));
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>

      {/* Room Allocation */}
      <div>
        <h3>Allocate Room</h3>
        <label>Student ID:</label>
        <input
          type="text"
          value={allocStudentId}
          onChange={(e) => setAllocStudentId(e.target.value)}
        />

        <label>Room ID:</label>
        <select onChange={(e) => setroomNumber(e.target.value)} value={roomNumber}>
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.room_id} value={room.room_number}>
              {room.room_number}
            </option>
          ))}
        </select>
        <button onClick={handleRoomOccupation}>Allocate Room</button>
      </div>

      {/* Create New Room */}
      <div>
        <h3>Create Room</h3>
        <label>Room Number:</label>
        <input type="text" value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} />
        <label>Room Capacity:</label>
        <input
          type="number"
          value={newRoomCapacity}
          onChange={(e) => setNewRoomCapacity(e.target.value)}
        />
        <button onClick={handleRoomCreation}>Create Room</button>
      </div>

      {/* Update Payment Status */}
      <div>
        <h3>Update Payment Status</h3>
        <label>Student ID:</label>
        <input
          type="text"
          value={allocStudentId} // Reusing allocStudentId for consistency
          onChange={(e) => setAllocStudentId(e.target.value)}
        />

        <label>Payment Status:</label>
        <select
          onChange={(e) => setPaymentStatus(e.target.value)}
          value={paymentStatus}
        >
          <option value="">Select Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        <button onClick={() => handlePaymentStatusUpdate(allocStudentId, paymentStatus)}>
          Update Payment Status
        </button>
      </div>

      {/* View All Student Details */}
      <button onClick={() => setAllDetails(!allDetails)}>
        {allDetails ? 'Hide All Details' : 'Show All Details'}
      </button>

      {/* Conditionally render student details table */}
      {allDetails && (
        <div>
          <h3>All Students' Details</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Room Number</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.department}</td>
                  <td>{student.room_number}</td>
                  <td>{student.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
