# FreeShare: File Sharing Platform
![thumbnail](./public/assets/landingPage-8e480441-9785-40ca-9f26-d2b48cecc688)
## 🗂️ Description

FreeShare is a file sharing platform built with React, Firebase, and Cloud Functions. This project allows users to share files easily and efficiently. It's designed for individuals and teams who need a simple and secure way to share files.

The platform provides a user-friendly interface for uploading, sharing, and managing files. With FreeShare, you can share files with others by generating a unique link, and recipients can access the files without needing to create an account.

## ✨ Key Features

### **File Sharing**
* Upload and share files with others via a unique link
* Supports various file types, including documents, images, and videos

### **Security and Authentication**
* Secure file storage using Firebase Storage
* Authentication and authorization using Firebase Authentication

### **User Interface**
* Responsive and user-friendly interface built with React and Material-UI
* Easy navigation and file management

## 🗂️ Folder Structure

```mermaid
graph TD;
src-->components;
src-->App.test.js;
src-->index.js;
src-->reportWebVitals.js;
src-->setupTests.js;
public-->index.html;
public-->manifest.json;
public-->robots.txt;
functions-->index.js;
functions-->package.json;
```

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232a?logo=react&logoColor=white&style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-ffcb32?logo=firebase&logoColor=white&style=for-the-badge)
![Cloud Functions](https://img.shields.io/badge/Cloud%20Functions-ff69b4?logo=google-cloud&logoColor=white&style=for-the-badge)
![Material-UI](https://img.shields.io/badge/Material--UI-007FFF?logo=mui&logoColor=white&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=white&style=for-the-badge)

## ⚙️ Setup Instructions

To run the project locally, follow these steps:

* Git clone the repository: `https://github.com/Varshithvhegde/FreeShare.git`
* Install dependencies: `npm install`
* Start the development server: `npm start`
* Open `http://localhost:3000` in your browser to access the application

## 📈 GitHub Actions

The project uses a GitHub Actions workflow to automate tasks. However, the current workflow configuration (`jekyll-gh-pages.yml`) appears to be a leftover and is not used in this project.

## 📁 Configuration Files

The project uses several configuration files:

* `.firebaserc`: Firebase configuration file
* `firebase.json`: Firebase Cloud Functions configuration file
* `.github/workflows/jekyll-gh-pages.yml`: GitHub Actions workflow configuration file (not used)
* `.gitignore`: Git ignore file
* `functions/.gitignore`: Git ignore file for Cloud Functions
* `functions/.eslintrc.js`: ESLint configuration file for Cloud Functions
* `package.json`: Project dependencies and scripts
* `functions/package.json`: Cloud Functions dependencies and scripts



<br><br>
<div align="center">
<img src="https://avatars.githubusercontent.com/u/80502833?v=4" width="120" />
<h3>Varshith V Hegde</h3>
<p>A programmer fond of learning</p>
</div>
<br>
<p align="right">
<img src="https://gitfull.vercel.app/appLogo.png" width="20"/>  <a href="https://gitfull.vercel.app">Made by GitFull</a>
</p>
    