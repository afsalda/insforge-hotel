const fs = require('fs');
const path = 'c:\\Users\\M S I\\Downloads\\final hotel\\client\\src\\index.css';
let content = fs.readFileSync(path, 'utf8');

// The marker before the mess.
const BEFORE_MESS = `.no-charge {
  text-align: center;
  font-size: 0.85rem;
  color: #717171;
  margin: 16px 0;
}`;

// The marker after the mess.
const AFTER_MESS = `/* Custom Calendar Styles */`;

const startIdx = content.indexOf(BEFORE_MESS);
const endIdx = content.indexOf(AFTER_MESS);

if (startIdx !== -1 && endIdx !== -1) {
    const head = content.substring(0, startIdx + BEFORE_MESS.length);
    const tail = content.substring(endIdx);
    
    const recoveryContent = `

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  color: #222;
}

.price-row.underline span:first-child {
  text-decoration: underline;
}

.price-total {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  padding-top: 24px;
  border-top: 1px solid #EBEBEB;
}

.detail-bottom-bar {
  display: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #EBEBEB;
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
}

.modal-summary {
  display: flex;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #EBEBEB;
  margin-bottom: 24px;
}

.modal-summary img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #B0B0B0;
  border-radius: 8px;
  font-size: 1rem;
}

`;

    fs.writeFileSync(path, head + recoveryContent + tail, 'utf8');
    console.log('REPAIRED index.css partially.');
} else {
    console.log('Markers not found', {startIdx, endIdx});
}

// Now fix the calendar selected style in the tail.
content = fs.readFileSync(path, 'utf8');
const oldSelected = /\.calendar-day\.selected \{[\s\S]*?\}/g;
const newSelected = `.calendar-day.selected {
  background: var(--accent-gold) !important;
  color: #FFFFFF !important;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(201, 169, 110, 0.4);
  transform: scale(1.05);
}`;

fs.writeFileSync(path, content.replace(oldSelected, newSelected), 'utf8');
console.log('FIXED calendar selected style.');
