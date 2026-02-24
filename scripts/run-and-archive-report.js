#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function timestamp() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

const reportSrc = path.resolve(process.cwd(), 'playwright-report');
const reportsDir = path.resolve(process.cwd(), 'playwright-reports');
const archiveName = `playwright-report-${timestamp()}`;
const dest = path.join(reportsDir, archiveName);
const zipPath = dest + '.zip';

if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

console.log('Running Playwright tests...');
const runner = spawn('npx', ['playwright', 'test'], { stdio: 'inherit', shell: true });

runner.on('exit', (code) => {
  if (code === 0) {
    if (fs.existsSync(reportSrc)) {
      // copy directory
      const copyRecursiveSync = (src, dest) => {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
          if (!fs.existsSync(dest)) fs.mkdirSync(dest);
          fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      };
      copyRecursiveSync(reportSrc, dest);
      console.log('Archived report to', dest);

      // create a zip of the archived report
      try {
        const archiver = require('archiver');
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        output.on('close', () => {
          console.log(`Created zip: ${zipPath} (${archive.pointer()} total bytes)`);
          // optionally send email if SMTP env vars are provided
          sendEmailIfConfigured(zipPath, archiveName);
        });
        archive.on('error', (err) => { throw err; });
        archive.pipe(output);
        archive.directory(dest, false);
        archive.finalize();
      } catch (e) {
        console.warn('Failed to create zip:', e);
      }

      // regenerate index.html in reportsDir
      const entries = fs.readdirSync(reportsDir).filter(name => fs.statSync(path.join(reportsDir, name)).isDirectory());
      entries.sort((a, b) => b.localeCompare(a)); // newest first by name
      const indexHtml = `<!doctype html>
    <html>
    <head><meta charset="utf-8"><title>Playwright Reports</title></head>
    <body>
    <h1>Playwright Reports</h1>
    <ul>
    ${entries.map(e => `  <li><a href="${encodeURI(e)}/index.html">${e}</a></li>`).join('\n')}
    </ul>
    </body>
    </html>`;
      fs.writeFileSync(path.join(reportsDir, 'index.html'), indexHtml, 'utf8');
      console.log('Updated reports index at', path.join(reportsDir, 'index.html'));
    } else {
      console.warn('No playwright-report directory found to archive.');
    }
    process.exit(0);
  } else {
    console.error('Playwright tests exited with code', code);
    process.exit(code);
  }
});

function sendEmailIfConfigured(zipFilePath, runName) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const to = process.env.EMAIL_TO || 'shiharawww@gmail.com';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('SMTP not configured; skipping email send. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS to enable.');
    return;
  }

  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort ? parseInt(smtpPort, 10) : 587,
      secure: smtpPort == 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: smtpUser,
      to,
      subject: `Playwright Test Report - ${runName}`,
      text: `Attached is the Playwright test report for run ${runName}`,
      attachments: [
        { filename: `${runName}.zip`, path: zipFilePath }
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send email:', error);
      } else {
        console.log('Email sent:', info.response || info.messageId);
      }
    });
  } catch (e) {
    console.error('Email send failed due to error:', e);
  }
}
