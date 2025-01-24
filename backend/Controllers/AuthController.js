const UserModel = require("../Models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const transporter = require('../Controllers/mailer'); // Import mailer configuration


// Signup function
Const signup = async (req, res) => {
    Try {
        Let { name, surname, email, password, address, mobile, dob, role } = req.body;

        // Default role as “user” if not provided
        Role = role || “user”;

        // Check if the user already exists
        Const user = await UserModel.findOne({ email });
        If (user) {
            Return res.status(409).json({ message: “User already exists…”, success: false });
        }

        // Create and save the new user
        Const userModel = new UserModel({ name, surname, email, password, address, mobile, dob, role });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();

        // Send success response
        Res.status(201).json({ message: “Signup successfully”, success: true });

        // Function to send signup email
        Const sendSignupEmail = async (user) => {
            Const signupEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Signup Confirmation</title>
                <style>
                    Body {
                        Padding: 25px;
                        Font-family: Arial, sans-serif;
                        Background-color: rgb(255, 228, 208);
                        Color: rgb(44, 44, 44);
                        Line-height: 1.6;
                    }
                    H1, h3 {
                        Color: rgb(72, 37, 11);
                    }
                    P {
                        Margin: 10px 0;
                    }
                    Table {
                        Border-collapse: collapse;
                        Width: 100%;
                        Margin: 20px 0;
                        Background-color: #fff;
                        Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    Th, td {
                        Padding: 12px;
                        Text-align: left;
                        Border: 1px solid rgb(77, 77, 77);
                    }
                    Th {
                        Background-color: rgb(72, 37, 11);
                        Color: white;
                    }
                    Strong {
                        Color: rgb(72, 37, 11);
                    }
                    Footer {
                        Margin-top: 20px;
                        Font-size: 0.9em;
                        Color: rgb(77, 77, 77);
                        Text-align: center;
                    }
                    A {
                        Color: rgb(72, 37, 11);
                    }
                </style>
            </head>
            <body>
                <h1>Welcome to RITUAL CAKES!</h1>
                <p>Dear <strong>${user.name}</strong>,</p>
                <p>Thank you for signing up at RITUAL CAKES. We are thrilled to have you on board!</p>
                <h3>Your Details:</h3>
                <table>
                    <tbody>
                        <tr>
                            <td><strong>Name:</strong></td>
                            <td>${user.name} ${user.surname}</td>
                        </tr>
                        <tr>
                            <td><strong>Email:</strong></td>
                            <td>${user.email}</td>
                        </tr>
                        <tr>
                            <td><strong>Address:</strong></td>
                            <td>${user.address}</td>
                        </tr>
                        <tr>
                            <td><strong>Mobile:</strong></td>
                            <td>${user.mobile}</td>
                        </tr>
                        <tr>
                            <td><strong>Date of Birth:</strong></td>
                            <td>${new Date(user.dob).toDateString()}</td>
                        </tr>
                    </tbody>
                </table>
                <p>If you have any questions, feel free to <a href=mailto:support@ritualcakes.com>contact us</a>.</p>
                <footer>
                    <p>Sincerely,<br>The RITUAL CAKES Team</p>
                    <p>&copy; ${new Date().getFullYear()} RITUAL CAKES. All rights reserved.</p>
                </footer>
            </body>
            </html>
            `;

            // Email options for the user
            Const mailOptionsUser = {
                From: ‘ritualcakes2019@gmail.com’,
                To: user.email,
                Subject: `Welcome to RITUAL CAKES`,
                Html: signupEmailHtml,
            };

            // Email options for the admin
            Const mailOptionsAdmin = {
                From: ‘ritualcakes2019@gmail.com’,
                To: ‘ritualcakes2019@gmail.com’,
                Subject: `New SIGN UP FROM ${user.email}`,
                Html: signupEmailHtml,
            };

            // Send email to user
            Try {
                Await transporter.sendMail(mailOptionsUser);
                Console.log(‘Email sent to user successfully’);
            } catch (error) {
                Console.error(‘Error sending email to user:’, error.message);
            }

            // Send email to admin
            Try {
                Await transporter.sendMail(mailOptionsAdmin);
                Console.log(‘Email sent to admin successfully’);
            } catch (error) {
                Console.error(‘Error sending email to admin:’, error.message);
            }
        };

        // Call the email function
        Await sendSignupEmail(userModel);

    } catch (err) {
        Res.status(500).json({ message: “Internal server error”, success: false });
        Console.error(‘Signup error:’, err.message);
    }
};

// Login function with enhancements
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required.", success: false });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Invalid credentials.", success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Invalid credentials.", success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1w" }
        );

        res.status(200).json({
            message: "Login successfully",
            success: true,
            token: jwtToken,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get user by email (from token)
const getUserByEmail = async (req, res) => {
    const token = req.headers.authorization; // Correctly extract token

    if (!token) {
        return res.status(403).json({ message: "No token provided", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({
            success: true,
            name: user.name,
            surname: user.surname,
            email: user.email,
            mobile: user.mobile,
            dob: user.dob,
            address: user.address,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


module.exports = {
    signup,
    login,
    getUserByEmail,
};
