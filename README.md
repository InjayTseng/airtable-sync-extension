# AirFlow - Airtable Record Fetcher

A powerful Chrome extension that streamlines access to your Airtable records. View, copy, and access URLs from your most recent records with just one click.

## Features
- Real-time access to your most recent Airtable records
- Automatic 30-minute background sync
- One-click copy functionality
- Direct URL access with a single click
- Clean, minimal interface
- Secure credential storage

## Setup Guide

### 1. Airtable Configuration

#### Required Fields
Your Airtable base must have these fields:
- `Name`: The main content field
- `Last Modified Time`: Automatically managed by Airtable
- `URL` (optional): For linking to external content

#### Getting Your Airtable API Key
1. Log in to your [Airtable account](https://airtable.com/account)
2. Go to "Account Overview"
3. Under "API" section, click "Generate API key"
4. Copy your API key (it starts with 'pat.')

#### Finding Your Base ID
1. Go to your Airtable base
2. Click "Help" → "API Documentation"
3. In the API documentation, find "The ID of this base is ..." (starts with 'app')
4. Copy the Base ID

#### Getting Your Table Name
1. Open your Airtable base
2. Look at the name of the table you want to sync (usually at the bottom tabs)
3. Copy the exact table name (case-sensitive)

### 2. Extension Installation

1. Install from Chrome Web Store:
   - Visit [AirFlow on Chrome Web Store]()
   - Click "Add to Chrome"
   - Click "Add Extension" in the popup

2. Manual Installation (Developer Mode):
   - Download this repository
   - Open Chrome → Extensions
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension folder

### 3. Extension Configuration

1. Click the AirFlow icon in Chrome toolbar
2. Click the settings icon (⚙️)
3. Enter your:
   - Airtable API Key
   - Base ID
   - Table Name
   - Number of Records (1-100, default 50)
4. Click "Save Settings"

## Usage

### Viewing Records
- Records are displayed with their last modified time
- Most recent records appear at the top
- Auto-syncs every 30 minutes
- Click the sync icon (🔄) to refresh manually

### Actions
- Click the copy icon (📋) to copy the content
- Click the link icon (🔗) to open the URL in a new tab
- Click the settings icon (⚙️) to modify configuration

## Troubleshooting

### Common Issues

1. **No Records Showing**
   - Verify your API key is correct
   - Check if Base ID matches your Airtable base
   - Ensure table name is exactly as shown in Airtable
   - Confirm your table has the required fields

2. **Field Not Found Error**
   - Ensure your table has a field named "Name"
   - Check if "Last Modified Time" field exists
   - Field names are case-sensitive

3. **API Key Issues**
   - Make sure your API key starts with 'pat.'
   - Check if you have access to the base
   - Verify your API key has not expired

### Required Airtable Structure

```
Your Airtable Base
└── Your Table
    ├── Name (Text field)
    ├── Last Modified Time (Auto-generated)
    └── URL (URL field, optional)
```

## Support
For issues or questions, please contact injaytseng@gmail.com or visit our [GitHub repository](https://github.com/injaytseng).

## Privacy Policy
This extension:
- Only accesses the Airtable API with your credentials
- Stores settings securely in Chrome storage
- Does not collect or transmit personal data
- Does not use tracking or analytics

## Support
For issues or questions, please contact injaytseng@gmail.com or visit our [GitHub repository](https://github.com/injaytseng).

## Version History
- 1.0.0: Initial release
  - 50 record display
  - Auto-sync feature
  - Copy and URL functionality
