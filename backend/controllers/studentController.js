const supabase = require('../config/supabase');


function generateRegistrationId() {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `EDU-${year}-${randomDigits}`;
}

async function registerStudent(req, res) {
  try {
    const { name, email, phone, date_of_birth, gender, course, address } = req.body;
    const sanitizedEmail = email.trim().toLowerCase();

    const { data: existingStudents, error: checkError } = await supabase
      .from('students')
      .select('id, email')
      .eq('email', sanitizedEmail)
      .limit(1);

    if (checkError) {
      console.error('Database query error on email check:', checkError);
    }

    if (existingStudents && existingStudents.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A student with this email address is already registered.'
      });
    }

    let registrationId = generateRegistrationId();

    const insertObj = {
      registration_id: registrationId,
      name: name.trim(),
      email: sanitizedEmail,
      phone: String(phone).trim(),
      date_of_birth,
      gender: gender.trim(),
      course: course.trim(),
      address: address.trim()
    };

    const { data, error } = await supabase
      .from('students')
      .insert([insertObj])
      .select();

    if (error) {
      console.error('FULL SUPABASE ERROR OBJECT:', JSON.stringify(error, null, 2));

      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Registration record with this email or registration ID already exists.'
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message || 'Unable to complete registration. Please try again.',
        errorDetails: error
      });
    }

    const createdStudent = data && data.length > 0 ? data[0] : null;

    return res.status(201).json({
      success: true,
      message: 'Student registration successful',
      registrationId: createdStudent ? createdStudent.registration_id : registrationId,
      student: createdStudent
    });
  } catch (err) {
    console.error('Server error in registerStudent:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to complete registration. Please try again.'
    });
  }
}

async function getAllStudents(req, res) {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students from Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve students list.'
      });
    }

    return res.status(200).json({
      success: true,
      count: data ? data.length : 0,
      students: data || []
    });
  } catch (err) {
    console.error('Server error in getAllStudents:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
}

async function getStudentById(req, res) {
  try {
    const { id } = req.params;
    let query = supabase.from('students').select('*');

    if (!isNaN(id)) {
      query = query.or(`id.eq.${id},registration_id.eq.${id}`);
    } else {
      query = query.eq('registration_id', id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error fetching student by ID:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve student details.'
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      student: data
    });
  } catch (err) {
    console.error('Server error in getStudentById:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
}

async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, date_of_birth, gender, course, address } = req.body;

    const updatePayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: String(phone).trim(),
      date_of_birth,
      gender: gender.trim(),
      course: course.trim(),
      address: address.trim()
    };

    let query = supabase.from('students').update(updatePayload);

    if (!isNaN(id)) {
      query = query.or(`id.eq.${id},registration_id.eq.${id}`);
    } else {
      query = query.eq('registration_id', id);
    }

    const { data, error } = await query.select();

    if (error) {
      console.error('Error updating student in Supabase:', error);
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Another student is already using this email address.'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to update student information.'
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student information updated successfully',
      student: data[0]
    });
  } catch (err) {
    console.error('Server error in updateStudent:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
}


async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    let query = supabase.from('students').delete();

    if (!isNaN(id)) {
      query = query.or(`id.eq.${id},registration_id.eq.${id}`);
    } else {
      query = query.eq('registration_id', id);
    }

    const { data, error } = await query.select();

    if (error) {
      console.error('Error deleting student from Supabase:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete student record.'
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student record deleted successfully'
    });
  } catch (err) {
    console.error('Server error in deleteStudent:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
}

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
