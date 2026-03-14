// speedtest-worker.js

self.onmessage = (event) => {
    const { type, url, size } = event.data;

    if (type === 'start-download') {
        measureDownload(url);
    } else if (type === 'start-upload') {
        measureUpload(url, size);
    }
};

async function measureDownload(url) {
    try {
        const startTime = Date.now();
        const response = await fetch(url + '?r=' + Math.random(), { cache: 'no-store' });
        
        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const total = Number(response.headers.get('Content-Length'));
        if (!total) {
            // Content-Length가 없는 경우, 10MB 파일 기준으로 진행
            console.warn('Content-Length header not found. Using default size for progress.');
        }
        const reader = response.body.getReader();
        let loaded = 0;
        let lastUpdate = startTime;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            loaded += value.length;
            const now = Date.now();
            const duration = (now - startTime) / 1000;
            const speed = duration > 0 ? (loaded * 8) / duration / 1000 / 1000 : 0;

            // 100ms 마다 진행 상황 업데이트
            if (now - lastUpdate > 100) {
                 self.postMessage({
                    type: 'progress',
                    progress: total ? (loaded / total) : 0, // total이 없으면 진행률은 0
                    speed: speed.toFixed(2),
                });
                lastUpdate = now;
            }
        }
        
        const finalDuration = (Date.now() - startTime) / 1000;
        const finalSpeed = finalDuration > 0.1 ? (loaded * 8) / finalDuration / 1000 / 1000 : 0;

        self.postMessage({ type: 'complete', finalSpeed: finalSpeed.toFixed(2) });

    } catch (error) {
        console.error('Download worker error:', error);
        self.postMessage({ type: 'error', message: error.message });
    }
}


function measureUpload(url, size) {
    try {
        const data = new Blob([new ArrayBuffer(size)], { type: 'application/octet-stream' });
        const xhr = new XMLHttpRequest();
        const startTime = Date.now();
        let lastUpdate = startTime;

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const now = Date.now();
                const duration = (now - startTime) / 1000;
                const speed = duration > 0 ? (event.loaded * 8) / duration / 1000 / 1000 : 0;
                
                // 100ms 마다 업데이트
                if (now - lastUpdate > 100 || event.loaded === event.total) {
                    self.postMessage({
                        type: 'progress',
                        progress: event.loaded / event.total,
                        speed: speed.toFixed(2),
                    });
                    lastUpdate = now;
                }
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const duration = (Date.now() - startTime) / 1000;
                const finalSpeed = duration > 0.01 ? (size * 8) / duration / 1000 / 1000 : 0;
                self.postMessage({ type: 'complete', finalSpeed: finalSpeed.toFixed(2) });
            } else {
                throw new Error('Server error: ' + xhr.status);
            }
        };

        xhr.onerror = () => {
            throw new Error('XHR connection error.');
        };
        
        xhr.open('POST', url, true);
        xhr.send(data);

    } catch (error) {
        console.error('Upload worker error:', error);
        self.postMessage({ type: 'error', message: error.message });
    }
}