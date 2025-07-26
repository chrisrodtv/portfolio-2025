// studio/b2.js

const { exec } = require('child_process');
const path = require('path');

function uploadToBackblaze(localPath, remotePath) {
  return new Promise((resolve, reject) => {
    const command = `rclone copy "${localPath}" b2:portfolio-2025/${remotePath} --progress`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Upload error: ${stderr}`);
        reject(stderr);
      } else {
        const publicUrl = `https://portfolio-2025-4ub.pages.dev/${remotePath}`;
        resolve(publicUrl);
      }
    });
  });
}

module.exports = {
  uploadToBackblaze
};
