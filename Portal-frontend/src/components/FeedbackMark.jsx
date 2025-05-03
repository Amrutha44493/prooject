// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Alert,
// } from "@mui/material";
// import axios from "axios";

// const FeedbackMarks = () => {
//   const [weeklySubmissions, setWeeklySubmissions] = useState([]);
//   const [projectReport, setProjectReport] = useState(null);
//   const [viva, setViva] = useState(null);

//   useEffect(() => {
//     const fetchMarksData = async () => {
//       const token = localStorage.getItem("token");
//       const studentId = localStorage.getItem("studentId");

//       if (!studentId) {
//         console.error("Student ID not found in localStorage.");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/getSubmission/${studentId}`,
//           {
//             headers: {
//               "x-auth-token": token,
//             },
//           }
//         );

//         const data = response.data;
//         setWeeklySubmissions(data.weeklySubmissionData || []);
//         setProjectReport(data.finalProjectReport || null);
//         setViva(data.vivaVoce || null);
//       } catch (error) {
//         console.error("Error fetching marks and comments:", error);
//       }
//     };

//     fetchMarksData();
//   }, []);

//   const formatDate = (dateString) =>
//     dateString ? new Date(dateString).toLocaleDateString() : "N/A";

//   const renderTable = (title, dataArray, isSingleRow = false) => {
//     if (!dataArray || (Array.isArray(dataArray) && dataArray.length === 0)) {
//       return (
//         <Box sx={{ mb: 5 }}>
//           <Typography
//             variant="h6"
//             sx={{
//               mt: 4,
//               mb: 1,
//               fontWeight: "bold",
//               color: "#1976d2",
//               display: "inline-block",
//             }}
//           >
//             {title}
//           </Typography>
//           <Alert severity="info" sx={{ mt: 1 }}>
//             No submission done yet
//           </Alert>
//         </Box>
//       );
//     }

//     return (
//       <Box sx={{ mb: 5 }}>
//         <Typography
//           variant="h6"
//           sx={{
//             mt: 4,
//             mb: 1,
//             fontWeight: "bold",
//             color: "#1976d2",
//             display: "inline-block",
//           }}
//         >
//           {title}
//         </Typography>
//         <TableContainer
//           component={Paper}
//           sx={{ boxShadow: 3, borderRadius: 2 }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "rgb(73, 150, 231)" }}>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>TYPE</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>DATE</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>MARKS</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>MENTOR COMMENT</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>SUBMISSION</strong>
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {isSingleRow
//                 ? renderSubmissionRow(title, dataArray)
//                 : dataArray.map((item, index) =>
//                     renderSubmissionRow(`Week ${index + 1}`, item, index)
//                   )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   const renderSubmissionRow = (typeLabel, submission, key = null) => {
//     let maxMarks = 10;
//     if (typeLabel === "Project Report") maxMarks = 30;
//     if (typeLabel === "Viva Voce") maxMarks = 30;

//     return (
//       <TableRow key={key}>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {typeLabel}
//         </TableCell>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {formatDate(submission?.createdAt)}
//         </TableCell>
//         <TableCell
//           sx={{
//             borderRight: "2px solid #ddd",
//             textAlign: "center",
//             fontWeight: 500,
//           }}
//         >
//           {!submission || submission.marks === 0
//             ? "Not graded yet"
//             : `${submission.marks} / ${maxMarks}`}
//         </TableCell>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {submission?.mentorComment || "No comments yet"}
//         </TableCell>
//         <TableCell sx={{ textAlign: "center" }}>
//           {submission?.submissionType === "link" ? (
//             <a
//               href={submission.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 textDecoration: "underline",
//                 fontWeight: 500,
//               }}
//             >
//               View Link
//             </a>
//           ) : submission?.cloudinaryUrl ? (
//             <a
//               href={submission.cloudinaryUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 textDecoration: "underline",
//                 fontWeight: 500,
//               }}
//             >
//               View File
//             </a>
//           ) : (
//             "No submission"
//           )}
//         </TableCell>
//       </TableRow>
//     );
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//         p: 2,
//       }}
//     >
//       <Paper
//         elevation={5}
//         sx={{
//           p: { xs: 2, sm: 4, md: 6 },
//           borderRadius: 3,
//           width: "90%",
//           maxWidth: "1200px",
//           backgroundColor: "#fff",
//         }}
//       >
//         <Typography
//           variant="h5"
//           gutterBottom
//           sx={{
//             textAlign: "center",
//             color: "#1976d2",
//             fontWeight: "bold",
//             mb: 3,
//           }}
//         >
//           MARKS AND FEEDBACK
//         </Typography>

//         {renderTable("Weekly Submissions", weeklySubmissions)}
//         {renderTable("Project Report", projectReport, true)}
//         {renderTable("Viva Voce", viva, true)}
//       </Paper>
//     </Box>
//   );
// };

// export default FeedbackMarks;


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Alert,
// } from "@mui/material";
// import axios from "axios";

// const FeedbackMarks = () => {
//   const [weeklySubmissions, setWeeklySubmissions] = useState([]);
//   const [projectReport, setProjectReport] = useState(null);
//   const [viva, setViva] = useState(null);

//   useEffect(() => {
//     const fetchMarksData = async () => {
//       const token = localStorage.getItem("token");
//       const studentId = localStorage.getItem("studentId");

//       if (!studentId) {
//         console.error("Student ID not found in localStorage.");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/getSubmission/${studentId}`,
//           {
//             headers: {
//               "x-auth-token": token,
//             },
//           }
//         );

//         const data = response.data;
//         setWeeklySubmissions(data.weeklySubmissionData || []);
//         setProjectReport(data.finalProjectReport || null);
//         setViva(data.vivaVoce || null);
//       } catch (error) {
//         console.error("Error fetching marks and comments:", error);
//       }
//     };

//     fetchMarksData();
//   }, []);

//   const formatDate = (dateString) =>
//     dateString ? new Date(dateString).toLocaleDateString() : "N/A";

//   const renderTable = (title, dataArray, isSingleRow = false) => {
//     const isEmpty =
//       !dataArray ||
//       (isSingleRow && Object.keys(dataArray).length === 0) ||
//       (Array.isArray(dataArray) && dataArray.length === 0);

//     if (isEmpty) {
//       return (
//         <Box sx={{ mb: 5 }}>
//           <Typography
//             variant="h6"
//             sx={{
//               mt: 4,
//               mb: 1,
//               fontWeight: "bold",
//               color: "#1976d2",
//               display: "inline-block",
//             }}
//           >
//             {title}
//           </Typography>
//           <Alert severity="info" sx={{ mt: 1 }}>
//             No submission done yet
//           </Alert>
//         </Box>
//       );
//     }

//     return (
//       <Box sx={{ mb: 5 }}>
//         <Typography
//           variant="h6"
//           sx={{
//             mt: 4,
//             mb: 1,
//             fontWeight: "bold",
//             color: "#1976d2",
//             display: "inline-block",
//           }}
//         >
//           {title}
//         </Typography>
//         <TableContainer
//           component={Paper}
//           sx={{ boxShadow: 3, borderRadius: 2 }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "rgb(73, 150, 231)" }}>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>TYPE</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>DATE</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>MARKS</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>MENTOR COMMENT</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>SUBMISSION</strong>
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {isSingleRow
//                 ? renderSubmissionRow(title, dataArray)
//                 : dataArray.map((item, index) =>
//                     renderSubmissionRow(`Week ${index + 1}`, item, index)
//                   )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   const renderSubmissionRow = (typeLabel, submission, key = null) => {
//     let maxMarks = 10;
//     if (typeLabel === "Project Report") maxMarks = 30;
//     if (typeLabel === "Viva Voce") maxMarks = 30;

//     return (
//       <TableRow key={key}>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {typeLabel}
//         </TableCell>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {formatDate(submission?.createdAt)}
//         </TableCell>
//         <TableCell
//           sx={{
//             borderRight: "2px solid #ddd",
//             textAlign: "center",
//             fontWeight: 500,
//           }}
//         >
//           {!submission || submission.marks === 0
//             ? "Not graded yet"
//             : `${submission.marks} / ${maxMarks}`}
//         </TableCell>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {submission?.mentorComment || "No comments yet"}
//         </TableCell>
//         <TableCell sx={{ textAlign: "center" }}>
//           {submission?.submissionType === "link" ? (
//             <a
//               href={submission.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 textDecoration: "underline",
//                 fontWeight: 500,
//               }}
//             >
//               View Link
//             </a>
//           ) : submission?.cloudinaryUrl ? (
//             <a
//               href={submission.cloudinaryUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 textDecoration: "underline",
//                 fontWeight: 500,
//               }}
//             >
//               View File
//             </a>
//           ) : (
//             "No submission"
//           )}
//         </TableCell>
//       </TableRow>
//     );
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//         p: 2,
//       }}
//     >
//       <Paper
//         elevation={5}
//         sx={{
//           p: { xs: 2, sm: 4, md: 6 },
//           borderRadius: 3,
//           width: "90%",
//           maxWidth: "1200px",
//           backgroundColor: "#fff",
//         }}
//       >
//         <Typography
//           variant="h5"
//           gutterBottom
//           sx={{
//             textAlign: "center",
//             color: "#1976d2",
//             fontWeight: "bold",
//             mb: 3,
//           }}
//         >
//           MARKS AND FEEDBACK
//         </Typography>

//         {renderTable("Weekly Submissions", weeklySubmissions)}
//         {renderTable("Project Report", projectReport, true)}
//         {renderTable("Viva Voce", viva, true)}
//       </Paper>
//     </Box>
//   );
// };

// export default FeedbackMarks;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Alert,
// } from "@mui/material";
// import axios from "axios";

// const FeedbackMarks = () => {
//   const [weeklySubmissions, setWeeklySubmissions] = useState([]);
//   const [projectReport, setProjectReport] = useState(null);
//   const [viva, setViva] = useState(null);

//   useEffect(() => {
//     const fetchMarksData = async () => {
//       const token = localStorage.getItem("token");
//       const studentId = localStorage.getItem("studentId");

//       if (!studentId) {
//         console.error("Student ID not found in localStorage.");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/getSubmission/${studentId}`,
//           {
//             headers: {
//               "x-auth-token": token,
//             },
//           }
//         );

//         const data = response.data;
//         setWeeklySubmissions(data.weeklySubmissionData || []);
//         setProjectReport(data.finalProjectReport || null);
//         setViva(data.vivaVoce || null);
//       } catch (error) {
//         console.error("Error fetching marks and comments:", error);
//       }
//     };

//     fetchMarksData();
//   }, []);

//   const formatDate = (dateString) =>
//     dateString ? new Date(dateString).toLocaleDateString() : "N/A";

//   const renderTable = (title, dataArray, isSingleRow = false) => {
//     const isEmpty =
//       !dataArray ||
//       (isSingleRow && Object.keys(dataArray).length === 0) ||
//       (Array.isArray(dataArray) && dataArray.length === 0);

//     if (isEmpty) {
//       return (
//         <Box sx={{ mb: 5 }}>
//           <Typography
//             variant="h6"
//             sx={{
//               mt: 4,
//               mb: 1,
//               fontWeight: "bold",
//               color: "#1976d2",
//               display: "inline-block",
//             }}
//           >
//             {title}
//           </Typography>
//           <Alert severity="info" sx={{ mt: 1 }}>
//             No submission done yet
//           </Alert>
//         </Box>
//       );
//     }

//     return (
//       <Box sx={{ mb: 5 }}>
//         <Typography
//           variant="h6"
//           sx={{
//             mt: 4,
//             mb: 1,
//             fontWeight: "bold",
//             color: "#1976d2",
//             display: "inline-block",
//           }}
//         >
//           {title}
//         </Typography>
//         <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "rgb(73, 150, 231)" }}>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>TYPE</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>DATE</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>MARKS</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>MENTOR COMMENT</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "#fff", textAlign: "center" }}>
//                   <strong>SUBMISSION</strong>
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {isSingleRow
//                 ? renderSubmissionRow(title, dataArray)
//                 : dataArray.map((item, index) =>
//                     renderSubmissionRow(`Week ${index + 1}`, item, index)
//                   )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     );
//   };

//   const renderSubmissionRow = (typeLabel, submission, key = null) => {
//     let maxMarks = 10;
//     if (typeLabel === "Project Report") maxMarks = 30;
//     if (typeLabel === "Viva Voce") maxMarks = 30;

//     return (
//       <TableRow key={key}>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {typeLabel}
//         </TableCell>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {formatDate(submission?.createdAt)}
//         </TableCell>
//         <TableCell
//           sx={{
//             borderRight: "2px solid #ddd",
//             textAlign: "center",
//             fontWeight: 500,
//           }}
//         >
//           {!submission || submission.marks === 0
//             ? "Not graded yet"
//             : `${submission.marks} / ${maxMarks}`}
//         </TableCell>
//         <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
//           {submission?.mentorComment || "No comments yet"}
//         </TableCell>
//         <TableCell sx={{ textAlign: "center" }}>
//           {submission?.submissionType === "link" ? (
//             <a
//               href={submission.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 textDecoration: "underline",
//                 fontWeight: 500,
//               }}
//             >
//               View Link
//             </a>
//           ) : submission?.cloudinaryUrl ? (
//             <a
//               href={submission.cloudinaryUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{
//                 color: "#1976d2",
//                 textDecoration: "underline",
//                 fontWeight: 500,
//               }}
//             >
//               View File
//             </a>
//           ) : (
//             "No submission"
//           )}
//         </TableCell>
//       </TableRow>
//     );
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//         p: 2,
//       }}
//     >
//       <Paper
//         elevation={5}
//         sx={{
//           p: { xs: 2, sm: 4, md: 6 },
//           borderRadius: 3,
//           width: "90%",
//           maxWidth: "1200px",
//           backgroundColor: "#fff",
//         }}
//       >
//         <Typography
//           variant="h5"
//           gutterBottom
//           sx={{
//             textAlign: "center",
//             color: "#1976d2",
//             fontWeight: "bold",
//             mb: 3,
//           }}
//         >
//           MARKS AND FEEDBACK
//         </Typography>

//         {renderTable("Weekly Submissions", weeklySubmissions)}
//         {renderTable("Project Report", projectReport, true)}
//         {renderTable("Viva Voce", viva, true)}
//       </Paper>
//     </Box>
//   );
// };

// export default FeedbackMarks;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import axios from "axios";

const FeedbackMarks = () => {
  const [weeklySubmissions, setWeeklySubmissions] = useState([]);
  const [projectReport, setProjectReport] = useState(null);
  const [viva, setViva] = useState(null);

  useEffect(() => {
    const fetchMarksData = async () => {
      const token = localStorage.getItem("token");
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        console.error("Student ID not found in localStorage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/getSubmission/${studentId}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        const data = response.data;
        setWeeklySubmissions(data.weeklySubmissionData || []);
        setProjectReport(data.finalProjectReport || null);
        setViva(data.vivaVoce || null);
      } catch (error) {
        console.error("Error fetching marks and comments:", error);
      }
    };

    fetchMarksData();
  }, []);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const renderTable = (title, dataArray, isSingleRow = false) => {
    const isEmpty =
      !dataArray ||
      (isSingleRow && Object.keys(dataArray).length === 0) ||
      (Array.isArray(dataArray) && dataArray.length === 0);

    if (isEmpty) {
      return (
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h6"
            sx={{
              mt: 4,
              mb: 1,
              fontWeight: "bold",
              color: "#1976d2",
              display: "inline-block",
            }}
          >
            {title}
          </Typography>
          <Alert severity="info" sx={{ mt: 1 }}>
            No submission done yet
          </Alert>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mt: 4,
            mb: 1,
            fontWeight: "bold",
            color: "#1976d2",
            display: "inline-block",
          }}
        >
          {title}
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgb(73, 150, 231)" }}>
                <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                  <strong>TYPE</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                  <strong>DATE</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                  <strong>MARKS</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                  <strong>MENTOR COMMENT</strong>
                </TableCell>
                <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                  <strong>SUBMISSION</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isSingleRow
                ? renderSubmissionRow(title, dataArray)
                : dataArray.map((item, index) =>
                    renderSubmissionRow(`Week ${index + 1}`, item, index)
                  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderSubmissionRow = (typeLabel, submission, key = null) => {
    let maxMarks = 10;
    if (typeLabel === "Project Report") maxMarks = 30;
    if (typeLabel === "Viva Voce") maxMarks = 30;

    // Determine the correct date field based on submission type
    const submissionDate =
      typeLabel === "Project Report"
        ? submission?.submissionDate
        : submission?.createdAt;

    return (
      <TableRow key={key}>
        <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
          {typeLabel}
        </TableCell>
        <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
          {formatDate(submissionDate)}
        </TableCell>
        <TableCell
          sx={{
            borderRight: "2px solid #ddd",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {!submission || submission.marks === 0
            ? "Not graded yet"
            : `${submission.marks} / ${maxMarks}`}
        </TableCell>
        <TableCell sx={{ borderRight: "2px solid #ddd", textAlign: "center" }}>
          {submission?.mentorComment || "No comments yet"}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {submission?.submissionType === "link" ? (
            <a
              href={submission.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              View Link
            </a>
          ) : submission?.cloudinaryUrl ? (
            <a
              href={submission.cloudinaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              View File
            </a>
          ) : (
            "No submission"
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: { xs: 2, sm: 4, md: 6 },
          borderRadius: 3,
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "#1976d2",
            fontWeight: "bold",
            mb: 3,
          }}
        >
          MARKS AND FEEDBACK
        </Typography>

        {renderTable("Weekly Submissions", weeklySubmissions)}
        {renderTable("Project Report", projectReport, true)}
        {renderTable("Viva Voce", viva, true)}
      </Paper>
    </Box>
  );
};

export default FeedbackMarks;

