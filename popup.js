document.addEventListener('DOMContentLoaded', () => {
  // Settings panel toggle
  const settingsPanel = document.getElementById('settingsPanel');
  const toggleSettings = document.getElementById('toggleSettings');
  
  toggleSettings.addEventListener('click', () => {
    settingsPanel.classList.toggle('show');
    const icon = toggleSettings.querySelector('i');
    if (settingsPanel.classList.contains('show')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-cog';
    }
  });

  // Load saved settings
  chrome.storage.sync.get(['apiKey', 'baseId', 'tableName', 'recordLimit'], (result) => {
    if (result.apiKey) document.getElementById('apiKey').value = result.apiKey;
    if (result.baseId) document.getElementById('baseId').value = result.baseId;
    if (result.tableName) document.getElementById('tableName').value = result.tableName;
    if (result.recordLimit) document.getElementById('recordLimit').value = result.recordLimit || '50';
    
    // If no settings are saved, show the settings panel
    if (!result.apiKey || !result.baseId || !result.tableName) {
      settingsPanel.classList.add('show');
    } else {
      // If settings exist, trigger initial sync
      syncData();
    }
  });

  // Save settings
  document.getElementById('saveSettings').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    const baseId = document.getElementById('baseId').value;
    const tableName = document.getElementById('tableName').value;
    const recordLimit = document.getElementById('recordLimit').value || '50';

    if (!apiKey || !baseId || !tableName) {
      alert('Please fill in all fields');
      return;
    }

    chrome.storage.sync.set({ apiKey, baseId, tableName, recordLimit }, () => {
      settingsPanel.classList.remove('show');
      toggleSettings.querySelector('i').className = 'fas fa-cog';
      syncData(); // Sync after saving settings
    });
  });

  // Sync now button
  document.getElementById('syncNow').addEventListener('click', syncData);

  // Function to sync data
  function syncData() {
    const syncButton = document.getElementById('syncNow');
    const syncIcon = syncButton.querySelector('i');
    
    // Add spinning animation
    syncIcon.classList.add('fa-spin');
    syncButton.disabled = true;

    chrome.runtime.sendMessage({ action: 'syncData' })
      .then(response => {
        if (response && response.records) {
          displayRecords(response.records);
        }
      })
      .catch(error => {
        console.error('Error syncing data:', error);
      })
      .finally(() => {
        // Remove spinning animation after 1 second
        setTimeout(() => {
          syncIcon.classList.remove('fa-spin');
          syncButton.disabled = false;
        }, 1000);
      });
  }

  // Display records in the popup
  function displayRecords(records) {
    const recordsContainer = document.getElementById('records');
    recordsContainer.innerHTML = '';

    records.forEach(record => {
      const recordDiv = document.createElement('div');
      recordDiv.className = 'record';

      // Format the timestamp to match the screenshot
      const date = new Date(record.fields['Last Modified Time']);
      const timeString = date.toLocaleTimeString('zh-TW', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).toLowerCase();
      const lastModified = `Last Modified: ${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${timeString}`;
      
      const twitterPostCH = record.fields['Name'] || 'No content';
      const url = record.fields['URL'] || '';

      const content = `
        <div class="timestamp">${lastModified}</div>
        <div class="content-container">
          <div class="twitter-content">${twitterPostCH}</div>
          <div class="button-group">
            ${url ? `
              <button class="link-btn" title="Open URL in new tab" data-url="${encodeURIComponent(url)}">
                <i class="fas fa-external-link-alt"></i>
              </button>
            ` : ''}
            <button class="copy-btn" title="Copy to clipboard" data-content="${encodeURIComponent(twitterPostCH)}">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
      `;
      
      recordDiv.innerHTML = content;
      recordsContainer.appendChild(recordDiv);

      // Add click handler for copy button
      recordDiv.querySelector('.copy-btn').addEventListener('click', (e) => {
        const button = e.currentTarget;
        const content = decodeURIComponent(button.dataset.content);
        navigator.clipboard.writeText(content);
        
        // Visual feedback
        const icon = button.querySelector('i');
        icon.className = 'fas fa-check';
        setTimeout(() => {
          icon.className = 'fas fa-copy';
        }, 1500);
        });

      // Add click handler for link button if URL exists
      const linkBtn = recordDiv.querySelector('.link-btn');
      if (linkBtn) {
        linkBtn.addEventListener('click', (e) => {
          const url = decodeURIComponent(e.currentTarget.dataset.url);
          chrome.tabs.create({ url, active: true });
        });
      }
    });
  }
});
