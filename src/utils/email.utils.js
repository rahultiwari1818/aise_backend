export const hostelAllocationUpdateBody = (
  name,
  email,
  status,
  roomNumber,
  fromDate,
  toDate
) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>AISE 2026 Hostel Allocation Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color:#f4f4f4; margin:0; padding:0;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" 
        style="background-color:#ffffff; padding:20px; border-radius:8px;">
        
        <!-- Logo -->
        <tr>
          <td style="text-align:center; padding-bottom:15px;">
            <img src="https://aise.daiict.ac.in/logo.png" alt="AISE Logo" style="max-height:80px;"/>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="text-align:center; padding-bottom:20px;">
            <h2 style="color:#2c3e50; margin:0;">🏨 Hostel Allocation Update</h2>
            <p style="color:#7f8c8d; margin:5px 0 0;">AISE 2026</p>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:15px 0; color:#2c3e50; font-size:16px;">
            Dear <strong>${name}</strong>,<br><br>
            This is to notify you about a change in your hostel allocation for <strong>AISE 2026</strong>.
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="background-color:#f9f9f9; padding:15px; border-radius:6px; margin-top:10px;">
            <p style="margin:0; font-size:15px; color:#2c3e50;">
              <strong>Allocation Status:</strong> <span style="color:${status === "Approved" ? "green" : "red"};">${status}</span>
            </p>
            ${
              roomNumber
                ? `<p style="margin:10px 0 0; font-size:15px; color:#2c3e50;">
                  <strong>Room Number:</strong> ${roomNumber}
                </p>`
                : ""
            }
            ${
              fromDate && toDate
                ? `<p style="margin:10px 0 0; font-size:15px; color:#2c3e50;">
                  <strong>Stay Duration:</strong> ${fromDate} to ${toDate}
                </p>`
                : ""
            }
            <p style="margin:10px 0 0; font-size:15px; color:#2c3e50;">
              <strong>Registered Email:</strong> ${email}
            </p>
          </td>
        </tr>

        <!-- Website CTA -->
        <tr>
          <td style="padding-top:25px; text-align:center;">
            <a href="https://aise.daiict.ac.in/" 
              style="background-color:#3498db; color:#fff; padding:12px 24px; 
              border-radius:4px; text-decoration:none; font-weight:bold; font-size:15px;">
              Visit AISE 2026 Website
            </a>
          </td>
        </tr>

        <!-- Contact Info -->
        <tr>
          <td style="padding-top:30px; font-size:14px; color:#2c3e50;">
            <strong>Contact Information (For Queries):</strong><br/><br/>
            📌 <strong>Saurabh Tiwari</strong><br/>
            Email: <a href="mailto:saurabh_t@dau.ac.in">saurabh_t@dau.ac.in</a><br/>
            Phone: +91 82240 09398<br/><br/>

            📌 <strong>Yash Agrawal</strong><br/>
            Email: <a href="mailto:yash_agrawal@dau.ac.in">yash_agrawal@dau.ac.in</a><br/>
            Phone: +91 98821 14669<br/><br/>

            ⚠️ <em>Please do not reply directly to this email, as mails to this inbox are not attended. For any query, kindly contact the persons above.</em>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:30px; font-size:12px; color:#7f8c8d; text-align:center;">
            &copy; ${new Date().getFullYear()} AISE 2026. All Rights Reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
