# sanbercode-qa-quiz3
# QUIZ 3 – Cypress Automation Testing

## Project Name
OrangeHRM – Login Feature Automation Test

---

## 📌 Description
Project ini merupakan automation testing menggunakan **Cypress** untuk menguji fitur **Login** pada website OrangeHRM.

Tujuan project ini:
- Menggunakan `it block` dalam penulisan test
- Mengimplementasikan minimal 5 test case
- Semua test case harus dalam status **PASSED**
- Penulisan kode dibuat rapi dan terstruktur

Website yang diuji:  
https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

---

## 🛠 Tools & Technology
- Cypress
- JavaScript
- Node.js

---

## 📂 Project Structure
cypress/
├── e2e/
│ └── login/
│ └── login.cy.js
├── fixtures/
│ └── loginData.json
├── support/
│ ├── commands.js
│ └── e2e.js
├── screenshots/
├── videos/
├── reports/
cypress.config.js
package.json
README.md


---

## ▶️ How To Run

Install dependencies:
npm install

Run Cypress using UI:
npx cypress open

Run Cypress in headless mode:
npx cypress run

✅ Test Result
All test cases executed successfully and PASSED ✅

🔗 GitHub Repository Link
https://github.com/saydova/sanbercode-qa-quiz3
