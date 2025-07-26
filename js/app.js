// Enhanced Data Storage with Autosave System
    let students = [];
    let attendance = [];
    let prayerRecords = [];
    let currentUser = null;
    let html5QrCode = null;
    let html5QrCodePrayer = null;
    let autoSaveInterval = null;
    let lastSaveTime = Date.now();
    
    // Enhanced Editable text system
    let editableTexts = {
      className: 'Kelas 7 Al Karim',
      teacherName: 'Ustadz Harris',
      systemTitle: 'Digital Attendance System',
      welcomeMessage: 'Assalamu\'alaikum, Selamat Datang',
      menuItems: {
        home: 'Halaman Utama',
        inputSiswa: 'Input Data Siswa',
        qrSiswa: 'QR Code Siswa',
        absensi: 'Absensi Harian',
        sholat: 'Kontrol Sholat',
        dashboard: 'Dashboard',
        exportRekap: 'Export Rekap',
        exportBackup: 'Export Backup',
        importBackup: 'Import Backup',
        darkMode: 'Toggle Dark Mode',
        logout: 'Logout'
      },
      sectionTitles: {
        inputSiswa: 'Input Data Siswa',
        qrSiswa: 'QR Code Siswa',
        absensi: 'Absensi Harian',
        sholat: 'Kontrol Sholat 5 Waktu',
        dashboard: 'Dashboard Analytics'
      },
      buttons: {
        tambahSiswa: 'Tambah Siswa',
        generateQR: 'Generate Semua QR Code HD',
        mulaiScan: 'Mulai Scan',
        stopScan: 'Stop Scan',
        tandaiHadir: 'Tandai Hadir',
        mulaiScanSholat: 'Mulai Scan Sholat',
        tandaiSholat: 'Tandai Sudah Sholat'
      },
      labels: {
        namaSiswa: 'Nama Siswa',
        kelas: 'Kelas',
        uploadFoto: 'Upload Foto Siswa',
        pilihSiswa: 'Pilih Siswa',
        pilihWaktuSholat: 'Pilih Waktu Sholat'
      }
    };
    let isEditMode = false;
    
    // Edit Mode Functions
    function toggleEditMode() {
      isEditMode = !isEditMode;
      const editButton = document.getElementById('edit-mode-text');
      
      if (isEditMode) {
        editButton.textContent = 'Keluar Mode Edit';
        enableEditMode();
        showEditModeIndicator();
      } else {
        editButton.textContent = 'Mode Edit Teks';
        disableEditMode();
        hideEditModeIndicator();
        saveEditableTexts();
      }
    }
    
    function enableEditMode() {
      // Add edit indicators to all editable elements
      const editableElements = document.querySelectorAll('[data-editable]');
      
      editableElements.forEach(element => {
        // Add edit styling
        element.style.position = 'relative';
        element.style.cursor = 'pointer';
        element.style.border = '2px dashed #6366f1';
        element.style.padding = '4px';
        element.style.borderRadius = '4px';
        element.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        
        // Add edit icon
        const editIcon = document.createElement('span');
        editIcon.className = 'edit-icon';
        editIcon.innerHTML = '✏️';
        editIcon.style.position = 'absolute';
        editIcon.style.top = '-8px';
        editIcon.style.right = '-8px';
        editIcon.style.backgroundColor = '#6366f1';
        editIcon.style.color = 'white';
        editIcon.style.borderRadius = '50%';
        editIcon.style.width = '20px';
        editIcon.style.height = '20px';
        editIcon.style.display = 'flex';
        editIcon.style.alignItems = 'center';
        editIcon.style.justifyContent = 'center';
        editIcon.style.fontSize = '10px';
        editIcon.style.zIndex = '10';
        
        element.appendChild(editIcon);
        
        // Add click handler
        element.addEventListener('click', handleEditClick);
      });
    }
    
    function disableEditMode() {
      // Remove edit indicators from all editable elements
      const editableElements = document.querySelectorAll('[data-editable]');
      
      editableElements.forEach(element => {
        // Remove edit styling
        element.style.position = '';
        element.style.cursor = '';
        element.style.border = '';
        element.style.padding = '';
        element.style.borderRadius = '';
        element.style.backgroundColor = '';
        
        // Remove edit icon
        const editIcon = element.querySelector('.edit-icon');
        if (editIcon) {
          editIcon.remove();
        }
        
        // Remove click handler
        element.removeEventListener('click', handleEditClick);
      });
    }
    
    function handleEditClick(event) {
      event.preventDefault();
      event.stopPropagation();
      
      const element = event.currentTarget;
      const editableKey = element.getAttribute('data-editable');
      const currentText = element.textContent.trim();
      
      // Create inline editor
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentText;
      input.className = 'inline-editor';
      input.style.width = '100%';
      input.style.padding = '4px';
      input.style.border = '2px solid #6366f1';
      input.style.borderRadius = '4px';
      input.style.fontSize = window.getComputedStyle(element).fontSize;
      input.style.fontFamily = window.getComputedStyle(element).fontFamily;
      input.style.fontWeight = window.getComputedStyle(element).fontWeight;
      input.style.backgroundColor = 'white';
      input.style.color = '#374151';
      
      // Replace element content temporarily
      const originalContent = element.innerHTML;
      element.innerHTML = '';
      element.appendChild(input);
      
      // Focus and select text
      input.focus();
      input.select();
      
      // Handle save
      function saveEdit() {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
          // Update the text in data structure
          updateEditableText(editableKey, newText);
          
          // Update element
          element.innerHTML = originalContent.replace(currentText, newText);
          
          // Re-add edit icon
          const editIcon = document.createElement('span');
          editIcon.className = 'edit-icon';
          editIcon.innerHTML = '✏️';
          editIcon.style.position = 'absolute';
          editIcon.style.top = '-8px';
          editIcon.style.right = '-8px';
          editIcon.style.backgroundColor = '#6366f1';
          editIcon.style.color = 'white';
          editIcon.style.borderRadius = '50%';
          editIcon.style.width = '20px';
          editIcon.style.height = '20px';
          editIcon.style.display = 'flex';
          editIcon.style.alignItems = 'center';
          editIcon.style.justifyContent = 'center';
          editIcon.style.fontSize = '10px';
          editIcon.style.zIndex = '10';
          element.appendChild(editIcon);
          
          showSaveIndicator(`Teks "${editableKey}" berhasil diubah!`);
        } else {
          // Restore original content
          element.innerHTML = originalContent;
        }
      }
      
      // Handle cancel
      function cancelEdit() {
        element.innerHTML = originalContent;
      }
      
      // Event listeners
      input.addEventListener('blur', saveEdit);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveEdit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEdit();
        }
      });
    }
    
    function updateEditableText(key, newText) {
      // Handle nested keys like menuItems.home
      const keys = key.split('.');
      let obj = editableTexts;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      
      obj[keys[keys.length - 1]] = newText;
      
      // Update all elements with the same data-editable key
      const elements = document.querySelectorAll(`[data-editable="${key}"]`);
      elements.forEach(element => {
        // Preserve HTML structure but update text content
        const editIcon = element.querySelector('.edit-icon');
        if (editIcon) {
          editIcon.remove();
        }
        
        element.textContent = newText;
        
        // Re-add edit icon if in edit mode
        if (isEditMode) {
          const newEditIcon = document.createElement('span');
          newEditIcon.className = 'edit-icon';
          newEditIcon.innerHTML = '✏️';
          newEditIcon.style.position = 'absolute';
          newEditIcon.style.top = '-8px';
          newEditIcon.style.right = '-8px';
          newEditIcon.style.backgroundColor = '#6366f1';
          newEditIcon.style.color = 'white';
          newEditIcon.style.borderRadius = '50%';
          newEditIcon.style.width = '20px';
          newEditIcon.style.height = '20px';
          newEditIcon.style.display = 'flex';
          newEditIcon.style.alignItems = 'center';
          newEditIcon.style.justifyContent = 'center';
          newEditIcon.style.fontSize = '10px';
          newEditIcon.style.zIndex = '10';
          element.appendChild(newEditIcon);
        }
      });
    }
    
    function showEditModeIndicator() {
      const indicator = document.createElement('div');
      indicator.id = 'edit-mode-indicator';
      indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center space-x-2';
      indicator.innerHTML = `
        <span class="animate-pulse">✏️</span>
        <span class="font-semibold">Mode Edit Aktif</span>
        <span class="text-sm opacity-90">Klik teks yang ingin diubah</span>
      `;
      
      document.body.appendChild(indicator);
    }
    
    function hideEditModeIndicator() {
      const indicator = document.getElementById('edit-mode-indicator');
      if (indicator) {
        indicator.remove();
      }
    }
    
    function saveEditableTexts() {
      localStorage.setItem('editableTexts', JSON.stringify(editableTexts));
      showSaveIndicator('Perubahan teks tersimpan!');
    }
    
    function loadEditableTexts() {
      const saved = localStorage.getItem('editableTexts');
      if (saved) {
        try {
          const savedTexts = JSON.parse(saved);
          editableTexts = { ...editableTexts, ...savedTexts };
          
          // Apply saved texts to elements
          Object.keys(editableTexts).forEach(key => {
            if (typeof editableTexts[key] === 'object') {
              Object.keys(editableTexts[key]).forEach(subKey => {
                const fullKey = `${key}.${subKey}`;
                const elements = document.querySelectorAll(`[data-editable="${fullKey}"]`);
                elements.forEach(element => {
                  element.textContent = editableTexts[key][subKey];
                });
              });
            } else {
              const elements = document.querySelectorAll(`[data-editable="${key}"]`);
              elements.forEach(element => {
                element.textContent = editableTexts[key];
              });
            }
          });
          
          console.log('✅ Editable texts loaded from localStorage');
        } catch (error) {
          console.error('Error loading editable texts:', error);
        }
      }
    }
    
    // Crop functionality variables
    let cropper = null;
    let currentCropCallback = null;
    let currentImageFile = null;

    // Database Management System
    class DataManager {
      constructor() {
        this.dbName = 'AbsensiDB';
        this.dbVersion = 1;
        this.db = null;
        this.initDB();
      }

      // Initialize IndexedDB
      async initDB() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(this.dbName, this.dbVersion);
          
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            this.db = request.result;
            resolve(this.db);
          };
          
          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object stores
            if (!db.objectStoreNames.contains('students')) {
              db.createObjectStore('students', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('attendance')) {
              db.createObjectStore('attendance', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('settings')) {
              db.createObjectStore('settings', { keyPath: 'key' });
            }
          };
        });
      }

      // Save to IndexedDB
      async saveToIndexedDB(storeName, data) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          
          // Clear existing data
          store.clear();
          
          // Add new data
          if (Array.isArray(data)) {
            data.forEach(item => store.add(item));
          } else {
            store.add(data);
          }
          
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        });
      }

      // Load from IndexedDB
      async loadFromIndexedDB(storeName) {
        if (!this.db) await this.initDB();
        
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.getAll();
          
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }

      // Comprehensive save with multiple backups
      async saveAllData() {
        const timestamp = new Date().toISOString();
        const dataPackage = {
          students: students,
          attendance: attendance,
          prayerRecords: prayerRecords,
          timestamp: timestamp,
          version: '3.0'
        };

        try {
          // Save to localStorage (primary)
          localStorage.setItem('students', JSON.stringify(students));
          localStorage.setItem('attendance', JSON.stringify(attendance));
          localStorage.setItem('prayerRecords', JSON.stringify(prayerRecords));
          localStorage.setItem('lastSave', timestamp);
          
          // Save to sessionStorage (backup 1)
          sessionStorage.setItem('students_backup', JSON.stringify(students));
          sessionStorage.setItem('attendance_backup', JSON.stringify(attendance));
          sessionStorage.setItem('prayerRecords_backup', JSON.stringify(prayerRecords));
          
          // Save to IndexedDB (backup 2)
          await this.saveToIndexedDB('students', students);
          await this.saveToIndexedDB('attendance', attendance);
          await this.saveToIndexedDB('settings', [{ key: 'lastSave', value: timestamp }]);
          
          // Save complete backup (backup 3)
          localStorage.setItem('fullBackup', JSON.stringify(dataPackage));
          
          lastSaveTime = Date.now();
          console.log('✅ Data saved successfully at', timestamp);
          
          // Show save indicator
          showSaveIndicator('Tersimpan otomatis');
          
        } catch (error) {
          console.error('❌ Save error:', error);
          showSaveIndicator('Error menyimpan', true);
        }
      }

      // Load data with fallback recovery
      async loadAllData() {
        try {
          // Try primary source (localStorage)
          const studentsData = localStorage.getItem('students');
          const attendanceData = localStorage.getItem('attendance');
          const prayerData = localStorage.getItem('prayerRecords');
          
          if (studentsData && attendanceData) {
            students = JSON.parse(studentsData);
            attendance = JSON.parse(attendanceData);
            prayerRecords = prayerData ? JSON.parse(prayerData) : [];
            console.log('✅ Data loaded from localStorage');
            return true;
          }
          
          // Fallback 1: sessionStorage
          const studentsBackup = sessionStorage.getItem('students_backup');
          const attendanceBackup = sessionStorage.getItem('attendance_backup');
          const prayerBackup = sessionStorage.getItem('prayerRecords_backup');
          
          if (studentsBackup && attendanceBackup) {
            students = JSON.parse(studentsBackup);
            attendance = JSON.parse(attendanceBackup);
            prayerRecords = prayerBackup ? JSON.parse(prayerBackup) : [];
            console.log('✅ Data recovered from sessionStorage backup');
            await this.saveAllData(); // Re-save to primary
            return true;
          }
          
          // Fallback 2: IndexedDB
          const studentsIDB = await this.loadFromIndexedDB('students');
          const attendanceIDB = await this.loadFromIndexedDB('attendance');
          
          if (studentsIDB.length > 0 || attendanceIDB.length > 0) {
            students = studentsIDB;
            attendance = attendanceIDB;
            console.log('✅ Data recovered from IndexedDB');
            await this.saveAllData(); // Re-save to primary
            return true;
          }
          
          // Fallback 3: Full backup
          const fullBackup = localStorage.getItem('fullBackup');
          if (fullBackup) {
            const backup = JSON.parse(fullBackup);
            students = backup.students || [];
            attendance = backup.attendance || [];
            console.log('✅ Data recovered from full backup');
            await this.saveAllData(); // Re-save to primary
            return true;
          }
          
          // No data found - initialize empty
          students = [];
          attendance = [];
          console.log('ℹ️ No existing data found, starting fresh');
          return false;
          
        } catch (error) {
          console.error('❌ Load error:', error);
          students = [];
          attendance = [];
          return false;
        }
      }

      // Export backup file
      exportBackup() {
        const timestamp = new Date().toISOString().split('T')[0];
        const backup = {
          students: students,
          attendance: attendance,
          prayerRecords: prayerRecords,
          exportDate: new Date().toISOString(),
          version: '3.0'
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `absensi_backup_${timestamp}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showSaveIndicator('Backup berhasil diexport');
      }

      // Import backup file
      importBackup(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const backup = JSON.parse(e.target.result);
            
            if (backup.students && backup.attendance) {
              if (confirm('Import backup akan mengganti semua data yang ada. Lanjutkan?')) {
                students = backup.students;
                attendance = backup.attendance;
                prayerRecords = backup.prayerRecords || [];
                await this.saveAllData();
                
                // Refresh UI
                loadStudentTable();
                loadStudentOptions();
                updateStats();
                
                showSaveIndicator('Backup berhasil diimport');
              }
            } else {
              alert('File backup tidak valid!');
            }
          } catch (error) {
            alert('Error membaca file backup: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    }

    // Initialize Data Manager
    const dataManager = new DataManager();
    
    // Prayer Times API Functions
    async function getCurrentLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          console.log('Geolocation not supported, using default Jakarta location');
          resolve(currentLocation);
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
              // Get city name from coordinates using reverse geocoding
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`);
              const data = await response.json();
              
              currentLocation = {
                city: data.city || data.locality || 'Unknown',
                country: data.countryName || 'Indonesia',
                latitude: lat,
                longitude: lon
              };
              
              console.log('Location detected:', currentLocation);
              resolve(currentLocation);
            } catch (error) {
              console.error('Error getting location name:', error);
              currentLocation.latitude = lat;
              currentLocation.longitude = lon;
              resolve(currentLocation);
            }
          },
          (error) => {
            console.log('Geolocation error:', error.message, '- Using default Jakarta location');
            resolve(currentLocation);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
          }
        );
      });
    }
    
    async function fetchPrayerTimes() {
      try {
        const location = await getCurrentLocation();
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        
        // Using Aladhan API for prayer times
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${location.latitude}&longitude=${location.longitude}&method=2&school=0`
        );
        
        if (!response.ok) {
          throw new Error('Prayer API response not ok');
        }
        
        const data = await response.json();
        const timings = data.data.timings;
        
        // Update prayer times with API data
        prayerTimes = {
          subuh: formatPrayerTime(timings.Fajr),
          dzuhur: formatPrayerTime(timings.Dhuhr),
          ashar: formatPrayerTime(timings.Asr),
          maghrib: formatPrayerTime(timings.Maghrib),
          isya: formatPrayerTime(timings.Isha)
        };
        
        console.log('Prayer times updated for', location.city, ':', prayerTimes);
        
        // Update UI with location info
        updateLocationDisplay();
        updatePrayerTimesDisplay();
        
        return prayerTimes;
        
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        console.log('Using default prayer times for Jakarta');
        
        // Fallback to default times
        prayerTimes = {
          subuh: '04:30',
          dzuhur: '12:00',
          ashar: '15:15',
          maghrib: '18:00',
          isya: '19:15'
        };
        
        updatePrayerTimesDisplay();
        return prayerTimes;
      }
    }
    
    function formatPrayerTime(timeString) {
      // Convert from 24-hour format (HH:MM) to local format
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    }
    
    function updateLocationDisplay() {
      // Update location info in prayer section
      const locationElements = document.querySelectorAll('.prayer-location');
      locationElements.forEach(element => {
        element.textContent = `${currentLocation.city}, ${currentLocation.country}`;
      });
    }
    
    function updatePrayerTimesDisplay() {
      // Update prayer times in the UI
      Object.keys(prayerTimes).forEach(prayer => {
        const timeElement = document.getElementById(`${prayer}-time`);
        if (timeElement) {
          timeElement.textContent = prayerTimes[prayer];
        }
      });
      
      // Update prayer status
      updatePrayerTimes();
    }

    // Add backup controls to menu
    function addBackupControls() {
      // Already added in HTML, this function can be used for dynamic additions if needed
      console.log('Backup controls initialized');
    }

    // Auto-save system
    function startAutoSave() {
      // Save every 30 seconds
      autoSaveInterval = setInterval(async () => {
        await dataManager.saveAllData();
      }, 30000);
      
      // Save on page unload
      window.addEventListener('beforeunload', async () => {
        await dataManager.saveAllData();
      });
      
      // Save on visibility change (tab switch)
      document.addEventListener('visibilitychange', async () => {
        if (document.hidden) {
          await dataManager.saveAllData();
        }
      });
    }

    // Save indicator
    function showSaveIndicator(message, isError = false) {
      // Remove existing indicator
      const existing = document.getElementById('save-indicator');
      if (existing) existing.remove();
      
      const indicator = document.createElement('div');
      indicator.id = 'save-indicator';
      indicator.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white text-sm font-medium z-50 transition-all duration-300 ${
        isError ? 'bg-red-500' : 'bg-green-500'
      }`;
      indicator.textContent = message;
      
      document.body.appendChild(indicator);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        if (indicator) {
          indicator.style.opacity = '0';
          setTimeout(() => indicator.remove(), 300);
        }
      }, 3000);
    }

    // Enhanced save functions
    async function saveData() {
      await dataManager.saveAllData();
    }

    // Crop Modal Functions
    function openCropModal(file, callback) {
      currentImageFile = file;
      currentCropCallback = callback;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const cropImage = document.getElementById('crop-image');
        cropImage.src = e.target.result;
        
        // Show modal
        document.getElementById('crop-modal').classList.remove('hidden');
        
        // Initialize cropper
        if (cropper) {
          cropper.destroy();
        }
        
        cropper = new Cropper(cropImage, {
          aspectRatio: NaN, // Free aspect ratio by default
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 0.8,
          restore: false,
          guides: true,
          center: true,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: false,
          background: false,
          responsive: true,
          checkOrientation: false,
          modal: true,
          zoomable: true,
          rotatable: true,
          scalable: true,
          ready: function() {
            // Cropper is ready
            console.log('Cropper initialized');
          }
        });
      };
      reader.readAsDataURL(file);
    }

    function closeCropModal() {
      document.getElementById('crop-modal').classList.add('hidden');
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
      currentCropCallback = null;
      currentImageFile = null;
    }

    function applyCrop() {
      if (!cropper || !currentCropCallback) return;
      
      const canvas = cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 800,
        maxHeight: 800,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });
      
      canvas.toBlob(function(blob) {
        const reader = new FileReader();
        reader.onload = function(e) {
          currentCropCallback(e.target.result);
          closeCropModal();
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.9);
    }

    // Aspect ratio button handlers
    document.addEventListener('DOMContentLoaded', function() {
      const aspectRatioButtons = document.querySelectorAll('.aspect-ratio-btn');
      
      aspectRatioButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          aspectRatioButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // Set aspect ratio
          const ratio = this.dataset.ratio;
          if (cropper) {
            if (ratio === 'free') {
              cropper.setAspectRatio(NaN);
            } else {
              cropper.setAspectRatio(parseFloat(ratio));
            }
          }
        });
      });
    });

    // Update current time and date
    function updateCurrentTime() {
      const now = new Date();
      const timeElement = document.getElementById('current-time');
      const dateElement = document.getElementById('current-date');
      
      if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('id-ID');
      }
      if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    }

    // Prayer Times Data - Will be updated with real location
    let prayerTimes = {
      subuh: '04:30',
      dzuhur: '12:00',
      ashar: '15:15',
      maghrib: '18:00',
      isya: '19:15'
    };
    
    let currentLocation = {
      city: 'Jakarta',
      country: 'Indonesia',
      latitude: -6.2088,
      longitude: 106.8456
    };

    let currentPrayerStudent = null;

    // Prayer Functions
    function showPrayerSelectionModal(studentId, nama, kelas) {
      currentPrayerStudent = { id: studentId, nama: nama, kelas: kelas };
      document.getElementById('prayer-student-info').textContent = `Pilih waktu sholat untuk ${nama} - ${kelas}`;
      document.getElementById('prayer-modal').classList.remove('hidden');
    }

    function closePrayerModal() {
      document.getElementById('prayer-modal').classList.add('hidden');
      currentPrayerStudent = null;
    }

    async function markPrayer(prayerType) {
      if (!currentPrayerStudent) return;
      
      const today = new Date().toDateString();
      
      // Check if already marked today for this prayer
      const existingRecord = prayerRecords.find(p => 
        p.studentId == currentPrayerStudent.id && 
        p.date === today && 
        p.prayerType === prayerType
      );
      
      if (existingRecord) {
        alert(`${currentPrayerStudent.nama} sudah tercatat sholat ${prayerType} hari ini!`);
        closePrayerModal();
        return;
      }
      
      const prayerRecord = {
        studentId: currentPrayerStudent.id,
        nama: currentPrayerStudent.nama,
        kelas: currentPrayerStudent.kelas,
        prayerType: prayerType,
        date: today,
        timestamp: Date.now()
      };
      
      prayerRecords.push(prayerRecord);
      await saveData();
      
      loadPrayerTable();
      closePrayerModal();
      
      alert(`${currentPrayerStudent.nama} berhasil dicatat sholat ${prayerType}!`);
    }

    async function markPrayerManual() {
      const studentId = document.getElementById('manual-prayer-siswa').value;
      const prayerType = document.getElementById('prayer-type').value;
      
      if (!studentId || !prayerType) {
        alert('Pilih siswa dan waktu sholat terlebih dahulu!');
        return;
      }
      
      const student = students.find(s => s.id == studentId);
      if (student) {
        const today = new Date().toDateString();
        
        // Check if already marked today for this prayer
        const existingRecord = prayerRecords.find(p => 
          p.studentId == studentId && 
          p.date === today && 
          p.prayerType === prayerType
        );
        
        if (existingRecord) {
          alert(`${student.nama} sudah tercatat sholat ${prayerType} hari ini!`);
          return;
        }
        
        const prayerRecord = {
          studentId: studentId,
          nama: student.nama,
          kelas: student.kelas,
          prayerType: prayerType,
          date: today,
          timestamp: Date.now()
        };
        
        prayerRecords.push(prayerRecord);
        await saveData();
        
        loadPrayerTable();
        document.getElementById('manual-prayer-siswa').value = '';
        document.getElementById('prayer-type').value = '';
        
        alert(`${student.nama} berhasil dicatat sholat ${prayerType}!`);
      }
    }

    function loadPrayerTable() {
      const tbody = document.getElementById('prayer-tbody');
      const today = new Date().toDateString();
      
      tbody.innerHTML = '';
      
      students.forEach(student => {
        const todayPrayers = prayerRecords.filter(p => 
          p.studentId == student.id && p.date === today
        );
        
        const prayers = {
          subuh: todayPrayers.find(p => p.prayerType === 'subuh'),
          dzuhur: todayPrayers.find(p => p.prayerType === 'dzuhur'),
          ashar: todayPrayers.find(p => p.prayerType === 'ashar'),
          maghrib: todayPrayers.find(p => p.prayerType === 'maghrib'),
          isya: todayPrayers.find(p => p.prayerType === 'isya')
        };
        
        const totalPrayers = Object.values(prayers).filter(p => p).length;
        
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        
        row.innerHTML = `
          <td class="p-4 font-medium">${student.nama}</td>
          <td class="p-4 text-center">${prayers.subuh ? '✅' : '❌'}</td>
          <td class="p-4 text-center">${prayers.dzuhur ? '✅' : '❌'}</td>
          <td class="p-4 text-center">${prayers.ashar ? '✅' : '❌'}</td>
          <td class="p-4 text-center">${prayers.maghrib ? '✅' : '❌'}</td>
          <td class="p-4 text-center">${prayers.isya ? '✅' : '❌'}</td>
          <td class="p-4 text-center font-bold ${totalPrayers === 5 ? 'text-green-600' : 'text-orange-600'}">
            ${totalPrayers}/5
          </td>
        `;
        
        tbody.appendChild(row);
      });
    }

    function loadPrayerStudentOptions() {
      const select = document.getElementById('manual-prayer-siswa');
      select.innerHTML = '<option value="">Pilih Siswa</option>';
      
      students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.nama} - ${student.kelas}`;
        select.appendChild(option);
      });
    }

    function updatePrayerDateToday() {
      const today = new Date();
      document.getElementById('prayer-date-today').textContent = 
        today.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
    }

    function updatePrayerTimes() {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      Object.keys(prayerTimes).forEach(prayer => {
        const timeElement = document.getElementById(`${prayer}-time`);
        const statusElement = document.getElementById(`${prayer}-status`);
        
        if (timeElement && statusElement) {
          timeElement.textContent = prayerTimes[prayer];
          
          const [hours, minutes] = prayerTimes[prayer].split(':').map(Number);
          const prayerTime = hours * 60 + minutes;
          
          if (currentTime >= prayerTime && currentTime < prayerTime + 60) {
            statusElement.textContent = 'Waktu Sholat';
            statusElement.className = 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-800';
          } else if (currentTime > prayerTime + 60) {
            statusElement.textContent = 'Selesai';
            statusElement.className = 'text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600';
          } else {
            statusElement.textContent = 'Menunggu';
            statusElement.className = 'text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600';
          }
        }
      });
    }

    // Camera permission check
    async function checkCameraPermission() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Check if camera permission is already granted
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
          });
          
          // Stop the stream immediately after checking
          stream.getTracks().forEach(track => track.stop());
          
          console.log('✅ Camera permission granted');
          return true;
        } else {
          console.log('❌ Camera API not supported');
          return false;
        }
      } catch (error) {
        console.log('⚠️ Camera permission check failed:', error.name);
        return false;
      }
    }
    
    // Enhanced camera initialization
    async function initializeCameraSupport() {
      try {
        // Check if running on HTTPS or localhost
        const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        
        if (!isSecure) {
          console.warn('⚠️ Camera requires HTTPS in production');
        }
        
        // Check browser support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error('❌ Browser does not support camera access');
          return false;
        }
        
        // Check camera permission
        const hasPermission = await checkCameraPermission();
        
        if (hasPermission) {
          console.log('✅ Camera system ready');
          return true;
        } else {
          console.log('⚠️ Camera permission not granted yet');
          return false;
        }
        
      } catch (error) {
        console.error('❌ Camera initialization failed:', error);
        return false;
      }
    }
    
    // Enhanced camera status indicator with test functionality
    function addCameraStatusIndicator() {
      const scannerSections = [
        { id: 'reader', label: 'Scanner Absensi' },
        { id: 'prayer-reader', label: 'Scanner Sholat' }
      ];
      
      scannerSections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const statusDiv = document.createElement('div');
          statusDiv.className = 'camera-status mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-sm text-center border border-blue-200';
          statusDiv.innerHTML = `
            <div class="flex items-center justify-center space-x-2 mb-2">
              <span class="text-lg">📷</span>
              <span class="font-semibold text-blue-800">${section.label}</span>
            </div>
            <div class="text-xs text-blue-600 mb-2">
              Mendukung QR Code & Barcode • Auto-focus • Torch support
            </div>
            <button onclick="testCamera('${section.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
              🔧 Test Kamera
            </button>
          `;
          element.appendChild(statusDiv);
        }
      });
    }
    
    // Camera test function
    async function testCamera(readerId) {
      try {
        console.log(`🧪 Testing camera for ${readerId}...`);
        
        // Show loading
        const statusDiv = document.querySelector(`#${readerId} .camera-status`);
        if (statusDiv) {
          statusDiv.innerHTML = `
            <div class="flex items-center justify-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span class="text-blue-800">Testing kamera...</span>
            </div>
          `;
        }
        
        // Test camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        // Get camera info
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        const capabilities = videoTrack.getCapabilities();
        
        console.log('📷 Camera settings:', settings);
        console.log('🔧 Camera capabilities:', capabilities);
        
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
        
        // Show success status
        if (statusDiv) {
          statusDiv.innerHTML = `
            <div class="text-green-800 mb-2">
              <div class="flex items-center justify-center space-x-2 mb-1">
                <span>✅</span>
                <span class="font-semibold">Kamera OK!</span>
              </div>
              <div class="text-xs">
                ${settings.width}x${settings.height} • ${videoTrack.label}
              </div>
              ${capabilities.torch ? '<div class="text-xs">🔦 Torch tersedia</div>' : ''}
            </div>
            <button onclick="addCameraStatusIndicator()" class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
              🔄 Reset Status
            </button>
          `;
        }
        
        alert(`✅ KAMERA TEST BERHASIL!

📷 INFORMASI KAMERA:
• Resolusi: ${settings.width}x${settings.height}
• Device: ${videoTrack.label}
• Facing Mode: ${settings.facingMode || 'default'}
${capabilities.torch ? '• 🔦 Torch/Flash: Tersedia' : '• 🔦 Torch/Flash: Tidak tersedia'}
${capabilities.zoom ? '• 🔍 Zoom: Tersedia' : '• 🔍 Zoom: Tidak tersedia'}

🎯 SCANNER SIAP DIGUNAKAN!
Klik "Mulai Scan" untuk memulai scanning.`);
        
      } catch (error) {
        console.error('❌ Camera test failed:', error);
        
        // Show error status
        const statusDiv = document.querySelector(`#${readerId} .camera-status`);
        if (statusDiv) {
          statusDiv.innerHTML = `
            <div class="text-red-800 mb-2">
              <div class="flex items-center justify-center space-x-2 mb-1">
                <span>❌</span>
                <span class="font-semibold">Kamera Error!</span>
              </div>
              <div class="text-xs">${error.name}: ${error.message}</div>
            </div>
            <button onclick="addCameraStatusIndicator()" class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
              🔄 Reset Status
            </button>
          `;
        }
        
        // Show detailed error message
        let errorSolution = '';
        
        if (error.name === 'NotAllowedError') {
          errorSolution = `🔧 SOLUSI:
1. Klik ikon 🔒 di address bar
2. Pilih "Allow" untuk Camera
3. Refresh halaman dan test lagi`;
        } else if (error.name === 'NotFoundError') {
          errorSolution = `🔧 SOLUSI:
1. Pastikan kamera terhubung
2. Tutup aplikasi lain yang menggunakan kamera
3. Restart browser`;
        } else if (error.name === 'NotSupportedError') {
          errorSolution = `🔧 SOLUSI:
1. Gunakan browser modern (Chrome/Edge/Firefox)
2. Pastikan menggunakan HTTPS
3. Update browser ke versi terbaru`;
        } else {
          errorSolution = `🔧 SOLUSI UMUM:
1. Restart browser
2. Restart perangkat
3. Coba browser berbeda
4. Periksa antivirus/firewall`;
        }
        
        alert(`❌ CAMERA TEST GAGAL!

🚨 ERROR: ${error.name}
📝 Detail: ${error.message}

${errorSolution}

💡 TIPS TAMBAHAN:
• Pastikan tidak ada aplikasi lain yang menggunakan kamera
• Coba mode incognito/private browsing
• Periksa pengaturan privacy browser`);
      }
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', async function() {
      // Load data first
      await dataManager.loadAllData();
      
      // Load editable texts
      loadEditableTexts();
      
      // Start auto-save system
      startAutoSave();
      
      // Initialize camera support
      await initializeCameraSupport();
      
      // Initialize prayer times with real location
      await fetchPrayerTimes();
      
      // Initialize UI
      updateTanggalHariIni();
      loadStudentOptions();
      updateStats();
      loadWaliFoto();
      loadLogoKelas();
      updatePrayerTimes();
      
      // Add camera status indicators
      addCameraStatusIndicator();
      
      // Update time every second
      updateCurrentTime();
      setInterval(updateCurrentTime, 1000);
      setInterval(updatePrayerTimes, 60000); // Update prayer status every minute
      
      // Refresh prayer times every hour
      setInterval(async () => {
        await fetchPrayerTimes();
      }, 3600000); // 1 hour
      
      // Add backup controls to menu
      addBackupControls();
      
      // Prayer modal event listeners
      document.querySelectorAll('.prayer-select-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const prayerType = this.dataset.prayer;
          markPrayer(prayerType);
        });
      });
      
      // Add helpful tips for camera usage
      console.log(`
🎥 PANDUAN PENGGUNAAN KAMERA SCANNER:

✅ MOBILE (Android/iOS):
• Gunakan Chrome/Safari terbaru
• Berikan izin kamera saat diminta
• Arahkan kamera ke QR Code/Barcode
• Pastikan pencahayaan cukup

✅ PC/LAPTOP:
• Gunakan Chrome/Edge/Firefox terbaru
• Pastikan webcam terhubung dan berfungsi
• Berikan izin kamera di browser
• Gunakan HTTPS untuk akses kamera

🔧 TROUBLESHOOTING:
• Refresh halaman jika kamera tidak muncul
• Periksa pengaturan privacy browser
• Pastikan kamera tidak digunakan aplikasi lain
• Coba browser berbeda jika masalah berlanjut

✏️ MODE EDIT TEKS:
• Klik "Mode Edit Teks" di menu untuk mengaktifkan
• Klik teks yang ingin diubah (yang memiliki border biru)
• Tekan Enter untuk menyimpan, Escape untuk batal
• Semua perubahan tersimpan otomatis
      `);
    });

    // Mobile Menu Functions
    function initializeMobileMenu() {
      const mobileToggle = document.getElementById('mobile-menu-toggle');
      const menu = document.getElementById('menu');
      const overlay = document.getElementById('mobile-overlay');
      
      // Toggle mobile menu
      mobileToggle.addEventListener('click', function() {
        menu.classList.toggle('mobile-open');
        overlay.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
      });
      
      // Close menu when clicking overlay
      overlay.addEventListener('click', function() {
        menu.classList.remove('mobile-open');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      });
      
      // Close menu when clicking menu items on mobile
      const menuItems = menu.querySelectorAll('button');
      menuItems.forEach(item => {
        item.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            menu.classList.remove('mobile-open');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
          }
        });
      });
      
      // Handle window resize
      window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
          menu.classList.remove('mobile-open');
          overlay.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      });
    }

    // Authentication
    function login() {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (username === 'admin' && password === 'password123') {
        currentUser = { name: 'Ustadz Harris', username: username };
        document.getElementById('wali-nama').textContent = currentUser.name;
        document.getElementById('login').classList.add('hidden');
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('mobile-menu-toggle').classList.remove('hidden');
        
        // Only add margin on desktop
        if (window.innerWidth > 768) {
          document.getElementById('main-content').classList.add('ml-72');
        }
        
        showSection('home');
        initializeMobileMenu();
      } else {
        alert('Username atau password salah!');
      }
    }

    function logout() {
      currentUser = null;
      document.getElementById('login').classList.remove('hidden');
      document.getElementById('menu').classList.add('hidden');
      document.getElementById('mobile-menu-toggle').classList.add('hidden');
      document.getElementById('mobile-overlay').classList.add('hidden');
      document.getElementById('main-content').classList.remove('ml-72');
      document.body.classList.remove('overflow-hidden');
      hideAllSections();
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
    }

    // Navigation
    function showSection(sectionId) {
      hideAllSections();
      document.getElementById(sectionId).classList.remove('hidden');
      
      if (sectionId === 'input-siswa') {
        loadStudentTable();
      } else if (sectionId === 'qr-siswa') {
        loadQRCodes();
      } else if (sectionId === 'absensi') {
        loadAbsensiTable();
        loadStudentOptions();
      } else if (sectionId === 'sholat') {
        loadPrayerTable();
        loadPrayerStudentOptions();
        updatePrayerDateToday();
      } else if (sectionId === 'dashboard') {
        loadDashboard();
      } else if (sectionId === 'home') {
        updateStats();
        updatePrayerTimes();
      }
    }

    function hideAllSections() {
      const sections = ['login', 'home', 'input-siswa', 'qr-siswa', 'absensi', 'sholat', 'dashboard'];
      sections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
      });
    }

    // Student Management
    let currentStudentPhoto = null;

    document.getElementById('siswa-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const nama = document.getElementById('nama').value;
      const kelas = document.getElementById('kelas').value;
      const foto = currentStudentPhoto || 'https://via.placeholder.com/60';
      
      const student = {
        id: Date.now(),
        nama: nama,
        kelas: kelas,
        foto: foto
      };
      
      students.push(student);
      await saveData();
      
      document.getElementById('siswa-form').reset();
      removeFotoPreview();
      currentStudentPhoto = null;
      loadStudentTable();
      loadStudentOptions();
      updateStats();
      
      alert('Siswa berhasil ditambahkan!');
    });

    function loadStudentTable() {
      const tbody = document.getElementById('siswa-tbody');
      tbody.innerHTML = '';
      
      students.forEach(student => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        row.innerHTML = `
          <td class="p-4">
            <img src="${student.foto}" alt="${student.nama}" class="w-12 h-12 rounded-full object-cover">
          </td>
          <td class="p-4 font-medium">${student.nama}</td>
          <td class="p-4">${student.kelas}</td>
          <td class="p-4">
            <button onclick="editStudentPhoto(${student.id})" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors mr-2">
              Edit Foto
            </button>
            <button onclick="deleteStudent(${student.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
              Hapus
            </button>
            <input type="file" id="edit-foto-${student.id}" accept="image/*" class="hidden" onchange="updateStudentPhoto(${student.id}, this)">
          </td>
        `;
        tbody.appendChild(row);
      });
    }

    function editStudentPhoto(id) {
      document.getElementById(`edit-foto-${id}`).click();
    }

    function updateStudentPhoto(id, input) {
      const file = input.files[0];
      if (file) {
        // Open crop modal for editing student photo
        openCropModal(file, async function(croppedImageData) {
          // Find and update student photo
          const studentIndex = students.findIndex(s => s.id === id);
          if (studentIndex !== -1) {
            students[studentIndex].foto = croppedImageData;
            await saveData();
            loadStudentTable();
            alert('Foto siswa berhasil diperbarui!');
          }
        });
      }
    }

    async function deleteStudent(id) {
      if (confirm('Yakin ingin menghapus siswa ini?')) {
        students = students.filter(student => student.id !== id);
        await saveData();
        loadStudentTable();
        loadStudentOptions();
        updateStats();
      }
    }

    // QR Code Generation
    function generateAllQR() {
      const qrList = document.getElementById('qr-list');
      qrList.innerHTML = '';
      
      students.forEach(student => {
        const qrDiv = document.createElement('div');
        qrDiv.className = 'bg-white p-6 rounded-xl shadow-lg card text-center';
        
        const canvas = document.createElement('canvas');
        canvas.id = `qr-${student.id}`;
        
        qrDiv.innerHTML = `
          <img src="${student.foto}" alt="${student.nama}" class="w-16 h-16 rounded-full mx-auto mb-4 object-cover">
          <h3 class="font-semibold text-lg mb-2">${student.nama}</h3>
          <p class="text-gray-600 mb-4">${student.kelas}</p>
          <div class="mb-4"></div>
          <button onclick="downloadQR('${student.id}', '${student.nama}')" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
            📱 Download QR HD
          </button>
        `;
        
        qrDiv.querySelector('div').appendChild(canvas);
        qrList.appendChild(qrDiv);
        
        // Generate HD QR Code (1024x1024 for HD quality)
        QRCode.toCanvas(canvas, JSON.stringify({
          id: student.id,
          nama: student.nama,
          kelas: student.kelas
        }), { 
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H'
        });
      });
    }

    function loadQRCodes() {
      if (students.length > 0) {
        generateAllQR();
      } else {
        document.getElementById('qr-list').innerHTML = '<p class="text-center text-gray-500">Belum ada data siswa</p>';
      }
    }

    function downloadQR(studentId, studentName) {
      // Create a high-resolution canvas for HD download
      const hdCanvas = document.createElement('canvas');
      const hdSize = 1024; // HD resolution 1024x1024
      hdCanvas.width = hdSize;
      hdCanvas.height = hdSize;
      
      // Find student data
      const student = students.find(s => s.id == studentId);
      
      // Generate HD QR Code
      QRCode.toCanvas(hdCanvas, JSON.stringify({
        id: student.id,
        nama: student.nama,
        kelas: student.kelas
      }), { 
        width: hdSize,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H' // Highest error correction for better scanning
      }, function(error) {
        if (error) {
          console.error('QR Code generation error:', error);
          alert('Error generating HD QR Code');
          return;
        }
        
        // Download the HD QR Code
        const link = document.createElement('a');
        link.download = `QR_HD_${studentName.replace(/\s+/g, '_')}.png`;
        link.href = hdCanvas.toDataURL('image/png', 1.0); // Maximum quality
        link.click();
        
        // Show success message
        showSaveIndicator(`QR HD ${studentName} berhasil didownload!`);
      });
    }

    // Excel Import Function
    function importExcel() {
      const fileInput = document.getElementById('excel-file');
      const file = fileInput.files[0];
      
      if (!file) {
        alert('Pilih file Excel terlebih dahulu!');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async function(e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          let importedCount = 0;
          
          // Skip header row if exists
          const startRow = jsonData[0] && (jsonData[0][0] === 'Nama' || jsonData[0][0] === 'Name') ? 1 : 0;
          
          for (let i = startRow; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row[0] && row[1]) { // Nama and Kelas required
              const student = {
                id: Date.now() + i,
                nama: row[0].toString().trim(),
                kelas: row[1].toString().trim(),
                foto: row[2] ? row[2].toString().trim() : 'https://via.placeholder.com/60'
              };
              
              // Check if student already exists
              const exists = students.find(s => s.nama.toLowerCase() === student.nama.toLowerCase());
              if (!exists) {
                students.push(student);
                importedCount++;
              }
            }
          }
          
          if (importedCount > 0) {
            await saveData();
            loadStudentTable();
            loadStudentOptions();
            updateStats();
            alert(`Berhasil mengimport ${importedCount} siswa dari Excel!`);
          } else {
            alert('Tidak ada data siswa baru yang diimport. Pastikan format Excel benar.');
          }
          
          fileInput.value = '';
        } catch (error) {
          alert('Error membaca file Excel: ' + error.message);
        }
      };
      
      reader.readAsArrayBuffer(file);
    }

    // Photo Upload Functions
    function uploadWaliFoto(input) {
      const file = input.files[0];
      if (file) {
        // Open crop modal for teacher photo
        openCropModal(file, function(croppedImageData) {
          const img = document.getElementById('wali-foto');
          const imgInput = document.getElementById('wali-foto-input');
          img.src = croppedImageData;
          if (imgInput) imgInput.src = croppedImageData;
          localStorage.setItem('wali-foto', croppedImageData);
        });
      }
    }
    
    function uploadWaliFotoInput(input) {
      const file = input.files[0];
      if (file) {
        // Open crop modal for teacher photo from input page
        openCropModal(file, function(croppedImageData) {
          const img = document.getElementById('wali-foto');
          const imgInput = document.getElementById('wali-foto-input');
          img.src = croppedImageData;
          imgInput.src = croppedImageData;
          localStorage.setItem('wali-foto', croppedImageData);
        });
      }
    }

    function previewFotoSiswa(input) {
      const file = input.files[0];
      if (file) {
        // Open crop modal instead of direct preview
        openCropModal(file, function(croppedImageData) {
          currentStudentPhoto = croppedImageData;
          document.getElementById('preview-img').src = croppedImageData;
          document.getElementById('foto-preview').classList.remove('hidden');
        });
      }
    }

    function removeFotoPreview() {
      document.getElementById('foto-preview').classList.add('hidden');
      document.getElementById('foto-siswa').value = '';
      currentStudentPhoto = null;
    }

    // Load saved photo on page load
    function loadWaliFoto() {
      const savedPhoto = localStorage.getItem('wali-foto');
      if (savedPhoto) {
        const img = document.getElementById('wali-foto');
        const imgInput = document.getElementById('wali-foto-input');
        if (img) img.src = savedPhoto;
        if (imgInput) imgInput.src = savedPhoto;
      }
    }

    function uploadLogoKelas(input) {
      const file = input.files[0];
      if (file) {
        // Open crop modal for class logo
        openCropModal(file, function(croppedImageData) {
          const img = document.getElementById('logo-kelas');
          img.src = croppedImageData;
          localStorage.setItem('logo-kelas', croppedImageData);
        });
      }
    }

    function loadLogoKelas() {
      const savedLogo = localStorage.getItem('logo-kelas');
      if (savedLogo) {
        document.getElementById('logo-kelas').src = savedLogo;
      }
    }

    // Enhanced Attendance System with Multi-Camera Support and Barcode Detection
    async function startScanner() {
      const reader = document.getElementById('reader');
      
      try {
        // Clear any existing scanner first
        if (html5QrCode) {
          try {
            await html5QrCode.stop();
            html5QrCode.clear();
          } catch (e) {
            console.log('Clearing previous scanner...');
          }
        }
        
        html5QrCode = new Html5Qrcode("reader");
        
        // Get available cameras with detailed logging
        const cameras = await Html5Qrcode.getCameras();
        console.log('📷 Available cameras:', cameras);
        
        let cameraConfig;
        
        if (cameras && cameras.length > 0) {
          // Try to find back camera first (mobile)
          const backCamera = cameras.find(camera => 
            camera.label.toLowerCase().includes('back') || 
            camera.label.toLowerCase().includes('rear') ||
            camera.label.toLowerCase().includes('environment') ||
            camera.label.toLowerCase().includes('facing back')
          );
          
          if (backCamera) {
            cameraConfig = { deviceId: { exact: backCamera.id } };
            console.log('✅ Using back camera:', backCamera.label);
          } else {
            // Use first available camera
            cameraConfig = { deviceId: { exact: cameras[0].id } };
            console.log('✅ Using first available camera:', cameras[0].label);
          }
        } else {
          // Fallback to facingMode
          cameraConfig = { facingMode: "environment" };
          console.log('✅ Using facingMode: environment (fallback)');
        }
        
        // Enhanced scanning configuration with barcode support
        const config = {
          fps: 15, // Increased FPS for better barcode detection
          qrbox: function(viewfinderWidth, viewfinderHeight) {
            // Responsive QR box sizing
            const minEdgePercentage = 0.8;
            const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
            return {
              width: qrboxSize,
              height: Math.floor(qrboxSize * 0.6) // Rectangular for better barcode scanning
            };
          },
          aspectRatio: 1.777778, // 16:9 aspect ratio for better barcode scanning
          disableFlip: false,
          // Enable all supported scan types including barcodes
          supportedScanTypes: [
            Html5QrcodeScanType.SCAN_TYPE_CAMERA
          ],
          // Enhanced experimental features for barcode detection
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          // Additional configuration for better barcode detection
          videoConstraints: {
            facingMode: "environment",
            advanced: [
              { focusMode: "continuous" },
              { exposureMode: "continuous" },
              { whiteBalanceMode: "continuous" }
            ]
          }
        };
        
        // Start scanner with enhanced error handling
        await html5QrCode.start(
          cameraConfig,
          config,
          (decodedText, decodedResult) => {
            console.log('🔍 Scan successful:', decodedText);
            console.log('📊 Scan result details:', decodedResult);
            
            // Vibrate on successful scan (mobile)
            if (navigator.vibrate) {
              navigator.vibrate(200);
            }
            
            handleScanResult(decodedText, 'attendance');
            stopScanner();
          },
          (errorMessage) => {
            // Handle scan errors silently - this is normal during scanning process
            // Only log significant errors
            if (errorMessage.includes('NotFoundException') === false) {
              console.log('Scanner feedback:', errorMessage);
            }
          }
        );
        
        // Update UI
        document.getElementById('start-scan').classList.add('hidden');
        document.getElementById('stop-scan').classList.remove('hidden');
        
        showScannerStatus('🎯 Scanner aktif - Arahkan ke QR Code atau Barcode', false);
        
        // Add scanning tips
        setTimeout(() => {
          showScannerStatus('💡 Tips: Pastikan barcode/QR code jelas dan tidak blur', false);
        }, 3000);
        
      } catch (err) {
        console.error('❌ Scanner initialization error:', err);
        
        // Enhanced error handling with specific solutions
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          showScannerStatus('❌ Akses kamera ditolak', true);
          alert(`❌ AKSES KAMERA DITOLAK!

🔧 SOLUSI:
1. Klik ikon 🔒 atau 📷 di address bar browser
2. Pilih "Allow/Izinkan" untuk kamera
3. Refresh halaman (F5) dan coba lagi
4. Pastikan tidak ada aplikasi lain yang menggunakan kamera

📱 MOBILE:
• Buka Settings > Apps > Browser > Permissions
• Aktifkan Camera permission

💻 PC/LAPTOP:
• Pastikan webcam terhubung dan berfungsi
• Cek Windows Camera app terlebih dahulu`);
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          showScannerStatus('❌ Kamera tidak ditemukan', true);
          alert(`❌ KAMERA TIDAK DITEMUKAN!

🔧 SOLUSI:
1. Pastikan perangkat memiliki kamera
2. Tutup aplikasi lain yang menggunakan kamera
3. Restart browser dan coba lagi

📱 MOBILE:
• Pastikan kamera tidak rusak
• Coba buka aplikasi kamera bawaan

💻 PC/LAPTOP:
• Periksa koneksi webcam
• Update driver kamera
• Coba webcam di aplikasi lain`);
        } else if (err.name === 'NotSupportedError') {
          showScannerStatus('❌ Browser tidak mendukung', true);
          alert(`❌ BROWSER TIDAK MENDUKUNG KAMERA!

🌐 GUNAKAN BROWSER MODERN:
✅ Chrome (Recommended)
✅ Microsoft Edge
✅ Firefox
✅ Safari (iOS/Mac)

⚠️ HINDARI:
❌ Internet Explorer
❌ Browser lama/tidak update

💡 UPDATE BROWSER:
Pastikan browser Anda versi terbaru`);
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          showScannerStatus('❌ Kamera sedang digunakan', true);
          alert(`❌ KAMERA SEDANG DIGUNAKAN!

🔧 SOLUSI:
1. Tutup aplikasi lain yang menggunakan kamera
2. Tutup tab browser lain yang mengakses kamera
3. Restart browser
4. Restart perangkat jika perlu

📱 APLIKASI YANG MUNGKIN MENGGUNAKAN KAMERA:
• WhatsApp Web
• Zoom/Teams
• Instagram Web
• Aplikasi video call lainnya`);
        } else {
          // Try fallback method for unknown errors
          console.log('🔄 Trying fallback scanner method...');
          await tryFallbackScanner();
        }
      }
    }
    
    // Enhanced fallback scanner method with multiple attempts
    async function tryFallbackScanner() {
      const fallbackMethods = [
        // Method 1: Basic environment camera
        {
          name: 'Environment Camera',
          config: { facingMode: { ideal: "environment" } },
          scanConfig: {
            fps: 10,
            qrbox: function(viewfinderWidth, viewfinderHeight) {
              const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.7;
              return { width: size, height: size * 0.6 };
            },
            aspectRatio: 1.5,
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true
            }
          }
        },
        // Method 2: Any available camera
        {
          name: 'Any Camera',
          config: { facingMode: "user" },
          scanConfig: {
            fps: 8,
            qrbox: 250,
            aspectRatio: 1.0
          }
        },
        // Method 3: Basic configuration
        {
          name: 'Basic Scanner',
          config: true, // Use default camera
          scanConfig: {
            fps: 5,
            qrbox: 200
          }
        }
      ];
      
      for (let i = 0; i < fallbackMethods.length; i++) {
        const method = fallbackMethods[i];
        
        try {
          console.log(`🔄 Trying fallback method ${i + 1}: ${method.name}`);
          
          // Clear previous scanner
          if (html5QrCode) {
            try {
              await html5QrCode.stop();
              html5QrCode.clear();
            } catch (e) {
              console.log('Clearing scanner...');
            }
          }
          
          html5QrCode = new Html5Qrcode("reader");
          
          await html5QrCode.start(
            method.config,
            method.scanConfig,
            (decodedText, decodedResult) => {
              console.log(`✅ Fallback scan successful (${method.name}):`, decodedText);
              
              // Vibrate on successful scan
              if (navigator.vibrate) {
                navigator.vibrate(200);
              }
              
              handleScanResult(decodedText, 'attendance');
              stopScanner();
            },
            (errorMessage) => {
              // Silent error handling during scanning
              if (!errorMessage.includes('NotFoundException')) {
                console.log(`Scanner feedback (${method.name}):`, errorMessage);
              }
            }
          );
          
          // If we reach here, scanner started successfully
          document.getElementById('start-scan').classList.add('hidden');
          document.getElementById('stop-scan').classList.remove('hidden');
          showScannerStatus(`🔄 Scanner fallback aktif (${method.name})`, false);
          
          console.log(`✅ Fallback method ${i + 1} successful: ${method.name}`);
          return; // Exit function on success
          
        } catch (fallbackErr) {
          console.error(`❌ Fallback method ${i + 1} failed (${method.name}):`, fallbackErr.message);
          
          // Continue to next method if this one fails
          if (i === fallbackMethods.length - 1) {
            // This was the last method, show final error
            showScannerStatus('❌ Semua metode scanner gagal', true);
            
            alert(`❌ TIDAK DAPAT MENGAKSES KAMERA!

🔧 SEMUA METODE TELAH DICOBA:
1. Environment Camera - ${fallbackMethods[0].name}
2. User Camera - ${fallbackMethods[1].name}  
3. Basic Scanner - ${fallbackMethods[2].name}

💡 SOLUSI TERAKHIR:
1. Restart browser sepenuhnya
2. Restart perangkat
3. Coba browser berbeda
4. Pastikan menggunakan HTTPS
5. Periksa antivirus/firewall

🌐 BROWSER YANG DIREKOMENDASIKAN:
• Chrome (terbaik untuk scanner)
• Microsoft Edge
• Firefox

📱 MOBILE:
• Pastikan tidak ada aplikasi lain yang menggunakan kamera
• Coba mode incognito/private browsing

Error terakhir: ${fallbackErr.message}`);
          }
        }
      }
    }
    
    // Enhanced universal scan result handler with better barcode support
    function handleScanResult(decodedText, scanType) {
      console.log('🔍 Processing scan result:', decodedText);
      console.log('📊 Scan type:', scanType);
      
      // Clean the decoded text
      const cleanText = decodedText.trim();
      
      try {
        // Try to parse as JSON (QR Code format)
        const studentData = JSON.parse(cleanText);
        
        console.log('✅ QR Code detected:', studentData);
        
        if (studentData.id && studentData.nama && studentData.kelas) {
          if (scanType === 'attendance') {
            markAttendance(studentData.id, studentData.nama, studentData.kelas);
          } else if (scanType === 'prayer') {
            showPrayerSelectionModal(studentData.id, studentData.nama, studentData.kelas);
          }
          return;
        }
        
      } catch (e) {
        console.log('📱 Not JSON format, treating as barcode:', cleanText);
      }
      
      // Enhanced barcode processing with multiple search methods
      let foundStudent = null;
      
      // Method 1: Exact ID match
      foundStudent = students.find(s => s.id.toString() === cleanText);
      if (foundStudent) {
        console.log('✅ Found by ID:', foundStudent);
      }
      
      // Method 2: Exact name match (case insensitive)
      if (!foundStudent) {
        foundStudent = students.find(s => 
          s.nama.toLowerCase() === cleanText.toLowerCase()
        );
        if (foundStudent) {
          console.log('✅ Found by exact name:', foundStudent);
        }
      }
      
      // Method 3: Partial name match
      if (!foundStudent) {
        foundStudent = students.find(s => 
          s.nama.toLowerCase().includes(cleanText.toLowerCase()) ||
          cleanText.toLowerCase().includes(s.nama.toLowerCase())
        );
        if (foundStudent) {
          console.log('✅ Found by partial name:', foundStudent);
        }
      }
      
      // Method 4: Name without spaces/special characters
      if (!foundStudent) {
        const cleanScanText = cleanText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        foundStudent = students.find(s => {
          const cleanStudentName = s.nama.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          return cleanStudentName === cleanScanText || 
                 cleanStudentName.includes(cleanScanText) ||
                 cleanScanText.includes(cleanStudentName);
        });
        if (foundStudent) {
          console.log('✅ Found by cleaned name:', foundStudent);
        }
      }
      
      // Method 5: Search by class info if included
      if (!foundStudent && cleanText.includes('-')) {
        const parts = cleanText.split('-');
        for (const part of parts) {
          const trimmedPart = part.trim();
          foundStudent = students.find(s => 
            s.nama.toLowerCase().includes(trimmedPart.toLowerCase()) ||
            s.kelas.toLowerCase().includes(trimmedPart.toLowerCase())
          );
          if (foundStudent) {
            console.log('✅ Found by class info:', foundStudent);
            break;
          }
        }
      }
      
      // Method 6: Fuzzy search for similar names
      if (!foundStudent) {
        const searchText = cleanText.toLowerCase();
        foundStudent = students.find(s => {
          const studentName = s.nama.toLowerCase();
          // Check if at least 70% of characters match
          let matchCount = 0;
          const minLength = Math.min(searchText.length, studentName.length);
          
          for (let i = 0; i < minLength; i++) {
            if (searchText[i] === studentName[i]) {
              matchCount++;
            }
          }
          
          const similarity = matchCount / Math.max(searchText.length, studentName.length);
          return similarity >= 0.7;
        });
        if (foundStudent) {
          console.log('✅ Found by fuzzy search:', foundStudent);
        }
      }
      
      if (foundStudent) {
        // Show confirmation for barcode scans
        const confirmMessage = `📱 BARCODE TERDETEKSI!\n\n` +
          `Siswa: ${foundStudent.nama}\n` +
          `Kelas: ${foundStudent.kelas}\n` +
          `Barcode: "${cleanText}"\n\n` +
          `Lanjutkan ${scanType === 'attendance' ? 'absensi' : 'kontrol sholat'}?`;
        
        if (confirm(confirmMessage)) {
          if (scanType === 'attendance') {
            markAttendance(foundStudent.id, foundStudent.nama, foundStudent.kelas);
          } else if (scanType === 'prayer') {
            showPrayerSelectionModal(foundStudent.id, foundStudent.nama, foundStudent.kelas);
          }
        }
      } else {
        // Enhanced error message with suggestions
        console.log('❌ Student not found for:', cleanText);
        
        // Find similar names for suggestions
        const suggestions = students.filter(s => {
          const studentName = s.nama.toLowerCase();
          const searchText = cleanText.toLowerCase();
          return studentName.includes(searchText.substring(0, 3)) || 
                 searchText.includes(studentName.substring(0, 3));
        }).slice(0, 3);
        
        let suggestionText = '';
        if (suggestions.length > 0) {
          suggestionText = '\n\n🔍 MUNGKIN MAKSUD ANDA:\n' + 
            suggestions.map(s => `• ${s.nama} - ${s.kelas}`).join('\n');
        }
        
        const errorMessage = `❌ SISWA TIDAK DITEMUKAN!\n\n` +
          `📱 Barcode: "${cleanText}"\n` +
          `📊 Total siswa: ${students.length}\n\n` +
          `🔧 PASTIKAN:\n` +
          `1. Barcode sesuai dengan nama siswa\n` +
          `2. Data siswa sudah diinput di sistem\n` +
          `3. Barcode tidak blur/rusak\n` +
          `4. Pencahayaan cukup saat scan\n\n` +
          `💡 TIPS:\n` +
          `• Coba scan ulang dengan jarak berbeda\n` +
          `• Pastikan barcode dalam kondisi baik\n` +
          `• Gunakan absensi manual jika perlu` +
          suggestionText;
        
        alert(errorMessage);
      }
    }
    
    // Scanner status indicator
    function showScannerStatus(message, isError = false) {
      const statusDiv = document.createElement('div');
      statusDiv.className = `mt-2 p-2 rounded text-sm text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
      statusDiv.textContent = message;
      
      const reader = document.getElementById('reader');
      const existingStatus = reader.querySelector('.scanner-status');
      if (existingStatus) {
        existingStatus.remove();
      }
      
      statusDiv.classList.add('scanner-status');
      reader.appendChild(statusDiv);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (statusDiv.parentNode) {
          statusDiv.remove();
        }
      }, 5000);
    }

    function stopScanner() {
      if (html5QrCode) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
          document.getElementById('start-scan').classList.remove('hidden');
          document.getElementById('stop-scan').classList.add('hidden');
        });
      }
    }

    // Enhanced Prayer Scanner Functions
    async function startPrayerScanner() {
      const reader = document.getElementById('prayer-reader');
      
      try {
        html5QrCodePrayer = new Html5Qrcode("prayer-reader");
        
        // Get available cameras
        const cameras = await Html5Qrcode.getCameras();
        console.log('Prayer scanner - Available cameras:', cameras);
        
        let cameraConfig;
        
        if (cameras && cameras.length > 0) {
          // Try to find back camera first (mobile)
          const backCamera = cameras.find(camera => 
            camera.label.toLowerCase().includes('back') || 
            camera.label.toLowerCase().includes('rear') ||
            camera.label.toLowerCase().includes('environment')
          );
          
          if (backCamera) {
            cameraConfig = { deviceId: { exact: backCamera.id } };
            console.log('Prayer scanner using back camera:', backCamera.label);
          } else {
            // Use first available camera
            cameraConfig = { deviceId: { exact: cameras[0].id } };
            console.log('Prayer scanner using first camera:', cameras[0].label);
          }
        } else {
          // Fallback to facingMode
          cameraConfig = { facingMode: "environment" };
          console.log('Prayer scanner using facingMode: environment');
        }
        
        // Enhanced scanning configuration for prayer
        const config = {
          fps: 10,
          qrbox: function(viewfinderWidth, viewfinderHeight) {
            // Square QR box with responsive sizing
            const minEdgePercentage = 0.7;
            const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
            return {
              width: qrboxSize,
              height: qrboxSize
            };
          },
          aspectRatio: 1.0,
          disableFlip: false,
          supportedScanTypes: [
            Html5QrcodeScanType.SCAN_TYPE_CAMERA
          ],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true
        };
        
        await html5QrCodePrayer.start(
          cameraConfig,
          config,
          (decodedText, decodedResult) => {
            console.log('Prayer scanned:', decodedText);
            handleScanResult(decodedText, 'prayer');
            stopPrayerScanner();
          },
          (errorMessage) => {
            // Handle scan error silently - this is normal during scanning
          }
        );
        
        document.getElementById('start-prayer-scan').classList.add('hidden');
        document.getElementById('stop-prayer-scan').classList.remove('hidden');
        
        showPrayerScannerStatus('Scanner sholat aktif - Arahkan ke QR Code atau Barcode');
        
      } catch (err) {
        console.error('Prayer scanner error:', err);
        
        // Try alternative camera access methods
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          alert('❌ Akses kamera ditolak untuk scanner sholat!\n\nUntuk menggunakan scanner:\n1. Klik ikon kunci/kamera di address bar\n2. Pilih "Allow" untuk kamera\n3. Refresh halaman dan coba lagi');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          alert('❌ Kamera tidak ditemukan untuk scanner sholat!\n\nPastikan:\n1. Perangkat memiliki kamera\n2. Kamera tidak digunakan aplikasi lain\n3. Driver kamera terinstall (PC)');
        } else if (err.name === 'NotSupportedError') {
          alert('❌ Browser tidak mendukung akses kamera untuk scanner sholat!\n\nGunakan browser modern seperti:\n• Chrome/Edge (Recommended)\n• Firefox\n• Safari');
        } else {
          // Try fallback method
          await tryFallbackPrayerScanner();
        }
      }
    }
    
    // Fallback prayer scanner method
    async function tryFallbackPrayerScanner() {
      try {
        console.log('Trying fallback prayer scanner method...');
        
        html5QrCodePrayer = new Html5Qrcode("prayer-reader");
        
        // Simple fallback configuration
        await html5QrCodePrayer.start(
          { facingMode: { ideal: "environment" } },
          {
            fps: 5,
            qrbox: 200,
            aspectRatio: 1.0
          },
          (decodedText, decodedResult) => {
            console.log('Fallback prayer scan result:', decodedText);
            handleScanResult(decodedText, 'prayer');
            stopPrayerScanner();
          },
          (errorMessage) => {
            // Silent error handling
          }
        );
        
        document.getElementById('start-prayer-scan').classList.add('hidden');
        document.getElementById('stop-prayer-scan').classList.remove('hidden');
        showPrayerScannerStatus('Scanner sholat fallback aktif');
        
      } catch (fallbackErr) {
        console.error('Fallback prayer scanner failed:', fallbackErr);
        alert('❌ Tidak dapat mengakses kamera untuk scanner sholat!\n\nSolusi:\n1. Pastikan browser mendukung kamera\n2. Berikan izin akses kamera\n3. Coba refresh halaman\n4. Gunakan HTTPS jika di server\n\nError: ' + fallbackErr.message);
      }
    }
    
    // Prayer scanner status indicator
    function showPrayerScannerStatus(message, isError = false) {
      const statusDiv = document.createElement('div');
      statusDiv.className = `mt-2 p-2 rounded text-sm text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
      statusDiv.textContent = message;
      
      const reader = document.getElementById('prayer-reader');
      const existingStatus = reader.querySelector('.scanner-status');
      if (existingStatus) {
        existingStatus.remove();
      }
      
      statusDiv.classList.add('scanner-status');
      reader.appendChild(statusDiv);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (statusDiv.parentNode) {
          statusDiv.remove();
        }
      }, 5000);
    }

    function stopPrayerScanner() {
      if (html5QrCodePrayer) {
        html5QrCodePrayer.stop().then(() => {
          html5QrCodePrayer.clear();
          document.getElementById('start-prayer-scan').classList.remove('hidden');
          document.getElementById('stop-prayer-scan').classList.add('hidden');
        });
      }
    }

    function absensiManual() {
      const select = document.getElementById('manual-siswa');
      const studentId = select.value;
      
      if (!studentId) {
        alert('Pilih siswa terlebih dahulu!');
        return;
      }
      
      const student = students.find(s => s.id == studentId);
      if (student) {
        markAttendance(student.id, student.nama, student.kelas);
        select.value = '';
      }
    }

    async function markAttendance(studentId, nama, kelas) {
      const today = new Date().toDateString();
      const now = new Date();
      
      // Check if already marked today
      const existingAttendance = attendance.find(a => 
        a.studentId == studentId && a.date === today
      );
      
      if (existingAttendance) {
        alert(`${nama} sudah absen hari ini!`);
        return;
      }
      
      const attendanceRecord = {
        studentId: studentId,
        nama: nama,
        kelas: kelas,
        date: today,
        time: now.toLocaleTimeString(),
        timestamp: now.getTime()
      };
      
      attendance.push(attendanceRecord);
      await saveData();
      
      loadAbsensiTable();
      updateStats();
      
      alert(`${nama} berhasil diabsen!`);
    }

    function loadAbsensiTable() {
      const tbody = document.getElementById('absensi-tbody');
      const today = new Date().toDateString();
      
      tbody.innerHTML = '';
      
      // Get today's attendance
      const todayAttendance = attendance.filter(a => a.date === today);
      
      // Show all students with their attendance status
      students.forEach(student => {
        const attendanceRecord = todayAttendance.find(a => a.studentId == student.id);
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        
        if (attendanceRecord) {
          row.innerHTML = `
            <td class="p-4 font-medium">${student.nama}</td>
            <td class="p-4">${student.kelas}</td>
            <td class="p-4">
              <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Hadir
              </span>
            </td>
            <td class="p-4">${attendanceRecord.time}</td>
          `;
        } else {
          row.innerHTML = `
            <td class="p-4 font-medium">${student.nama}</td>
            <td class="p-4">${student.kelas}</td>
            <td class="p-4">
              <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Tidak Hadir
              </span>
            </td>
            <td class="p-4">-</td>
          `;
        }
        
        tbody.appendChild(row);
      });
    }

    function loadStudentOptions() {
      const select = document.getElementById('manual-siswa');
      select.innerHTML = '<option value="">Pilih Siswa</option>';
      
      students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.nama} - ${student.kelas}`;
        select.appendChild(option);
      });
    }

    // Dashboard
    function loadDashboard() {
      loadAttendanceChart();
      loadWeeklyChart();
      loadMonthlyRecap();
    }

    function loadAttendanceChart() {
      const ctx = document.getElementById('attendanceChart').getContext('2d');
      const today = new Date().toDateString();
      const todayAttendance = attendance.filter(a => a.date === today);
      
      const present = todayAttendance.length;
      const absent = students.length - present;
      
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Hadir', 'Tidak Hadir'],
          datasets: [{
            data: [present, absent],
            backgroundColor: ['#10B981', '#EF4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    function loadWeeklyChart() {
      const ctx = document.getElementById('weeklyChart').getContext('2d');
      
      // Get last 7 days
      const days = [];
      const attendanceCounts = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toDateString();
        
        days.push(date.toLocaleDateString('id-ID', { weekday: 'short' }));
        attendanceCounts.push(attendance.filter(a => a.date === dateString).length);
      }
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Kehadiran',
            data: attendanceCounts,
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: students.length
            }
          }
        }
      });
    }

    function loadMonthlyRecap() {
      const tbody = document.getElementById('monthly-recap');
      tbody.innerHTML = '';
      
      students.forEach(student => {
        const studentAttendance = attendance.filter(a => a.studentId == student.id);
        const totalPresent = studentAttendance.length;
        const totalDays = 30; // Assume 30 days in a month
        const percentage = totalDays > 0 ? ((totalPresent / totalDays) * 100).toFixed(1) : 0;
        
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        row.innerHTML = `
          <td class="p-4 font-medium">${student.nama}</td>
          <td class="p-4">${totalPresent}</td>
          <td class="p-4">${totalDays - totalPresent}</td>
          <td class="p-4">
            <div class="flex items-center">
              <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: ${percentage}%"></div>
              </div>
              <span class="text-sm font-medium">${percentage}%</span>
            </div>
          </td>
        `;
        tbody.appendChild(row);
      });
    }

    // Utilities
    function updateStats() {
      const today = new Date().toDateString();
      const todayAttendance = attendance.filter(a => a.date === today);
      
      document.getElementById('total-siswa').textContent = students.length;
      document.getElementById('hadir-hari-ini').textContent = todayAttendance.length;
      document.getElementById('tidak-hadir').textContent = students.length - todayAttendance.length;
    }

    function updateTanggalHariIni() {
      const today = new Date();
      document.getElementById('tanggal-hari-ini').textContent = 
        today.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
    }

    function exportRekap() {
      let csv = 'Nama,Kelas,Tanggal,Waktu,Status\n';
      
      students.forEach(student => {
        const studentAttendance = attendance.filter(a => a.studentId == student.id);
        
        if (studentAttendance.length > 0) {
          studentAttendance.forEach(record => {
            csv += `${student.nama},${student.kelas},${record.date},${record.time},Hadir\n`;
          });
        } else {
          csv += `${student.nama},${student.kelas},-,-,Tidak Ada Data\n`;
        }
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rekap_absensi_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }

    function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => card.classList.toggle('dark-mode'));
    }

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'965204853532f8ee',t:'MTc1MzUxMzIwMS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();