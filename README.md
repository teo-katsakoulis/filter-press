# Commento Comment Filter

A Chrome extension to improve readability of Commento comment threads by blocking comments from specific users and filtering excessively long comments (often bots). Users can customize blocked usernames and set a maximum comment character length threshold.

---

## Features

- Block comments by username.
- Filter and hide comments exceeding a configurable character length.
- Show summary placeholders for hidden comments, indicating how many comments were blocked.
- Dynamic filtering without needing to reload the page.
- Simple and clean popup UI for managing blocked users and comment length threshold.

---

## Installation

1. Clone this repository or download the ZIP.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle top right).
4. Click **Load unpacked** and select the extension folder.
5. The extension icon will appear near the address bar.

---

## Usage

- Click the extension icon to open the popup.
- Add usernames to block their comments.
- Adjust the maximum comment character length to filter large comments (default is 5000).
- Changes apply immediately to comment threads using Commento.

---

## Development

- `manifest.json`: Chrome extension manifest (v3).
- `content.js`: Content script to filter comments on page load and on changes.
- `popup.html` & `popup.js`: Popup UI and logic for managing filters.
- `css/`: Styles for popup and content script.
- `icons/`: Extension icons.

---

## Contributing

Feel free to fork and submit pull requests. Please keep changes focused on improving usability and compatibility.

---

## Privacy

This extension runs locally in the browser, does not collect or transmit any personal data, and only enhances comment readability.

---

## License

MIT License

---

*Created by Theofilos Katsakoulis*
