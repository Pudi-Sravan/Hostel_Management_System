import React, { useState, useEffect } from 'react';

const AllocateRoom = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [allDetails, setAllDetails] = useState(false);

  useEffect(() => {
    // Fetch students who haven't been allocated rooms yet
    fetch('http://localhost:3000/api/manager/students')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.log('Error fetching students:', error));

    // Fetch all available rooms
    fetch('http://localhost:3000/api/manager/rooms')
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.log('Error fetching rooms:', error));
  }, []);

  const handleAllocateRoom = () => {
    if (selectedStudent && selectedRoom) {
      const data = { student_id: selectedStudent, room_id: selectedRoom };

      fetch('http://localhost:3000/api/manager/allocate-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(() => alert('Room allocated successfully'))
        .catch(() => alert('Error allocating room'));
    } else {
      alert('Please select both a student and a room');
    }
  };

  const handleCreateRoom = () => {
    if (roomNumber && capacity) {
      const data = { room_number: roomNumber, capacity: capacity };

      fetch('http://localhost:3000/api/manager/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(() => {
          alert('Room created successfully');
          // Refresh rooms after creation
          setRooms([...rooms, data]);
        })
        .catch(() => alert('Error creating room'));
    } else {
      alert('Please fill in both the room number and capacity');
    }
  };

  return (
    <div>
      <h2>Allocate Room</h2>

      {/* Student Selection Dropdown */}
      <select
        onChange={(e) => setSelectedStudent(e.target.value)}
        value={selectedStudent}
      >
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student.student_id} value={student.student_id}>
            {student.name}
          </option>
        ))}
      </select>

      {/* Room Selection Dropdown */}
      <select
        onChange={(e) => setSelectedRoom(e.target.value)}
        value={selectedRoom}
      >
        <option value="">Select Room</option>
        {rooms.map((room) => (
          <option key={room.room_id} value={room.room_id}>
            {room.room_number} (Capacity: {room.capacity})
          </option>
        ))}
      </select>

      <button onClick={handleAllocateRoom}>Allocate Room</button>

      <hr />

      {/* Room Creation Section */}
      <h3>Create New Room</h3>
      <input
        type="text"
        placeholder="Room Number"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
      />
      <input
        type="number"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>

      <hr />

      {/* Toggle for "All Details" View */}
      <div>
        <button onClick={() => setAllDetails(!allDetails)}>
          {allDetails ? 'Show Basic Details' : 'Show All Details'}
        </button>
      </div>

      {/* Manager View (All Details) */}
      {allDetails && (
        <div>
          <h3>All Students Details</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Room Number</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.name}</td>
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

export default AllocateRoom;
