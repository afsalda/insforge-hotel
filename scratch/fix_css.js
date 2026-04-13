const fs = require('fs');
const path = 'c:\\Users\\M S I\\Downloads\\final hotel\\client\\src\\index.css';
let content = fs.readFileSync(path, 'utf8');

// The file has a mess around the calendar and modal styles now.
// I'll try a rougher search and replace.

const searchBrokenSection = `.price-row.underline span:first-child {
  text-decoration: underline;
}

  font-size: 1.1rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
}`;

const restoreOriginalsPlusCorrectCalendar = content => {
  // Let's just find the custom calendar section and fix it properly.
  // And fix the broken part around 2945.
  
  // Since the file is a mess, I'll look for recognizable anchoring points.
  
  // 1. Fix the broken part at line 2940 roughly.
  // Find where .price-row is.
  content = content.replace(/\.price-row \{\n  display: flex;\n  justify-content: space-between;\n  color: #222;\n\}/g, 
`.price-row {
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
}`);

  // 2. Fix the calendar selected style.
  // Look for .calendar-day.selected
  content = content.replace(/\.calendar-day\.selected \{[\s\S]*?\}/g, 
`.calendar-day.selected {
  background: #C9A96E !important;
  color: #FFFFFF !important;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(201, 169, 110, 0.4);
  transform: scale(1.05);
}`);

  return content;
};

const newContent = restoreOriginalsPlusCorrectCalendar(content);
fs.writeFileSync(path, newContent, 'utf8');
console.log('Fixed index.css');
