#!/bin/bash
find "/Volumes/Disk 1Tb/DesarrollosODOO/extra-addons/odoo-llm" -name "*.xml" -print0 | while IFS= read -r -d '' f; do
    echo "Processing $f"
    sed -i '' 's/<group string="Group By">/<group>/g' "$f"
    sed -i '' 's/expand="0"//g' "$f"
    sed -i '' 's/widget="json_editor"//g' "$f"
    sed -i '' 's/invisible="1"/column_invisible="True"/g' "$f"
done
