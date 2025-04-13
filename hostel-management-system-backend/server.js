const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'hms_user',
    password: 'Hms@1234',
    database: 'hostel_management'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Auth Routes
app.post('/api/register', async (req, res) => {
    const { email, password, name, role, department, phone } = req.body;

    try {
        // Step 1: Insert user into the `users` table
        const createUserQuery = 'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)';
        db.query(createUserQuery, [email, password, name, role], (err, userResult) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).json({ message: 'Error creating user' });
            }

            const userId = userResult.insertId;

            // Step 2: If the role is 'student', create the student record
            if (role === 'student') {
                // Insert student record in `students` table
                const createStudentQuery = 'INSERT INTO students (user_id, department, phone) VALUES (?, ?, ?)';
                db.query(createStudentQuery, [userId, department, phone], (err, studentResult) => {
                    if (err) {
                        console.error('Error creating student:', err);
                        return res.status(500).json({ message: 'Error creating student' });
                    }

                    const studentId = studentResult.insertId;

                    // Step 3: Create an initial payment record in the `payments` table
                    const createPaymentQuery = 'INSERT INTO payments (student_id, payment_status) VALUES (?, ?)';
                    db.query(createPaymentQuery, [studentId, 'unpaid'], (err, paymentResult) => {
                        if (err) {
                            console.error('Error creating payment record:', err);
                            return res.status(500).json({ message: 'Error creating payment record' });
                        }
                        res.status(201).json({
                            message: 'User, student, and payment record created successfully',
                            user: { user_id: userId, name, email, role },
                            student: { student_id: studentId, department, phone },
                        });
                    });
                });
            } else {
                res.status(201).json({ message: 'User created successfully', user: { user_id: userId, name, email, role } });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).send('Server Error');
        } else if (results.length > 0) {
            const user = results[0];
            res.json({
                message: 'Login successful',
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    role: user.role, // Send role information
                }
            });
        } else {
            res.status(404).send('Invalid credentials');
        }
    });
});

// Manager Routes
app.get('/api/manager/students', (req, res) => {
    const query = `
      SELECT 
        s.student_id, 
        u.name, 
        u.email, 
        s.phone, 
        s.department, 
        r.room_number, 
        p.payment_status 
      FROM 
        students s
      JOIN 
        users u ON s.user_id = u.user_id  -- Join users table using user_id
      LEFT JOIN 
        allocations a ON s.student_id = a.student_id
      LEFT JOIN 
        rooms r ON a.room_id = r.room_id
      LEFT JOIN 
        payments p ON s.student_id = p.student_id;
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching students:', err);
        return res.status(500).json({ message: 'Error fetching students' });
      }
      res.json(results);
    });
  });
  


app.get('/api/manager/rooms', (req, res) => {
    const query = 'SELECT * FROM rooms';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            return res.status(500).json({ message: 'Error fetching rooms' });
        }
        res.json(results);  // Return list of rooms
    });
});

app.post('/api/manager/allocate-room', (req, res) => {
    const { student_id, room_number } = req.body;

    if (!student_id || !room_number) {
        return res.status(400).json({ message: 'Student ID and Room Number are required' });
    }

    // Step 1: Get the room_id using room_number
    const getRoomIdQuery = 'SELECT room_id, occupied, capacity FROM rooms WHERE room_number = ?';
    db.query(getRoomIdQuery, [room_number], (err, result) => {
        if (err) {
            console.error('Error retrieving room details:', err);
            return res.status(500).json({ message: 'Error retrieving room details' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const room = result[0];
        const room_id = room.room_id;

        // Step 2: Check if student is already allocated a room
        const checkAllocationQuery = 'SELECT * FROM allocations WHERE student_id = ?';
        db.query(checkAllocationQuery, [student_id], (err, allocationResult) => {
            if (err) {
                console.error('Error checking allocation:', err);
                return res.status(500).json({ message: 'Error checking allocation status' });
            }

            if (allocationResult.length > 0) {
                return res.status(400).json({ message: 'Student already allocated a room' });
            }

            // Step 3: Check room availability
            if (room.occupied >= room.capacity) {
                return res.status(400).json({ message: 'Room is at full capacity' });
            }

            // Step 4: Update room occupancy
            const updateRoomQuery = 'UPDATE rooms SET occupied = occupied + 1 WHERE room_id = ?';
            db.query(updateRoomQuery, [room_id], (err) => {
                if (err) {
                    console.error('Error updating room occupancy:', err);
                    return res.status(500).json({ message: 'Error updating room occupancy' });
                }

                // Step 5: Insert allocation record
                const insertAllocationQuery = 'INSERT INTO allocations (student_id, room_id) VALUES (?, ?)';
                db.query(insertAllocationQuery, [student_id, room_id], (err) => {
                    if (err) {
                        console.error('Error inserting allocation record:', err);
                        return res.status(500).json({ message: 'Error recording allocation' });
                    }

                    res.json({ message: 'Room allocated successfully' });
                });
            });
        });
    });
});


app.post('/api/manager/create-room', (req, res) => {
    const { room_number, capacity } = req.body;
    if (!room_number || !capacity) return res.status(400).json({ message: 'Room number and capacity are required' });

    const query = 'INSERT INTO rooms (room_number, capacity) VALUES (?, ?)';
    db.query(query, [room_number, capacity], (err) => {
        if (err) return res.status(500).json({ message: 'Error creating room' });
        res.status(200).json({ message: 'Room created successfully' });
    });
});

// Student Routes
app.get('/api/student/profile', (req, res) => {
    const userId = req.query.user_id || req.body.user_id;
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    const query = `
      SELECT 
        u.name, 
        u.email,
        s.student_id,
        s.phone, 
        s.department, 
        r.room_number, 
        p.payment_status 
      FROM 
        users u
      JOIN 
        students s ON u.user_id = s.user_id
      LEFT JOIN 
        allocations a ON s.student_id = a.student_id
      LEFT JOIN 
        rooms r ON a.room_id = r.room_id
      LEFT JOIN 
        payments p ON s.student_id = p.student_id
      WHERE 
        u.user_id = ?
    `;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching student profile:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json(results[0]);
    });
  });
  
  


  app.put('/api/student/update-profile', (req, res) => {
    const { user_id, phone, department } = req.body;
  
    if (!user_id || !phone || !department) {
      return res.status(400).json({ message: 'Missing fields' });
    }
  
    const query = `UPDATE students SET phone = ?, department = ? WHERE user_id = ?`;
  
    db.query(query, [phone, department, user_id], (err, result) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'Failed to update profile' });
      }
  
      res.json({ message: 'Profile updated successfully' });
    });
  });
  


// Update Payment Status
app.put('/api/payment/:studentId', (req, res) => {
    const { studentId } = req.params;
    const { payment_status } = req.body;

    if (payment_status !== 'paid' && payment_status !== 'unpaid') {
        return res.status(400).json({ message: 'Invalid payment status' });
    }

    const query = 'UPDATE payments SET payment_status = ? WHERE student_id = ?';
    db.query(query, [payment_status, studentId], (err, result) => {
        if (err) {
            console.error('Error updating payment status:', err);
            return res.status(500).json({ message: 'Error updating payment status' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found or no payment record' });
        }

        res.json({ message: 'Payment status updated successfully' });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
