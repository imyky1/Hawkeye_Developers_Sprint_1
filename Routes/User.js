const con = require('../Config/db_connection');
const express = require('express');
const Router = express.Router();

//connecting mysql database
const connection = con.getConnection((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.message);
    } else {
        console.log('Connected to MySQL database');
    }
});

//API to get data
Router.get('/student', (req, res) => {
    connection.query('SELECT * FROM student', (error, studentResults) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving students' });
        } else {
            // For each student, retrieve their "Other Universities" information
            const studentsWithOtherUniversities = [];

            // Assuming you have a unique identifier for each student, e.g., StudentID
            studentResults.forEach((student) => {
                connection.query(
                    'SELECT * FROM OtherUniversities WHERE StudentID = ?',
                    [student.StudentID],
                    (otherUniError, otherUniResults) => {
                        if (otherUniError) {
                            res.status(500).json({ error: 'Error retrieving Other Universities' });
                        } else {
                            // Add the "Other Universities" information to the student object
                            student.OtherUniversities = otherUniResults;
                            studentsWithOtherUniversities.push(student);

                            // Check if all students have been processed
                            if (studentsWithOtherUniversities.length === studentResults.length) {
                                res.status(200).json(studentsWithOtherUniversities);
                            }
                        }
                    }
                );
            });
        }
    });
});

//API to post data
Router.post('/student', async (req, res) => {
        const { UniversityName, Email, TermFall, TermYear, Specialization, Major, IndianCollege, Branch,
            Academics_GPA, Academics_GradeScale, WorkExperience, ResearchPapersPublished, Examination_Name,
            Examination_VerbalScore, Examination_QuantScore, Examination_AWAScore, Examination_TotalScore,
            EnglishProficiencyTestName, EnglishProficiencyTestScore, Resumes, SOP, ApplicationEssay,OtherUniversities } = req.body;
        const insertQuery = `
        INSERT INTO student (
        UniversityName, Email, TermFall, TermYear, Specialization, Major, IndianCollege, Branch, 
        Academics_GPA, Academics_GradeScale, WorkExperience, ResearchPapersPublished, Examination_Name,
        Examination_VerbalScore, Examination_QuantScore, Examination_AWAScore, Examination_TotalScore, 
        EnglishProficiencyTestName, EnglishProficiencyTestScore,Resumes, SOP, ApplicationEssay
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
        // console.log(Email)
        //Inserting the data of each student into student table
        connection.query(insertQuery, [
            UniversityName,
            Email,
            TermFall,
            TermYear,
            Specialization,
            Major,
            IndianCollege,
            Branch,
            Academics_GPA,
            Academics_GradeScale,
            WorkExperience,
            ResearchPapersPublished,
            Examination_Name,
            Examination_VerbalScore,
            Examination_QuantScore,
            Examination_AWAScore,
            Examination_TotalScore,
            EnglishProficiencyTestName,
            EnglishProficiencyTestScore,
            Resumes,
            SOP,
            ApplicationEssay
        ],(error,result)=>{
            if(error){
                res.status(200).json({error:error.message});
            }
            else{
                // console.log(result);
                // console.log(result.insertId)
                // console.log(Array.isArray(OtherUniversities))
                //Retrieve the Id of the student inserted 
                const StudentID = result.insertId;
                if (Array.isArray(OtherUniversities) && OtherUniversities.length > 0) {
                    for (const university of OtherUniversities) {
                        const { UniversityName, Branch, Status } = university;
        
                        const insertOtherUniversityQuery = `
                            INSERT INTO OtherUniversities (StudentID, UniversityName, Branch, Status)
                            VALUES (?, ?, ?, ?);
                        `;
                    //Insert other universitites into table with student primary key
                    connection.execute(insertOtherUniversityQuery, [StudentID, UniversityName, Branch, Status]);
                    }
                }
                res.status(200).json("Data inserted successfully");
            }
            
        });
        
});
// //API to update data
// Router.put('/student/:id', (req, res) => {
//     const { e_name, e_sal } = req.body;
//     const e_id = req.params.id;
//     const sql = 'UPDATE employee SET e_id = ?, e_name = ?, e_sal = ?';
//     connection.query(sql, [e_id, e_name, e_sal], (error, results) => {
//         if (error) {
//             res.status(500).json({ error: error });
//         } else {
//             res.status(200).json({ message: 'student updated' });
//         }
//     });
// });

// // API to delete data
// Router.delete('/student/:id', (req, res) => {
//     const e_id = req.params.id;
//     const sql = 'DELETE FROM student WHERE Email = ?';
//     connection.query(sql, ["YASH.UNIFLIK@gmail.com"], (error, results) => {
//         if (error) {
//             res.status(500).json({ error: error });
//         } else {
//             res.status(200).json({ message: 'employee deleted' });
//         }
//     });
// });

module.exports = Router;

