import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherProfiles = () => {
    const [teachers, setTeachers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedTeacher, setEditedTeacher] = useState({
        name: '',
        email: '',
        class: '',
        attendance: '',
        subject: '',
        salary: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newClass, setNewClass] = useState('');
    const [newAttendance, setNewAttendance] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [newSalary, setNewSalary] = useState('');

    const API_BASE_URL = 'https://localhost:5001/api/teacher';

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            setTeachers(teachers.filter(teacher => teacher.id !== id));
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };

    const handleEditClick = (teacher) => {
        setEditingId(teacher.id);
        setEditedTeacher({
            name: teacher.name,
            email: teacher.email,
            class: teacher.class,
            attendance: teacher.attendance,
            subject: teacher.subject,
            salary: teacher.salary,
        });
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/${id}`, editedTeacher);
            setTeachers(teachers.map(teacher =>
                teacher.id === id ? { ...teacher, ...editedTeacher } : teacher
            ));
            setEditingId(null);
            setEditedTeacher({
                name: '',
                email: '',
                class: '',
                attendance: '',
                subject: '',
                salary: '',
            });
        } catch (error) {
            console.error('Error updating teacher:', error);
        }
    };

    const handleChange = (field, value) => {
        setEditedTeacher(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        if (!newName || !newEmail || !newClass || !newAttendance || !newSubject || !newSalary) return;

        const newTeacher = {
            name: newName,
            email: newEmail,
            class: newClass,
            attendance: newAttendance,
            subject: newSubject,
            salary: parseFloat(newSalary),
        };

        try {
            const response = await axios.post(API_BASE_URL, newTeacher);
            setTeachers([...teachers, response.data]);
            setShowModal(false);
            setNewName('');
            setNewEmail('');
            setNewClass('');
            setNewAttendance('');
            setNewSubject('');
            setNewSalary('');
        } catch (error) {
            console.error('Error adding teacher:', error);
        }
    };

    return (
        <div>
            {/* Render your component content here */}
        </div>
    );
};

export default TeacherProfiles; 