const fs = require('fs');
const path = require('path');

// Categories
const CAT = {
    CONSTRUCTION: "Construction & Building",
    ELECTRICAL: "Electrical, Gas & Renewables",
    FINANCE: "Finance & Legal",
    TECH: "Technology & Digital",
    PROPERTY: "Property, Cleaning & Maintenance",
    HEALTH: "Health & Wellbeing",
    RECRUITMENT: "Recruitment & HR",
    ESTATE: "Estate Agency & Property Services",
    OTHER: "Other Services"
};

// Keyword Mapping
const K = [
    { cat: CAT.ELECTRICAL, keys: ['electric', 'solar', 'energy', 'heating', 'plumbing', 'gas', 'boiler', 'renewables', 'utility'] },
    { cat: CAT.CONSTRUCTION, keys: ['joiner', 'build', 'roof', 'construct', 'brick', 'stone', 'architect', 'plaster', 'render', 'glaz', 'weld', 'fabricat', 'timber', 'fenc', 'sawmill', 'loft', 'damp', 'preservation', 'scaffold', 'taping', 'decor'] },
    { cat: CAT.FINANCE, keys: ['account', 'finance', 'mortgage', 'tax', 'wealth', 'invest', 'insurance', 'legal', 'solicitor', 'lawyer', 'bookkeep', 'lending', 'money'] },
    { cat: CAT.TECH, keys: ['digital', 'web', 'software', 'app', 'it ', 'telecom', 'computer', 'print', 'ai ', 'design', 'marketing', 'seo', 'media', 'video', 'photo', 'content'] },
    { cat: CAT.PROPERTY, keys: ['clean', 'garden', 'landscape', 'pest', 'waste', 'remov', 'valet', 'facility', 'maintenance', 'security', 'locksmith'] },
    { cat: CAT.RECRUITMENT, keys: ['recruit', 'staff', 'hr ', 'personnel', 'job'] },
    { cat: CAT.ESTATE, keys: ['estate', 'letting', 'property management', 'surveyor'] },
    { cat: CAT.HEALTH, keys: ['fitness', 'gym', 'therapy', 'coach', 'health', 'medical', 'wellbeing', 'mindful', 'hyrox'] },
    { cat: CAT.OTHER, keys: ['travel', 'car', 'hotel', 'bar', 'restaurant', 'food', 'entertainment', 'shop', 'retail', 'training', 'mechanic', 'garage', 'music'] }
];

function categorize(trade, company) {
    const text = (trade + ' ' + company).toLowerCase();

    for (const rule of K) {
        for (const key of rule.keys) {
            if (text.includes(key)) return rule.cat;
        }
    }
    return CAT.OTHER;
}

// Read CSV
const csvPath = path.join(process.cwd(), 'members.csv');
const rawData = fs.readFileSync(csvPath, 'utf8');

const lines = rawData.split('\n');

// Skip first 2 lines (Header junk: "Member Directory...", "Name, Company...")
// Real data starts at line 3 (index 2)
// Wait, looking at view_file output:
// Line 1: ,Member Direcory...
// Line 2: Name ,Company ...
// Line 3: Connor Wright...
const dataLines = lines.slice(2);

const sqlStatements = [];

console.log(`Processing ${dataLines.length} rows...`);

dataLines.forEach((line, index) => {
    if (!line.trim()) return;

    // Regex to split by comma, ignoring commas in quotes
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    // Actually, a better regex for CSV splitting:
    // (?:^|,)(?=[^"]|(")?)"?((?(1)[^"]*|[^,"]*))"?(?=,|$)
    // Let's use a simpler safe split if possible, or a proper parser. 
    // Given the environment, I'll use a robust split function.

    const parseCSVLine = (str) => {
        const arr = [];
        let quote = false;
        let col = '';
        for (let c of str) {
            if (c === '"') { quote = !quote; continue; }
            if (c === ',' && !quote) { arr.push(col.trim()); col = ''; continue; }
            col += c;
        }
        arr.push(col.trim());
        return arr;
    };

    const cols = parseCSVLine(line);

    // Columns: 0:Name, 1:Company, 2:Trade, 3:Phone, 4:Email, 5:Website, 6:Joined
    if (cols.length < 3) return;

    let [name, company, trade, phone, email, website, joined] = cols;

    // Clean Name
    name = name || 'Unknown Member';
    const nameParts = name.trim().split(' ');
    const firstName = nameParts.shift();
    const lastName = nameParts.join(' ') || '';

    // Clean Email (take first if multiple)
    if (email && email.includes(',')) email = email.split(',')[0].trim();

    // Clean Website (take first)
    if (website && website.includes(',')) website = website.split(',')[0].trim();
    if (website && !website.startsWith('http')) website = 'https://' + website;
    if (website === 'TBC' || website === 'N/A') website = '';

    // Clean Phone
    if (phone === 'N/A') phone = '';

    // Categorize
    const category = categorize(trade || '', company || '');

    // Escape SQL
    const escape = (str) => str ? `'${str.replace(/'/g, "''")}'` : 'NULL';

    // Check if email is valid-ish
    if ((!email || email.length < 3) && (!company || company.length < 2)) return; // Skip empty rows

    // Clean joined date
    const parseDate = (dateStr) => {
        if (!dateStr || dateStr.trim() === '') return new Date().toISOString();
        const parts = dateStr.trim().split(' ');
        if (parts.length === 2) {
            const months = {
                'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
                'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
            };
            const month = months[parts[0]];
            const year = parts[1];
            if (month && year) {
                return `${year}-${month}-01`;
            }
        }
        return new Date().toISOString();
    };

    const isoJoined = parseDate(joined);

    const sql = `
    INSERT INTO members (member_id, first_name, last_name, company, trade, phone, email, website, location, category, status, join_date)
    VALUES (
        gen_random_uuid(),
        ${escape(firstName)},
        ${escape(lastName)},
        ${escape(company)},
        ${escape(trade)},
        ${escape(phone)},
        ${escape(email)},
        ${escape(website)},
        'Edinburgh', -- Default location as most are Edinburgh/Glasgow based
        ${escape(category)},
        'Active',
        ${escape(isoJoined)}
    );`;

    sqlStatements.push(sql);
});

// Output
console.log(`Generated ${sqlStatements.length} statements.`);

fs.writeFileSync('seed_members.sql', sqlStatements.join('\n'));
console.log('Saved to seed_members.sql');
