#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Handlebars Templates Verification Script"
echo "=========================================="
echo ""

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        return 1
    fi
}

# Function to count files
count_files() {
    local count=$(find $1 -type f | wc -l)
    echo -e "${YELLOW}→${NC} Found $count files in $1"
}

echo "1. Checking template directories..."
echo "-----------------------------------"
for dir in common simple structured enterprise; do
    if [ -d "src/templates/hbs/$dir" ]; then
        echo -e "${GREEN}✓${NC} Directory exists: src/templates/hbs/$dir"
        count_files "src/templates/hbs/$dir"
    else
        echo -e "${RED}✗${NC} Missing directory: src/templates/hbs/$dir"
    fi
done
echo ""

echo "2. Checking key template files..."
echo "-----------------------------------"
check_file "src/templates/hbs/common/gitignore.hbs"
check_file "src/templates/hbs/common/requirements.hbs"
check_file "src/templates/hbs/simple/main.hbs"
check_file "src/templates/hbs/structured/main.hbs"
check_file "src/templates/hbs/enterprise/main.hbs"
check_file "src/templates/hbs/enterprise/config.hbs"
echo ""

echo "3. Checking JavaScript files..."
echo "-----------------------------------"
check_file "src/utils/templateLoader.js"
check_file "src/templates/templates.js"
check_file "src/templates/enterpriseTemplates.js"
check_file "src/utils/generator.js"
echo ""

echo "4. Checking dependencies..."
echo "-----------------------------------"
if grep -q '"handlebars"' package.json; then
    echo -e "${GREEN}✓${NC} Handlebars dependency found in package.json"
    VERSION=$(grep -A 1 '"handlebars"' package.json | grep -o '"[^"]*"' | tail -1 | tr -d '"')
    echo -e "  Version: $VERSION"
else
    echo -e "${RED}✗${NC} Handlebars dependency missing in package.json"
fi
echo ""

echo "5. Counting template files..."
echo "-----------------------------------"
TOTAL=$(find src/templates/hbs -name "*.hbs" -type f | wc -l)
echo -e "${YELLOW}→${NC} Total .hbs files: $TOTAL"
if [ $TOTAL -eq 31 ]; then
    echo -e "${GREEN}✓${NC} Correct number of template files (expected: 31)"
else
    echo -e "${RED}✗${NC} Unexpected number of template files (expected: 31, found: $TOTAL)"
fi
echo ""

echo "6. Checking if node_modules exists..."
echo "-----------------------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
    if [ -d "node_modules/handlebars" ]; then
        echo -e "${GREEN}✓${NC} Handlebars is installed"
    else
        echo -e "${YELLOW}!${NC} Handlebars not found in node_modules"
        echo -e "  Run: npm install"
    fi
else
    echo -e "${YELLOW}!${NC} node_modules not found"
    echo -e "  Run: npm install"
fi
echo ""

echo "=========================================="
echo "Verification Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run build"
echo "3. Run: npm run dev"
echo "4. See TESTING.md for full testing guide"
echo ""
