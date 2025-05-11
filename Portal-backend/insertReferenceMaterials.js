const mongoose = require('mongoose');
const studentData = require('./models/studentData');

const MONGO_URI = 'mongodb+srv://ictakinternsfsd24:6kG8TJzp3k4Gl4pF@cluster0.du1ggop.mongodb.net/InternshipPortalDB?retryWrites=true&w=majority&appName=Cluster0';

async function debugStudentSubmissions(studentId) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB');
    }

    const student = await studentData.findById(studentId)
      .select('name weeklySubmissionData');

    if (!student) {
      console.log('❌ Student not found');
      return;
    }

    console.log(`👤 Student: ${student.name}`);
    console.log('📄 Weekly Submissions:', student.weeklySubmissionData);

  } catch (error) {
    console.error('🚨 Error:', error.message);
  } finally {
    mongoose.connection.close(); // Optional: close after execution
  }
}

// 🔍 Replace with a valid student ID from your DB
debugStudentSubmissions('680dbba2729e8abfb883d83c');
