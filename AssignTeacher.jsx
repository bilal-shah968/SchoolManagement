import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = 'http://localhost:5024/api/assignteacher';

    // Fetch teachers and assignments
    useEffect(() => {
        fetchTeachers();
        fetchAssignments();
    }, []);

    const fetchTeachers = async () => {
        try {
            setError('');
            const response = await axios.get(`${API_BASE_URL}/teachers`);
            if (response.data) {
                setTeachers(response.data);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
            const errorMessage = error.response?.data?.message || 'Error fetching teachers';
            setError(errorMessage);
        }
    };

    const fetchAssignments = async () => {
        try {
            setError('');
            const response = await axios.get(`${API_BASE_URL}/assignments`);
            if (response.data) {
                setAssignments(response.data);
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
            const errorMessage = error.response?.data?.message || 'Error fetching assignments';
            setError(errorMessage);
        }
    };

    const handleAssign = async () => {
        if (!selectedTeacher || !selectedClass) {
            setError('Please select both a teacher and a class.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const teacherId = parseInt(selectedTeacher);
            if (isNaN(teacherId)) {
                throw new Error('Invalid teacher ID');
            }

            const assignmentData = {
                teacherId: teacherId,
                className: selectedClass
            };

            const response = await axios.post(`${API_BASE_URL}/assign`, assignmentData);

            if (response.data) {
                alert(response.data.message || 'Teacher assigned successfully');
                setSelectedTeacher('');
                setSelectedClass('');
                await fetchAssignments();
            }
        } catch (error) {
            console.error('Assignment error:', error);
            const errorMessage = error.response?.data?.message 
                || error.message 
                || 'Error assigning teacher';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAssignment = async (id) => {
        if (!window.confirm('Are you sure you want to remove this assignment?')) {
            return;
        }

        try {
            setError('');
            const response = await axios.delete(`${API_BASE_URL}/assignment/${id}`);
            if (response.data?.message) {
                alert(response.data.message);
                await fetchAssignments();
            }
        } catch (error) {
            console.error('Error deleting assignment:', error);
            const errorMessage = error.response?.data?.message || 'Error removing assignment';
            setError(errorMessage);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6">Assign Teacher</h1>
            
            {/* Error Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {/* Assignment Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-4">Assign Teacher to Class</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block mb-2">Select Teacher:</label>
                        <select
                            className="p-2 border rounded w-full"
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                        >
                            <option value="">-- Select Teacher --</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name} - {teacher.subject}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2">Select Class:</label>
                        <select
                            className="p-2 border rounded w-full"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="">-- Select Class --</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={`Class ${i + 1}`}>
                                    Class {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    onClick={handleAssign}
                    disabled={loading}
                >
                    {loading ? 'Assigning...' : 'Assign Teacher'}
                </button>
            </div>

            {/* Current Assignments */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Current Assignments</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Teacher</th>
                                <th className="py-2 px-4 border">Class</th>
                                <th className="py-2 px-4 border">Assigned On</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment) => (
                                <tr key={assignment.id}>
                                    <td className="py-2 px-4 border">{assignment.teacherName}</td>
                                    <td className="py-2 px-4 border">{assignment.className}</td>
                                    <td className="py-2 px-4 border">{formatDate(assignment.createdAt)}</td>
                                    <td className="py-2 px-4 border">
                                        <button
                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {assignments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500">
                                        No assignments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssignTeacher; 