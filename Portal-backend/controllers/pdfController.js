const PDFDocument = require('pdfkit');
const Project = require('../models/Projectlist');
const cloudinary = require('../utils/cloudinary');
const stream = require('stream');

const generateProjectPDF = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send('Project not found');

    const fileName = `${project.title.replace(/ /g, '_')}_${Date.now()}.pdf`;

    // Create the PDF document in memory
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Convert buffer into a readable stream
      const bufferStream = new stream.PassThrough();
      bufferStream.end(pdfBuffer);

      // Upload to Cloudinary as raw file
      const result = await new Promise((resolve, reject) => {
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'project_overviews',
            public_id: fileName.replace('.pdf', ''),
            use_filename: true,
            type: 'upload',
            access_mode: 'public',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        bufferStream.pipe(cloudinaryStream);
      });

      // Directly use the secure URL from the Cloudinary result
      return res.json({ pdfUrl: result.secure_url });
    });

    // ------- PDF Content Writing Below --------
    doc.fontSize(22).fillColor('#2e86de').text(` ${project.title}`, { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(14).fillColor('#000').text(' Tech Stack', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Frontend: ${project.frontend}`);
    doc.text(`Backend: ${project.backend}`);
    doc.moveDown();

    doc.fontSize(14).text('Project Details', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Overview: ${project.fullDesc.overview}`);
    doc.text(`Technologies: ${project.fullDesc.technologies}`);
    doc.text(`Features: ${project.fullDesc.features}`);
    doc.text(`Objective: ${project.fullDesc.objective}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(1.5);

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

    doc.fontSize(14).fillColor('#34495e').text(' User Flow', { underline: true });
    doc.moveDown();
    doc.fontSize(12).fillColor('#000').text(
      `1. User visits the landing page.\n` +
      `2. Signs up (with exit exam validation if needed) or logs in.\n` +
      `3. Enters dashboard to explore available projects.\n` +
      `4. Selects a project and gets access to detailed materials and submissions page.`
    );
    doc.moveDown();

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

    doc.fontSize(14).fillColor('#34495e').text(' Challenges Faced', { underline: true });
    doc.moveDown();
    doc.fontSize(12).fillColor('#000').text(
      `- Handling role-based access (Admin, Mentor, Student)\n` +
      `- Ensuring mobile responsiveness for all devices\n` +
      `- Real-time updates using sockets (for chat or notifications)\n` +
      `- Ensuring secure file access and upload via keys or tokens`
    );
    doc.moveDown();

    doc.fontSize(14).fillColor('#34495e').text('Future Enhancements', { underline: true });
    doc.moveDown();
    doc.fontSize(12).fillColor('#000').text(
      `- Adding real-time notifications or messaging\n` +
      `- Mentor performance dashboard with analytics\n` +
      `- Export reports in CSV or Excel\n` +
      `- AI support chat for student queries\n` +
      `- PWA support for offline access`
    );

    doc.end();

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

module.exports = { generateProjectPDF };
