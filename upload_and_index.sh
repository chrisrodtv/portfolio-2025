#!/bin/zsh

# === CONFIGURATION ===
LOCAL_ROOT="/Users/chrisrodriguez/Documents/GitHub/portfolio-2025/assets/media/projects"
REMOTE_ROOT="backblaze-b2:portfolio-2025/assets/media/projects"
PUBLIC_URL_BASE="https://portfolio-2025.s3.eu-central-003.backblazeb2.com/assets/media/projects"
INDEX_HTML="/Users/chrisrodriguez/Documents/GitHub/portfolio-2025/media_urls.html"
LOGFILE="/tmp/rclone_upload_log.txt"
UPLOADED_LIST="/tmp/uploaded_files.txt"

# Reset logs
echo "" > "$LOGFILE"
echo "" > "$UPLOADED_LIST"

echo "🚀 Starting media sync..."

# Ensure index file exists
touch "$INDEX_HTML"

# Gather files into a normal array (compatible with zsh)
FILES=()
while IFS= read -r -d '' file; do
  FILES+=("$file")
done < <(find "$LOCAL_ROOT" -type f \( -iname "*.mp4" -o -iname "*.mov" -o -iname "*.jpg" -o -iname "*.png" -o -iname "*.gif" \) -print0)

# Upload loop
for FILE in "${FILES[@]}"; do
    RELATIVE_PATH="${FILE#$LOCAL_ROOT/}"
    DEST_PATH="$REMOTE_ROOT/$(dirname "$RELATIVE_PATH")"
    PUBLIC_PATH="$PUBLIC_URL_BASE/$RELATIVE_PATH"

    echo "🔄 Uploading: $RELATIVE_PATH" | tee -a "$LOGFILE"

    # Retry up to 3 times
    for i in {1..3}; do
        rclone copy "$FILE" "$DEST_PATH" --progress --transfers=1 >> "$LOGFILE" 2>&1 && break
        echo "⚠️ Retry #$i for: $RELATIVE_PATH" | tee -a "$LOGFILE"
        sleep 2
    done

    # Verify upload success
    if rclone ls "$DEST_PATH" | grep -q "$(basename "$FILE")"; then
        echo "✅ Uploaded: $RELATIVE_PATH" | tee -a "$LOGFILE"

        # Append to HTML if not already present
        if ! grep -q "$PUBLIC_PATH" "$INDEX_HTML"; then
            echo "<a href=\"$PUBLIC_PATH\" target=\"_blank\">$RELATIVE_PATH</a><br>" >> "$INDEX_HTML"
        fi

        echo "$FILE" >> "$UPLOADED_LIST"
    else
        echo "❌ FINAL FAIL: $RELATIVE_PATH" | tee -a "$LOGFILE"
    fi
done

# Now delete all uploaded files
echo "🗑️ Deleting uploaded files..."
while read -r FILE; do
    if [[ -f "$FILE" ]]; then
        rm "$FILE"
        echo "🗑️ Deleted: $FILE"
    fi
done < "$UPLOADED_LIST"

echo "✅ Media sync complete."
