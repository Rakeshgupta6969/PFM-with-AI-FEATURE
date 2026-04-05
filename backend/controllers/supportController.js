import Issue from '../models/Issue.js';
import Feedback from '../models/Feedback.js';
import nodemailer from 'nodemailer';

// Configure nodemailer (User will need to update .env with actual credentials)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer verification failed:', error.message);
  } else {
    console.log('Nodemailer: Server is ready to send emails');
  }
});

export const reportIssue = async (req, res) => {
  try {
    const { name, email, contactNumber, description } = req.body;
    const userId = req.user._id; // Assuming user is authenticated

    if (!name || !email || !contactNumber || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure email matches logged-in user
    if (email !== req.user.email) {
      return res.status(400).json({ message: 'User should be logged in with the same credential' });
    }

    // Save to Database
    const newIssue = new Issue({
      userId,
      name,
      email,
      contactNumber,
      description
    });

    await newIssue.save();

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'rakeshgupta6834@gmail.com',
      subject: `New Issue Reported: ${name}`,
      text: `
        New support request received:
        Name: ${name}
        Email: ${email}
        Contact Number: ${contactNumber}
        Issue Description: ${description}
        User ID: ${userId}
        Reported At: ${new Date().toLocaleString()}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Issue Support Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Contact Number:</strong> ${contactNumber}</p>
          <p><strong>Description:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${description}</div>
          <hr />
          <p style="font-size: 0.8em; color: #666;">User ID: ${userId}</p>
          <p style="font-size: 0.8em; color: #666;">Reported At: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    // We use a try-catch for email sending so it doesn't fail the whole request if email config is missing
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // We still return success as it's saved in the DB
    }

    res.status(201).json({ 
      message: 'Issue reported successfully. We will get back to you soon!',
      issue: newIssue 
    });

  } catch (error) {
    console.error('Report issue error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { _id: userId, name } = req.user;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const newFeedback = new Feedback({
      userId,
      name,
      rating,
      comment
    });

    await newFeedback.save();

    res.status(201).json({ 
      message: 'Thank you for your feedback!',
      feedback: newFeedback 
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Fetch feedback error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
