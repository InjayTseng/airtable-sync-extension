// Set up alarm for periodic sync (every 30 minutes)
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('syncAlarm', { periodInMinutes: 30 });
});

// Handle alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncAlarm') {
    syncData();
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'syncData') {
    syncData().then(sendResponse);
    return true; // Will respond asynchronously
  }
});

// Function to sync data from Airtable
async function syncData() {
  try {
    const { apiKey, baseId, tableName } = await chrome.storage.sync.get(['apiKey', 'baseId', 'tableName']);
    
    if (!apiKey || !baseId || !tableName) {
      throw new Error('Please configure your Airtable settings first');
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableName}?sort%5B0%5D%5Bfield%5D=Last%20Modified%20Time&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=50`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from Airtable');
    }

    const data = await response.json();
    
    // Store the latest records in chrome.storage
    await chrome.storage.local.set({ 
      lastSync: new Date().toISOString(),
      records: data.records 
    });

    return data;
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
}
