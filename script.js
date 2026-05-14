document.addEventListener('DOMContentLoaded', () => {
    // 0. Custom Modal Utility
    const showModal = ({ title, message, placeholder, type = 'alert', onConfirm }) => {
        let overlay = document.querySelector('.modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-container">
                    <div class="modal-header"><h3></h3></div>
                    <div class="modal-body"><p></p><input type="text" class="modal-input"></div>
                    <div class="modal-footer">
                        <button class="modal-btn secondary">Cancel</button>
                        <button class="modal-btn primary">Confirm</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const h3 = overlay.querySelector('h3');
        const p = overlay.querySelector('p');
        const input = overlay.querySelector('.modal-input');
        const cancelBtn = overlay.querySelector('.secondary');
        const confirmBtn = overlay.querySelector('.primary');

        h3.innerText = title;
        p.innerText = message;
        input.value = placeholder || '';
        input.style.display = type === 'prompt' ? 'block' : 'none';
        cancelBtn.style.display = type === 'prompt' || type === 'confirm' ? 'block' : 'none';
        
        overlay.style.display = 'flex';

        const close = () => overlay.style.display = 'none';

        confirmBtn.onclick = () => {
            if (onConfirm) onConfirm(type === 'prompt' ? input.value : true);
            close();
        };
        cancelBtn.onclick = close;
        overlay.onclick = (e) => { if(e.target === overlay) close(); };
    };

    // 1. Sidebar Navigation
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item, .sidebar-bottom .nav-item');

    // 2. Smooth Number Counters
    const animateValue = (element, start, end, duration, prefix = '', suffix = '', isDecimal = false) => {
        if (!element) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            let currentVal = start + easeOut * (end - start);
            if (isDecimal) element.innerHTML = `${prefix}${currentVal.toFixed(2)}${suffix}`;
            else element.innerHTML = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    };

    // Initialize Counters (Index Page)
    const spentEl = document.querySelector('.top-row .stat-card:nth-child(1) h2');
    if (spentEl) animateValue(spentEl, 0, 682.5, 1500, '$', '', true);

    const clientsEl = document.querySelector('.top-row .stat-card:nth-child(2) h2');
    if (clientsEl) animateValue(clientsEl, 0, 321, 1500, '', '', false);

    const earningsEl = document.querySelector('.top-row .stat-card:nth-child(3) h2');
    if (earningsEl) animateValue(earningsEl, 0, 350.40, 1500, '$', '', true);

    const activityEl = document.querySelector('.top-row .stat-card:nth-child(4) h2');
    if (activityEl) animateValue(activityEl, 0, 540.50, 1500, '$', '', true);

    // 3. Search Bar
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-bar input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value;
            if (query) showModal({ title: 'Search', message: `Displaying results for: ${query}` });
            else showModal({ title: 'Search', message: 'Please enter a search term.' });
        });
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchBtn.click(); });
    }

    // 4. Notifications
    const bellBtn = document.getElementById('bell-btn');
    if (bellBtn) {
        bellBtn.addEventListener('click', () => {
            showModal({ title: 'Notifications', message: 'You have 3 new notifications regarding your property.' });
        });
    }

    const msgBtn = document.getElementById('msg-btn');
    if (msgBtn) {
        msgBtn.addEventListener('click', () => {
            showModal({ title: 'Messages', message: 'New message from Anna Jones: "The quarterly report is ready for review."' });
            msgBtn.querySelector('.badge').style.display = 'none';
        });
    }

    // 5. Card Management
    const addCardBtn = document.getElementById('add-card-btn');
    if (addCardBtn) {
        addCardBtn.addEventListener('click', () => {
            showModal({ 
                title: 'Add New Card', 
                message: 'Please enter the card holder name:', 
                type: 'prompt', 
                placeholder: 'CARLIC BOLOMBOY',
                onConfirm: (val) => {
                    if(val) showModal({ title: 'Success', message: `Card for ${val} has been added!` });
                }
            });
        });
    }

    // 6. Security
    const securityBtn = document.getElementById('update-security-btn');
    if (securityBtn) {
        securityBtn.addEventListener('click', () => {
            showModal({ 
                title: 'Security Update', 
                message: 'Enter your new security password:', 
                type: 'prompt',
                onConfirm: (val) => {
                    if(val) showModal({ title: 'Security', message: 'Your password has been updated securely.' });
                }
            });
        });
    }

    // 7. Dark Mode
    const darkModeBtn = document.getElementById('dark-mode-btn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            const isDark = document.body.style.backgroundColor === 'rgb(10, 12, 16)';
            if (!isDark) {
                document.documentElement.style.setProperty('--bg-color', '#0A0C10');
                document.documentElement.style.setProperty('--card-bg', '#12161F');
                document.documentElement.style.setProperty('--primary-text', '#FFFFFF');
                document.body.style.backgroundColor = '#0A0C10';
                darkModeBtn.innerText = 'Disable';
                showModal({ title: 'Theme', message: 'Dark mode has been enabled.' });
            } else {
                location.reload();
            }
        });
    }

    // 8. User Management
    const userTable = document.getElementById('user-table-body');
    if (userTable) {
        userTable.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const row = btn.closest('tr');
            const userName = row.querySelector('td:first-child span').innerText;

            if (btn.title === 'Edit Role') {
                showModal({
                    title: 'Edit Role',
                    message: `Change role for ${userName}:`,
                    type: 'prompt',
                    placeholder: row.querySelector('td:nth-child(2)').innerText,
                    onConfirm: (val) => {
                        if(val) row.querySelector('td:nth-child(2)').innerText = val;
                    }
                });
            } else if (btn.title === 'Delete User') {
                showModal({
                    title: 'Delete User',
                    message: `Are you sure you want to remove ${userName}?`,
                    type: 'confirm',
                    onConfirm: () => {
                        row.style.opacity = '0';
                        setTimeout(() => row.remove(), 300);
                    }
                });
            }
        });
    }

    // 9. Analytical/Project/Document Functionalities (Syncing with new Modal)
    // Create New Project (project.html)
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            showModal({
                title: 'New Project',
                message: 'Enter project name:',
                type: 'prompt',
                onConfirm: (val) => {
                    if (val) {
                        const container = document.getElementById('projects-container');
                        const newCard = document.createElement('div');
                        newCard.className = 'card';
                        newCard.style.animation = 'fadeInUp 0.5s ease forwards';
                        newCard.innerHTML = `<h3>${val}</h3><p>Active Project</p><span class="status-badge">New</span>`;
                        container.prepend(newCard);
                    }
                }
            });
        });
    }

    // Create New User (user.html)
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            showModal({
                title: 'Create New User',
                message: 'Enter user full name:',
                type: 'prompt',
                placeholder: 'John Doe',
                onConfirm: (val) => {
                    if (val) {
                        const tableBody = document.getElementById('user-table-body');
                        const roles = ['Admin', 'Editor', 'Viewer', 'Manager'];
                        const randomRole = roles[Math.floor(Math.random() * roles.length)];
                        const newRow = document.createElement('tr');
                        newRow.style.borderBottom = '1px solid var(--borders)';
                        newRow.style.animation = 'fadeInUp 0.5s ease forwards';
                        
                        newRow.innerHTML = `
                            <td style="padding: 16px; display: flex; align-items: center; gap: 12px;">
                                <img src="https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}" style="width: 32px; height: 32px; border-radius: 50%;">
                                <span>${val}</span>
                            </td>
                            <td style="padding: 16px;">${randomRole}</td>
                            <td style="padding: 16px;"><span class="status-badge">Active</span></td>
                            <td style="padding: 16px;">
                                <button class="icon-btn" style="width: 32px; height: 32px; display: inline-flex;" title="Edit Role"><i data-lucide="edit-2" style="width: 14px;"></i></button>
                                <button class="icon-btn" style="width: 32px; height: 32px; display: inline-flex; color: #FF5A5F;" title="Delete User"><i data-lucide="trash-2" style="width: 14px;"></i></button>
                            </td>
                        `;
                        tableBody.prepend(newRow);
                        lucide.createIcons();
                    }
                }
            });
        });
    }

    // Create New View (analytical.html)
    const createViewBtn = document.getElementById('create-view-btn');
    if (createViewBtn) {
        createViewBtn.addEventListener('click', () => {
            showModal({
                title: 'New Metric View',
                message: 'Enter metric name:',
                type: 'prompt',
                placeholder: 'Active Sessions',
                onConfirm: (val) => {
                    if (val) {
                        const container = document.getElementById('analytical-top-row');
                        const newCard = document.createElement('div');
                        newCard.className = 'stat-card';
                        newCard.style.animation = 'fadeInUp 0.5s ease forwards';
                        newCard.innerHTML = `
                            <div class="stat-info">
                                <h3>${val}</h3>
                                <h2>${Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</h2>
                                <span class="positive">+${(Math.random() * 10).toFixed(1)}%</span>
                            </div>
                        `;
                        container.appendChild(newCard);
                    }
                }
            });
        });
    }

    // Upload File (document.html)
    const uploadBtn = document.getElementById('upload-file-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            showModal({
                title: 'Upload File',
                message: 'Enter filename:',
                type: 'prompt',
                placeholder: 'Report_2026.pdf',
                onConfirm: (val) => {
                    if (val) {
                        const list = document.getElementById('files-list');
                        const newFile = document.createElement('div');
                        newFile.style.cssText = 'display:flex; align-items:center; gap:16px; padding:12px; background:#FFF; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.02); border:1px solid var(--borders); animation:fadeInRight 0.5s ease forwards;';
                        const ext = val.split('.').pop().toLowerCase();
                        const icon = (ext === 'png' || ext === 'jpg') ? 'image' : 'file-text';
                        newFile.innerHTML = `
                            <i data-lucide="${icon}" style="color:var(--accent-green)"></i>
                            <div style="flex-grow:1">
                                <h4 style="font-size:14px">${val}</h4>
                                <span style="font-size:12px;color:var(--secondary-text)">${(Math.random()*5+1).toFixed(1)} MB • Just Now</span>
                            </div>
                            <button class="icon-btn" style="width:32px;height:32px"><i data-lucide="download" style="width:16px"></i></button>
                        `;
                        list.prepend(newFile);
                        lucide.createIcons();
                    }
                }
            });
        });
    }

    // Pill Selection
    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
        });
    });

    // Share/Export simulation
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            showModal({ title: 'Share', message: 'Share link copied to clipboard!' });
        });
    }

    // Dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', () => {
            const current = dropdown.querySelector('span').innerText;
            showModal({ title: 'Menu', message: `Option selected: ${current}` });
        });
    });

    // Circular Progress
    const progressPath = document.querySelector('.progress-path');
    if(progressPath) {
        const pathLength = progressPath.getTotalLength();
        progressPath.style.strokeDasharray = pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)';
        progressPath.style.strokeDashoffset = pathLength - (pathLength * 0.8);
    }
});
