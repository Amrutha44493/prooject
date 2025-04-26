const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Project = require('../models/Projectlist');
const cloudinary = require('../utils/cloudinary');

const generateProjectPDF = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send('Project not found');
    
    // Creates a new folder for storing the PDF 
    const fileName = `${project.title.replace(/ /g, '_')}_${Date.now()}.pdf`;
    const pdfsDir = path.join(__dirname, '../pdfs');
    const filePath = path.join(pdfsDir, fileName);

    // Creates a new folder for storing the PDF 
    if (!fs.existsSync(pdfsDir)) fs.mkdirSync(pdfsDir);

    // Creates a PDF with that project’s details using pdfkit
    await new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
       
      // PDF Content Section 

        // Header - Project Title
        doc.fontSize(22).fillColor('#2e86de').text(` ${project.title}`, { align: 'center' });
        doc.moveDown(1.5);

        // Section: Tech Stack
        doc.fontSize(14).fillColor('#000').text(' Tech Stack', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Frontend: ${project.frontend}`);
        doc.text(`Backend: ${project.backend}`);
        doc.moveDown();

        // Section: Description
        doc.fontSize(14).text('Project Details', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Overview: ${project.fullDesc.overview}`);
        doc.text(`Technologies: ${project.fullDesc.technologies}`);
        doc.text(`Features: ${project.fullDesc.features}`);
        doc.text(`Objective: ${project.fullDesc.objective}`);
        doc.moveDown();

        // Divider Line
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();
        doc.moveDown(1.5);

        // Common Sections 

        // Frontend Architecture
        doc.fontSize(14).fillColor('#34495e').text('Frontend Architecture', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#000').text(
        `Component-based architecture using React.\n` +
        `- Pages: Home, Login, Signup, Dashboard, Project View\n` +
        `- Components: Header, Footer, Card, Accordion, Tabs, Sidebar, etc.\n` +
        `- Routing handled with React Router\n` +
        `- State Management via Context API or Redux depending on scale`
        );
        doc.moveDown();

        // User Flow
        doc.fontSize(14).fillColor('#34495e').text(' User Flow', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#000').text(
        `1. User visits the landing page.\n` +
        `2. Signs up (with exit exam validation if needed) or logs in.\n` +
        `3. Enters dashboard to explore available projects.\n` +
        `4. Selects a project and gets access to detailed materials and submissions page.`
        );
        doc.moveDown();

        // Deployment Details
        doc.fontSize(14).fillColor('#34495e').text('Deployment Details', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#000').text(
        `- Frontend deployed on Vercel (or Netlify)\n` +
        `- Backend deployed on Render (or Railway)\n` +
        `- Database managed using MongoDB Atlas\n` +
        `- Assets like PDFs uploaded to Cloudinary\n` +
        `- GitHub used for version control and CI/CD pipelines`
        );
        doc.moveDown();

        // Challenges Faced
        doc.fontSize(14).fillColor('#34495e').text(' Challenges Faced', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#000').text(
        `- Handling role-based access (Admin, Mentor, Student)\n` +
        `- Ensuring mobile responsiveness for all devices\n` +
        `- Real-time updates using sockets (for chat or notifications)\n` +
        `- Ensuring secure file access and upload via keys or tokens`
        );
        doc.moveDown();

        // Future Enhancements
        doc.fontSize(14).fillColor('#34495e').text('Future Enhancements', { underline: true });
        doc.moveDown();
        doc.fontSize(12).fillColor('#000').text(
        `- Adding real-time notifications or messaging\n` +
        `- Mentor performance dashboard with analytics\n` +
        `- Export reports in CSV or Excel\n` +
        `- AI support chat for student queries\n` +
        `- PWA support for offline access`
        );
        doc.moveDown(2);

       
        doc.end();


      // Saves the generated PDF temporarily to the local `pdfs/` folder
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Check the size of the PDF file
    // const stats = fs.statSync(filePath);

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'raw',
        folder: 'project_overviews',
        public_id: fileName.replace('.pdf', ''),
        use_filename: true,
        type: 'upload',
        access_mode: 'public',
      });
      
   
      
    // Delete local file after uploading to Cloudinary
    fs.unlinkSync(filePath);
    
    //  Deletes the `pdfs` folder if it's empty
    if (fs.existsSync(pdfsDir) && fs.readdirSync(pdfsDir).length === 0) {
      fs.rmdirSync(pdfsDir);
    }
    

    //Constructs a downloadable link from Cloudinary
    const downloadUrl = cloudinary.url(result.public_id, {
        resource_type: 'raw',
        type: 'upload', 
        attachment: true, 
      });
     

    //  Sends the download URL in the response
    return res.json({ pdfUrl: downloadUrl });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send('Something went wrong.');
  }
};

module.exports = { generateProjectPDF };
