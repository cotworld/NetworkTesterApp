// speedtest.js (v3.2 - UI Optimized & Visual Banner Integration)

const SERVER_URL = "https://speedtest.cotworld.synology.me:7749";
const WS_URL = "wss://speedtest.cotworld.synology.me:3002";

let fullMnoDatabase = {};
let isDbLoadedFromWeb = false;

const fallbackMnoDatabase = {
    'af': { name: '아프가니스탄', mnos: ['AWCC', 'Etisalat', 'MTN', 'Roshan', 'Salaam'] },
    'al': { name: '알바니아', mnos: ['ALBtelecom', 'One', 'Vodafone'] },
    'dz': { name: '알제리', mnos: ['ATM Mobilis', 'Djezzy', 'Ooredoo'] },
    'ar': { name: '아르헨티나', mnos: ['Claro', 'Movistar', 'Personal'] },
    'am': { name: '아르메니아', mnos: ['Team', 'Ucom', 'Viva-MTS'] },
    'au': { name: '호주', mnos: ['Telstra', 'Optus', 'Vodafone (TPG)'] },
    'at': { name: '오스트리아', mnos: ['A1', 'Drei', 'Magenta'] },
    'az': { name: '아제르바이잔', mnos: ['Azercell', 'Bakcell', 'Nar'] },
    'bh': { name: '바레인', mnos: ['Batelco', 'stc', 'Zain'] },
    'bd': { name: '방글라데시', mnos: ['Grameenphone', 'Robi', 'Banglalink', 'Teletalk'] },
    'by': { name: '벨라루스', mnos: ['A1', 'MTS', 'life:)'] },
    'be': { name: '벨기에', mnos: ['Proximus', 'Orange', 'Telenet/BASE'] },
    'bo': { name: '볼리비아', mnos: ['Entel', 'Tigo', 'Viva'] },
    'br': { name: '브라질', mnos: ['Vivo', 'Claro', 'TIM', 'Oi'] },
    'bg': { name: '불가리아', mnos: ['A1', 'Telenor', 'Vivacom'] },
    'kh': { name: '캄보디아', mnos: ['Cellcard', 'Metfone', 'Smart'] },
    'ca': { name: '캐나다', mnos: ['Bell', 'Rogers', 'Telus', 'Freedom Mobile', 'Vidéotron'] },
    'cl': { name: '칠레', mnos: ['Entel', 'Movistar', 'Claro', 'WOM'] },
    'cn': { name: '중국', mnos: ['China Mobile', 'China Unicom', 'China Telecom'] },
    'co': { name: '콜롬비아', mnos: ['Claro', 'Movistar', 'Tigo', 'WOM'] },
    'hr': { name: '크로아티아', mnos: ['Hrvatski Telekom', 'A1', 'Telemach'] },
    'cy': { name: '키프로스', mnos: ['Cytamobile-Vodafone', 'epic', 'PrimeTel'] },
    'cz': { name: '체코', mnos: ['O2', 'T-Mobile', 'Vodafone'] },
    'dk': { name: '덴마크', mnos: ['TDC', 'Telenor', 'Telia', '3'] },
    'ec': { name: '에콰도르', mnos: ['Claro', 'Movistar', 'CNT'] },
    'eg': { name: '이집트', mnos: ['Vodafone', 'Orange', 'Etisalat', 'WE'] },
    'fi': { name: '핀란드', mnos: ['DNA', 'Elisa', 'Telia'] },
    'fr': { name: '프랑스', mnos: ['Orange', 'SFR', 'Bouygues Telecom', 'Free Mobile'] },
    'ge': { name: '조지아', mnos: ['MagtiCom', 'Geocell', 'Beeline'] },
    'de': { name: '독일', mnos: ['Telekom', 'Vodafone', 'O2', '1&1'] },
    'gh': { name: '가나', mnos: ['MTN', 'Vodafone', 'AirtelTigo'] },
    'gr': { name: '그리스', mnos: ['Cosmote', 'Vodafone', 'Nova'] },
    'gu': { name: '괌', mnos: ['Docomo Pacific', 'GTA Teleguam', 'IT&E'] },
    'hk': { name: '홍콩', mnos: ['csl', '3', 'SmarTone', 'China Mobile HK'] },
    'hu': { name: '헝가리', mnos: ['Magyar Telekom', 'Yettel', 'Vodafone'] },
    'is': { name: '아이슬란드', mnos: ['Síminn', 'Vodafone', 'Nova'] },
    'in': { name: '인도', mnos: ['Jio', 'Airtel', 'Vi'] },
    'id': { name: '인도네시아', mnos: ['Telkomsel', 'Indosat Ooredoo Hutchison', 'XL Axiata'] },
    'ir': { name: '이란', mnos: ['MCI', 'Irancell', 'Rightel'] },
    'iq': { name: '이라크', mnos: ['Zain', 'Asiacell', 'Korek Telecom'] },
    'ie': { name: '아일랜드', mnos: ['Vodafone', 'Three', 'Eir'] },
    'il': { name: '이스라엘', mnos: ['Pelephone', 'Cellcom', 'Partner'] },
    'it': { name: '이탈리아', mnos: ['TIM', 'Vodafone', 'Wind Tre', 'Iliad'] },
    'jp': { name: '일본', mnos: ['NTT Docomo', 'au (KDDI)', 'SoftBank', 'Rakuten Mobile'] },
    'jo': { name: '요르단', mnos: ['Zain', 'Orange', 'Umniah'] },
    'kz': { name: '카자흐스탄', mnos: ['Kcell', 'Beeline', 'Tele2'] },
    'ke': { name: '케냐', mnos: ['Safaricom', 'Airtel', 'Telkom'] },
    'kr': { name: '대한민국', mnos: ['LG U+', 'SK Telecom', 'KT'] },
    'kw': { name: '쿠웨이트', mnos: ['Zain', 'stc', 'Ooredoo'] },
    'lv': { name: '라트비아', mnos: ['LMT', 'Tele2', 'Bite'] },
    'lt': { name: '리투아니아', mnos: ['Telia', 'Tele2', 'Bite'] },
    'lu': { name: '룩셈부르크', mnos: ['Post', 'Tango', 'Orange'] },
    'mo': { name: '마카오', mnos: ['CTM', '3', 'SmarTone'] },
    'my': { name: '말레이시아', mnos: ['Maxis', 'CelcomDigi', 'U Mobile'] },
    'mx': { name: '멕시코', mnos: ['Telcel', 'AT&T', 'Movistar'] },
    'md': { name: '몰도바', mnos: ['Orange', 'Moldcell', 'Unite'] },
    'mn': { name: '몽골', mnos: ['Unitel', 'Skytel', 'G-Mobile', 'Mobicom'] },
    'ma': { name: '모로코', mnos: ['Maroc Telecom', 'Orange', 'Inwi'] },
    'mm': { name: '미얀마', mnos: ['MPT', 'Ooredoo', 'Telenor', 'Mytel'] },
    'np': { name: '네팔', mnos: ['Nepal Telecom', 'Ncell'] },
    'nl': { name: '네덜란드', mnos: ['KPN', 'Vodafone', 'T-Mobile', 'Tele2'] },
    'nz': { name: '뉴질랜드', mnos: ['Spark', 'One NZ', '2degrees'] },
    'ng': { name: '나이지리아', mnos: ['MTN', 'Airtel', 'Globacom', '9mobile'] },
    'no': { name: '노르웨이', mnos: ['Telenor', 'Telia'] },
    'om': { name: '오만', mnos: ['Omantel', 'Ooredoo', 'Vodafone'] },
    'pk': { name: '파키스탄', mnos: ['Jazz', 'Telenor', 'Zong', 'Ufone'] },
    'pa': { name: '파나마', mnos: ['+Móvil', 'Tigo', 'Claro', 'Digicel'] },
    'pe': { name: '페루', mnos: ['Claro', 'Movistar', 'Entel', 'Bitel'] },
    'ph': { name: '필리핀', mnos: ['Globe', 'Smart', 'DITO'] },
    'pl': { name: '폴란드', mnos: ['Orange', 'Play', 'Plus', 'T-Mobile'] },
    'pt': { name: '포르투갈', mnos: ['MEO', 'NOS', 'Vodafone'] },
    'qa': { name: '카타르', mnos: ['Ooredoo', 'Vodafone'] },
    'ro': { name: '루마니아', mnos: ['Orange', 'Vodafone', 'Telekom'] },
    'ru': { name: '러시아', mnos: ['MTS', 'MegaFon', 'Beeline', 'Tele2'] },
    'sa': { name: '사우디아라비아', mnos: ['stc', 'Mobily', 'Zain'] },
    'rs': { name: '세르비아', mnos: ['Telekom Srbija', 'Yettel', 'A1'] },
    'sg': { name: '싱가포르', mnos: ['Singtel', 'StarHub', 'M1'] },
    'sk': { name: '슬로바키아', mnos: ['Orange', 'Slovak Telekom', 'O2', '4ka'] },
    'si': { name: '슬로베니아', mnos: ['Telekom Slovenije', 'A1', 'Telemach'] },
    'za': { name: '남아프리카 공화국', mnos: ['Vodacom', 'MTN', 'Cell C', 'Telkom'] },
    'es': { name: '스페인', mnos: ['Movistar', 'Orange', 'Vodafone', 'MásMóvil'] },
    'lk': { name: '스리랑카', mnos: ['Dialog', 'Mobitel', 'Hutch'] },
    'se': { name: '스웨덴', mnos: ['Telia', 'Telenor', 'Tele2', 'Tre'] },
    'ch': { name: '스위스', mnos: ['Swisscom', 'Sunrise', 'Salt'] },
    'sy': { name: '시리아', mnos: ['Syriatel', 'MTN'] },
    'tw': { name: '대만', mnos: ['Chunghwa Telecom', 'Taiwan Mobile', 'FarEasTone', 'T STAR', 'GT'] },
    'tz': { name: '탄자니아', mnos: ['Vodacom', 'Airtel', 'Tigo', 'Halotel'] },
    'th': { name: '태국', mnos: ['AIS', 'dtac', 'TrueMove H'] },
    'tr': { name: '튀르키예', mnos: ['Turkcell', 'Vodafone', 'Türk Telekom'] },
    'ug': { name: '우간다', mnos: ['MTN', 'Airtel'] },
    'ua': { name: '우크라이나', mnos: ['Kyivstar', 'Vodafone', 'lifecell'] },
    'ae': { name: '아랍에미리트', mnos: ['Etisalat', 'du'] },
    'gb': { name: '영국', mnos: ['EE', 'O2', 'Vodafone', 'Three'] },
    'us': { name: '미국', mnos: ['Verizon', 'AT&T', 'T-Mobile', 'DISH Wireless'] },
    'uy': { name: '우루과이', mnos: ['Antel', 'Claro', 'Movistar'] },
    'uz': { name: '우즈베키스탄', mnos: ['Ucell', 'Beeline', 'Mobiuz'] },
    've': { name: '베네수엘라', mnos: ['Movilnet', 'Movistar', 'Digitel'] },
    'vn': { name: '베트남', mnos: ['Viettel', 'MobiFone', 'Vinaphone', 'Vietnamobile'] },
    'ye': { name: '예멘', mnos: ['Sabafon', 'MTN', 'Yemen Mobile'] }
};

let currentAddress = '주소 정보 없음';
let currentDeviceInfo = '단말 정보 없음';
let currentGpsCoords = 'N/A';
let manualLocationValue = '';
let isTestCancelled = false;
let speedtestWorker;

let startButton, cancelButton, locationInfo, deviceInfo, countrySelector, mnoSelector, 
    ratSelector, testIdSelector, mnoSource, pingResult, downloadResult, uploadResult,
    youtubeLatency, instagramLatency, kakaotalkLatency, naverLatency, whatsappLatency,
    lossDisplay, historyContainer, showHistoryButton, clearHistoryButton, exportHistoryButton, 
    historyTableBody, locationInput, refreshLocationBtn, locationText, statusBanner;

document.addEventListener('DOMContentLoaded', () => {
    // 테마 설정
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        }
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // DOM 요소 매핑
    startButton = document.getElementById('startButton');
    cancelButton = document.getElementById('cancelButton');
    statusBanner = document.getElementById('status-banner');
    
    countrySelector = document.getElementById('countrySelector');
    mnoSelector = document.getElementById('mnoSelector');
    ratSelector = document.getElementById('ratSelector');
    testIdSelector = document.getElementById('testIdSelector');
    mnoSource = document.getElementById('mno-source');
    locationInput = document.getElementById('locationInput');
    
    pingResult = document.getElementById('ping-result');
    downloadResult = document.getElementById('download-result');
    uploadResult = document.getElementById('upload-result');
    
    youtubeLatency = document.getElementById('youtube-latency');
    instagramLatency = document.getElementById('instagram-latency');
    kakaotalkLatency = document.getElementById('kakaotalk-latency');
    naverLatency = document.getElementById('naver-latency');
    whatsappLatency = document.getElementById('whatsapp-latency');
    
    lossDisplay = document.getElementById('loss-display'); 
    historyContainer = document.getElementById('history-container');
    showHistoryButton = document.getElementById('showHistoryButton');
    clearHistoryButton = document.getElementById('clearHistoryButton');
    exportHistoryButton = document.getElementById('exportHistoryButton');
    historyTableBody = document.querySelector('#historyTable tbody');
    refreshLocationBtn = document.getElementById('refreshLocationBtn');
    locationText = document.getElementById('location-text');
    deviceInfo = document.getElementById('device-info');

    getDeviceInfo(); 
    loadMnoDatabase(); 
    getLocation(); 
    loadHistory(); 

    countrySelector.addEventListener('change', onCountryChange);
    mnoSelector.addEventListener('change', checkSelections);
    ratSelector.addEventListener('change', checkSelections);
    testIdSelector.addEventListener('change', checkSelections);
    refreshLocationBtn.addEventListener('click', getLocation);
    if(locationInput) locationInput.addEventListener('input', (e) => manualLocationValue = e.target.value);

    // 📍 고급 설정 토글 로직
    const profileEl = document.getElementById('iperfProfile');
    const advancedSettings = document.getElementById('advanced-native-settings');
    const advancedToggle = document.getElementById('advanced-native-toggle');

    if (advancedToggle) {
        advancedToggle.addEventListener('click', () => {
            const isHidden = advancedSettings.style.display === 'none';
            advancedSettings.style.display = isHidden ? 'block' : 'none';
            advancedToggle.textContent = isHidden ? '▲ 상세 설정 접기' : '▼ 상세 설정 펼치기';
        });
    }

    if (profileEl) {
        profileEl.addEventListener('change', (e) => {
            if (e.target.value !== 'normal') {
                advancedSettings.style.display = 'block';
                if(advancedToggle) advancedToggle.textContent = '▲ 상세 설정 접기';
            }
        });
    }

    // 수동 버튼
    const iperfBtn = document.getElementById('iperfButton');
    if(iperfBtn) iperfBtn.addEventListener('click', async () => {
        const host = document.getElementById('iperfHost') ? document.getElementById('iperfHost').value : "180.228.85.25";
        const port = document.getElementById('iperfPort') ? document.getElementById('iperfPort').value : "5201";
        const protocolEl = document.querySelector('input[name="targetProtocol"]:checked');
        const selectedProtocol = protocolEl ? protocolEl.value : 'UDP';
        const stressProfile = profileEl ? profileEl.value : 'normal';

        let profileLabelStr = stressProfile === 'stress_bw' ? "극한" : (stressProfile === 'stress_mtu' ? "MTU부하" : (stressProfile === 'stress_pps' ? "Opensignal모사" : "일반"));
        const combinedProtocolStr = `${selectedProtocol} (${profileLabelStr})`;

        // 📍 타임아웃 방지를 위해 -R (다운로드 방향) 제거하고 업로드로 통일
        let iperfArgs = "";
        if (selectedProtocol === 'UDP') {
            if (stressProfile === 'stress_bw') iperfArgs = `-c ${host} -p ${port} -u -b 50M -P 5 -t 10`;
            else if (stressProfile === 'stress_mtu') iperfArgs = `-c ${host} -p ${port} -u -b 20M -l 1460 -t 10`;
            else if (stressProfile === 'stress_pps') iperfArgs = `-c ${host} -p ${port} -u -b 1M -l 32 -t 10`; 
            else iperfArgs = `-c ${host} -p ${port} -u -b 10M -t 10`; 
        } else {
            if (stressProfile === 'stress_bw') iperfArgs = `-c ${host} -p ${port} -P 5 -t 10`;
            else if (stressProfile === 'stress_mtu') iperfArgs = `-c ${host} -p ${port} -M 1460 -t 10`;
            else if (stressProfile === 'stress_pps') iperfArgs = `-c ${host} -p ${port} -M 32 -t 10`;
            else iperfArgs = `-c ${host} -p ${port} -t 10`;
        }
        await measureNativeTool('iperf3', iperfArgs, `수동 iperf3 (${combinedProtocolStr})`, 30000);
    });

    const traceBtn = document.getElementById('traceButton');
    if(traceBtn) traceBtn.addEventListener('click', async () => {
        const host = document.getElementById('iperfHost') ? document.getElementById('iperfHost').value : "180.228.85.25";
        const protocolEl = document.querySelector('input[name="targetProtocol"]:checked');
        const selectedProtocol = protocolEl ? protocolEl.value : 'UDP';
        const traceArgs = selectedProtocol === 'TCP' ? `-T ${host}` : `${host}`;
        await measureNativeTool('traceroute', traceArgs, `수동 traceroute (${selectedProtocol})`, 40000);
    });

    // 히스토리 버튼들
    showHistoryButton.addEventListener('click', () => {
        const isHidden = historyContainer.style.display === 'none';
        historyContainer.style.display = isHidden ? 'block' : 'none';
        showHistoryButton.textContent = isHidden ? '기록 숨기기' : '기록 보기';
    });

    clearHistoryButton.addEventListener('click', () => {
        if (confirm('모든 기록을 삭제하시겠습니까?')) {
            localStorage.removeItem('speedtestHistory');
            loadHistory();
        }
    });

    exportHistoryButton.addEventListener('click', () => {
        const history = JSON.parse(localStorage.getItem('speedtestHistory')) || [];
        if (history.length === 0) return alert('내보낼 기록이 없습니다.');
        const headers = ["time", "testId", "country", "mno", "rat", "testMode", "ping_avg", "download", "upload", "packetLoss", "youtube", "instagram", "kakao", "naver", "whatsapp", "manualLocation", "device", "location", "gps", "protocol", "iperf3_log", "traceroute_log"];
        let csvContent = headers.join(',') + '\n';
        history.forEach(row => {
            const values = headers.map(header => `"${('' + (row[header] || '')).replace(/"/g, '""')}"`);
            csvContent += values.join(',') + '\n';
        });
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `speedtest_result_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    cancelButton.addEventListener('click', () => {
        isTestCancelled = true;
        cancelButton.disabled = true;
        if (statusBanner) {
            statusBanner.style.backgroundColor = '#F44336';
            statusBanner.innerHTML = '🛑 측정이 취소되었습니다.';
            setTimeout(() => statusBanner.style.display = 'none', 3000);
        }
        if (speedtestWorker) speedtestWorker.terminate();
    });

    // 📍 2. 자동 연속 측정 메인 루프
    startButton.addEventListener('click', async () => {
        isTestCancelled = false;
        startButton.style.display = 'none'; 
        cancelButton.style.display = 'block'; 
        cancelButton.disabled = false;

        const selectedMode = document.querySelector('input[name="testMode"]:checked').value;
        const loopCount = parseInt(selectedMode.split('회')[0], 10);
        
        const protocolEl = document.querySelector('input[name="targetProtocol"]:checked');
        const selectedProtocol = protocolEl ? protocolEl.value : 'UDP';
        const stressProfile = profileEl ? profileEl.value : 'normal';

        let profileLabelStr = stressProfile === 'stress_bw' ? "극한" : (stressProfile === 'stress_mtu' ? "MTU부하" : (stressProfile === 'stress_pps' ? "Opensignal모사" : "일반"));
        const combinedProtocolStr = `${selectedProtocol} (${profileLabelStr})`;
        const delay = ms => new Promise(res => setTimeout(res, ms));

        if (statusBanner) {
            statusBanner.style.display = 'block';
            statusBanner.style.backgroundColor = '#ff9800';
        }

        const updateStatus = (currentLoop, totalLoop, stepName) => {
            if (statusBanner) statusBanner.innerHTML = `⏳ [${currentLoop}/${totalLoop}회차] <br> ${stepName} 측정 중...`;
            document.getElementById('shell-result').scrollIntoView({ behavior: 'smooth', block: 'end' });
        };

        for (let i = 1; i <= loopCount; i++) {
            if (isTestCancelled) break;
            
            if (speedtestWorker) speedtestWorker.terminate();
            speedtestWorker = new Worker('speedtest-worker.js');

            [pingResult, downloadResult, uploadResult, youtubeLatency, instagramLatency, kakaotalkLatency, naverLatency, whatsappLatency].forEach(el => { if(el) el.innerHTML = ''; });
            if(lossDisplay) { lossDisplay.textContent = 'Ready'; lossDisplay.style.color = '#aaa'; }

            updateStatus(i, loopCount, "서버 지연시간 (Ping)");
            const ping = await measureLatency();
            if (isTestCancelled) break;

            updateStatus(i, loopCount, "다운로드 속도 (DL)");
            const download = await measureSpeedWithWorker('download');
            if (isTestCancelled) break;

            updateStatus(i, loopCount, "업로드 속도 (UL)");
            const upload = await measureSpeedWithWorker('upload');
            if (isTestCancelled) break;

            updateStatus(i, loopCount, "SNS 지연시간 측정");
            const services = [
                { name: 'YouTube', url: 'https://www.youtube.com', element: youtubeLatency },
                { name: 'Instagram', url: 'https://www.instagram.com', element: instagramLatency },
                { name: 'Kakao', url: 'https://www.kakao.com', element: kakaotalkLatency },
                { name: 'Naver', url: 'https://www.naver.com', element: naverLatency },
                { name: 'WhatsApp', url: 'https://www.whatsapp.com', element: whatsappLatency }
            ];
            const serviceLatencyPromises = services.map(s => measureServiceLatency(s.url, s.element, s.name));
            const allResults = await Promise.all(serviceLatencyPromises); 
            const serviceResults = {};
            services.forEach((s, idx) => serviceResults[s.name] = allResults[idx]);
            if (isTestCancelled) break;

            updateStatus(i, loopCount, "패킷 유실률 (Loss)");
            const packetLossData = await measurePacketLossDeepDive();
            if (isTestCancelled) break;
            await delay(200);

            const host = document.getElementById('iperfHost') ? document.getElementById('iperfHost').value : "180.228.85.25";
            const port = document.getElementById('iperfPort') ? document.getElementById('iperfPort').value : "5201";

            // 📍 -R 제거됨 (타임아웃 방지, 업로드 부하 테스트)
            let iperfArgs = "";
            if (selectedProtocol === 'UDP') {
                if (stressProfile === 'stress_bw') iperfArgs = `-c ${host} -p ${port} -u -b 50M -P 5 -t 10`;
                else if (stressProfile === 'stress_mtu') iperfArgs = `-c ${host} -p ${port} -u -b 20M -l 1460 -t 10`;
                else if (stressProfile === 'stress_pps') iperfArgs = `-c ${host} -p ${port} -u -b 1M -l 32 -t 10`; 
                else iperfArgs = `-c ${host} -p ${port} -u -b 10M -t 10`; 
            } else {
                if (stressProfile === 'stress_bw') iperfArgs = `-c ${host} -p ${port} -P 5 -t 10`;
                else if (stressProfile === 'stress_mtu') iperfArgs = `-c ${host} -p ${port} -M 1460 -t 10`;
                else if (stressProfile === 'stress_pps') iperfArgs = `-c ${host} -p ${port} -M 32 -t 10`;
                else iperfArgs = `-c ${host} -p ${port} -t 10`;
            }
            const traceArgs = selectedProtocol === 'TCP' ? `-T ${host}` : `${host}`;

            updateStatus(i, loopCount, `네이티브 iperf3 [${combinedProtocolStr}]`);
            const iperfResultLog = await measureNativeTool('iperf3', iperfArgs, `자동 iperf3 (${combinedProtocolStr})`, 30000); 
            if (isTestCancelled) break;

            updateStatus(i, loopCount, `네이티브 traceroute [${selectedProtocol}]`);
            const traceResultLog = await measureNativeTool('traceroute', traceArgs, `자동 traceroute (${selectedProtocol})`, 40000); 
            if (isTestCancelled) break;

            const resultData = {
                time: new Date().toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }),
                testId: testIdSelector.value,
                country: countrySelector.options[countrySelector.selectedIndex].text,
                mno: mnoSelector.value,
                rat: ratSelector.value,
                testMode: selectedMode,
                ping_avg: ping.avg,
                download: download,
                upload: upload,
                packetLoss: packetLossData,
                youtube: serviceResults.YouTube,
                instagram: serviceResults.Instagram,
                kakao: serviceResults.Kakao,
                naver: serviceResults.Naver,
                whatsapp: serviceResults.WhatsApp,
                device: currentDeviceInfo,
                location: currentAddress,
                gps: currentGpsCoords,
                manualLocation: manualLocationValue,
                protocol: combinedProtocolStr,
                iperf3_log: iperfResultLog,
                traceroute_log: traceResultLog
            };

            saveHistory(resultData);
            logResultToServer(resultData);
            loadHistory();

            if (i < loopCount && !isTestCancelled) {
                updateStatus(i, loopCount, "결과 저장 완료. 다음 회차 대기 중...");
                await delay(2000);
            }
        }
        
        if (!isTestCancelled && statusBanner) {
            statusBanner.style.backgroundColor = '#4CAF50';
            statusBanner.innerHTML = '✅ 측정이 모두 완료되었습니다!';
            setTimeout(() => statusBanner.style.display = 'none', 4000);
        }
        
        startButton.style.display = 'block';
        cancelButton.style.display = 'none';
        checkSelections();
    });
});

// 📍 형광색 ms 포맷팅 적용 함수들
async function measureLatency() {
    const pingTimes = [];
    pingResult.innerHTML = `✅ Ping: 측정중...`;
    for (let i = 0; i < 3; i++) {
        try {
            const start = Date.now();
            await fetch(SERVER_URL + '/ping.txt?r=' + Date.now(), { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(3000) });
            pingTimes.push(Date.now() - start);
            await new Promise(r => setTimeout(r, 250));
        } catch (e) { 
            pingResult.innerHTML = `❌ Ping: Failed`;
            return { avg: 'N/A' }; 
        }
    }
    const avg = Math.round(pingTimes.slice(1).reduce((a, b) => a + b, 0) / (pingTimes.length - 1));
    pingResult.innerHTML = `✅ Ping: <span class="highlight-ms">${avg} ms</span>`;
    return { avg };
}

async function measureServiceLatency(url, element, name) {
    if (!element) return 'N/A';
    element.innerHTML = `✅ ${name}: 측정중...`;
    const times = [];
    for (let i = 0; i < 3; i++) {
        try {
            const start = Date.now();
            await fetch(`${url}?r=${Date.now()}`, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(3000) });
            times.push(Date.now() - start);
            await new Promise(r => setTimeout(r, 500));
        } catch (e) { 
            element.innerHTML = `❌ ${name}: Failed`;
            return 'Failed'; 
        }
    }
    const avg = Math.round(times.slice(1).reduce((a, b) => a + b, 0) / (times.length - 1));
    element.innerHTML = `✅ ${name}: <span class="highlight-ms">${avg} ms</span>`;
    return avg;
}

// 📍 큰 폰트 다운로드/업로드 적용
function createOrUpdateProgressBar(el, prg, spd) {
    if (!el.querySelector('.progress-container')) el.innerHTML = '<div class="progress-container" style="margin-top:5px; background:#444; border-radius:4px; overflow:hidden;"><div class="progress-bar" style="height:8px; background:#2196F3; width:0%;"></div></div><div class="progress-text" style="font-size:0.85em; margin-top:3px;"></div>';
    el.querySelector('.progress-bar').style.width = `${prg * 100}%`; 
    el.querySelector('.progress-text').textContent = `${(prg * 100).toFixed(0)}% @ ${spd} Mbps`;
}

async function measureSpeedWithWorker(type) {
    const element = (type === 'download') ? downloadResult : uploadResult;
    const baseText = element.dataset ? element.dataset.baseText : (type === 'download' ? 'Download' : 'Upload');
    const colorClass = type === 'download' ? '' : 'speed-large-value-up';
    
    element.innerHTML = `<span style="font-size:0.9em; color:#aaa;">${baseText}</span>`;
    createOrUpdateProgressBar(element, 0, '0.00');
    
    return new Promise((resolve) => {
        if(!speedtestWorker) { resolve('Error'); return; }
        const fallbackTimer = setTimeout(() => {
            element.innerHTML = `⚠️ ${baseText}: Timeout`;
            speedtestWorker.terminate(); resolve('Timeout');
        }, 25000);

        const handler = (event) => {
            if (isTestCancelled) {
                clearTimeout(fallbackTimer);
                speedtestWorker.removeEventListener('message', handler);
                resolve('Cancelled'); return;
            }
            const { type: msgType, progress, speed, finalSpeed } = event.data;
            if (msgType === 'progress') createOrUpdateProgressBar(element, progress, speed);
            if (msgType === 'complete') {
                clearTimeout(fallbackTimer);
                element.innerHTML = `<span style="font-size:0.9em; color:#aaa;">${baseText}</span> <span class="speed-large-value ${colorClass}">${finalSpeed} Mbps</span>`;
                speedtestWorker.removeEventListener('message', handler);
                resolve(finalSpeed);
            }
            if (msgType === 'error') {
                clearTimeout(fallbackTimer);
                element.innerHTML = `❌ ${baseText}: Failed`;
                speedtestWorker.removeEventListener('message', handler);
                resolve('Failed');
            }
        };
        speedtestWorker.addEventListener('message', handler);
        const size = 10 * 1024 * 1024; 
        speedtestWorker.postMessage({ type: (type === 'download' ? 'start-download' : 'start-upload'), url: (type === 'download' ? SERVER_URL + '/download.php' : SERVER_URL + '/upload.php'), size });
    });
}

// 기존 패킷 로스 딥다이브 로직
async function measurePacketLossDeepDive() {
    if (lossDisplay) lossDisplay.innerHTML = "<span style='color:orange'>Warmup & Analysis...</span>";
    const socketUrl = WS_URL;
    const SIZE_S = 64, SIZE_M = 1250, SIZE_L = 1380;
    const payloadS = 'S'.repeat(SIZE_S), payloadM = 'M'.repeat(SIZE_M), payloadL = 'L'.repeat(SIZE_L);
    const targetSamples = 100;
    let stats = { S: { sent: 0, recv: 0, rtts: [] }, M: { sent: 0, recv: 0, rtts: [] }, L: { sent: 0, recv: 0, rtts: [] } };
    const sendTimes = new Map();
    let isFinished = false, isWarmedUp = false; 
    
    return new Promise((resolve) => {
        let ws;
        try { ws = new WebSocket(socketUrl); } catch(e) { finish("Connection Fail"); return; }
        const globalTimeout = setTimeout(() => { if(!isFinished) { if(ws.readyState !== WebSocket.CLOSED) ws.close(); finish("Timeout"); } }, 15000);
        let testInterval;

        ws.onopen = () => {
            ws.send('PING:WARMUP');
            setTimeout(() => { if(!isWarmedUp && !isFinished) { ws.close(); finish("Warmup Fail"); } }, 5000);
        };
        ws.onmessage = (event) => {
            if(isFinished) return; 
            const msg = event.data.toString();
            if(!isWarmedUp && msg.includes('WARMUP')) {
                isWarmedUp = true;
                if(lossDisplay) lossDisplay.innerHTML = "Measuring (S/M/L)...";
                startRealMeasurement();
                return;
            }
            if(isWarmedUp && msg.startsWith('PONG:')) {
                const parts = msg.split(':');
                if (parts.length >= 3) {
                    const type = parts[1], seq = parts[2], key = `${type}:${seq}`;
                    if (sendTimes.has(key)) {
                        stats[type].recv++; stats[type].rtts.push(Date.now() - sendTimes.get(key)); sendTimes.delete(key);
                        if (stats.S.sent % 10 === 0 && lossDisplay) lossDisplay.innerHTML = `Measuring... ${Math.round((stats.S.sent / targetSamples) * 100)}%`;
                    }
                }
            }
        };

        function startRealMeasurement() {
            let seq = 0;
            testInterval = setInterval(() => {
                if(seq < targetSamples && !isTestCancelled && ws.readyState === WebSocket.OPEN) {
                    seq++; const now = Date.now();
                    sendTimes.set(`S:${seq}`, now); stats.S.sent++; ws.send(`PING:S:${seq}:${payloadS}`);
                    setTimeout(() => { if(ws.readyState === WebSocket.OPEN) { sendTimes.set(`M:${seq}`, Date.now()); stats.M.sent++; ws.send(`PING:M:${seq}:${payloadM}`); } }, 2);
                    setTimeout(() => { if(ws.readyState === WebSocket.OPEN) { sendTimes.set(`L:${seq}`, Date.now()); stats.L.sent++; ws.send(`PING:L:${seq}:${payloadL}`); } }, 4);
                } else if (seq >= targetSamples) {
                    clearInterval(testInterval);
                    setTimeout(() => { if(!isFinished && ws.readyState === WebSocket.OPEN) ws.close(); }, 2000); 
                }
            }, 40);
        }

        ws.onclose = () => { clearTimeout(globalTimeout); if(!isFinished) analyzeResults(); };

        function analyzeResults() {
            if (!isWarmedUp) { finish("Warmup Failed"); return; }
            const types = ['S', 'M', 'L'];
            let reportHtml = "", reportCsv = "", allRtts = [];
            types.forEach(t => {
                const sent = stats[t].sent, recv = stats[t].recv, lost = sent - recv;
                const lossRate = sent > 0 ? ((lost / sent) * 100).toFixed(1) : '0.0';
                allRtts = allRtts.concat(stats[t].rtts);
                const color = parseFloat(lossRate) > 5 ? 'red' : (parseFloat(lossRate) > 0 ? 'orange' : 'green');
                reportHtml += `<b>${t}:</b> <span style="color:${color}">${lossRate}%</span> `;
                reportCsv += `${t}:${lossRate}% `;
            });
            const sStats = stats['S'], sSent = sStats.sent, sLost = sSent - sStats.recv;
            const minRtt = sStats.rtts.length > 0 ? Math.min(...sStats.rtts) : 100;
            const dynamicLimit = Math.max(minRtt * 3, minRtt + 100);
            const sLate = sStats.rtts.filter(r => r > dynamicLimit).length;
            const estimatedUdpLoss = sSent > 0 ? (((sLost + sLate) / sSent) * 100).toFixed(1) : '0.0';
            const totalRecv = allRtts.length, avg = totalRecv > 0 ? allRtts.reduce((a,b)=>a+b,0)/totalRecv : 0;
            const variance = totalRecv > 0 ? allRtts.reduce((a,b)=>a+Math.pow(b-avg,2),0)/totalRecv : 0;
            const jitter = Math.sqrt(variance).toFixed(1);

            reportHtml += `<br><span style="font-size:0.9em; color:#666;">Est. UDP Loss: <b>${estimatedUdpLoss}%</b> (Limit: ${dynamicLimit.toFixed(0)}ms)</span>`;
            reportCsv += `(UDP_Est:${estimatedUdpLoss}% Limit:${dynamicLimit.toFixed(0)} J:${jitter})`;
            finish(reportCsv, reportHtml);
        }

        function finish(csvString, htmlString) {
            if(isFinished) return; 
            isFinished = true;
            if (lossDisplay) lossDisplay.innerHTML = htmlString || csvString;
            resolve(csvString);
        }
    });
}

async function measureNativeTool(cmd, args, label, timeoutMs) {
    const outputEl = document.getElementById('shell-result');
    if (!outputEl) return "UI Element Not Found";

    outputEl.style.color = '#ffca28';
    outputEl.textContent = `⏳ [${label}] 진행 중...\n> ${cmd} ${args}\n서버 응답 대기 중 (최대 ${timeoutMs/1000}초)...`;

    if (window.Capacitor && window.Capacitor.Plugins.ShellExecutor) {
        try {
            const execPromise = window.Capacitor.Plugins.ShellExecutor.runCommand({ command: cmd, args: args });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout (응답 지연)")), timeoutMs));
            
            const { result } = await Promise.race([execPromise, timeoutPromise]);
            
            outputEl.style.color = '#00ff00';
            outputEl.textContent = `✅ [${label} 완료]\n${result}`;
            return result; 
        } catch (e) {
            outputEl.style.color = '#ff5252';
            const errorMsg = `❌ [${label} 오류/타임아웃]: ` + e.message;
            outputEl.textContent = errorMsg;
            return errorMsg;
        }
    } else {
        const warnMsg = "⚠️ 앱에서만 지원합니다.";
        outputEl.style.color = '#ff5252';
        outputEl.textContent = warnMsg;
        return warnMsg;
    }
}

async function logResultToServer(resultData) {
    const url = "https://script.google.com/macros/s/AKfycby7PrdmKFxAIuYRgw3mzQQpZIEy6zqU7YVLkVB3Hu1wDw07KVqZArZOti1M7a3g6_X2/exec"; 
    try { await fetch(url, { method: 'POST', mode: 'no-cors', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify(resultData) }); } catch (e) { }
}

function loadMnoDatabase() { fetch('./mno.json?v=' + Date.now()).then(res => res.json()).then(data => { fullMnoDatabase = data; isDbLoadedFromWeb = true; updateCountryList(); }).catch(() => { fullMnoDatabase = Object.fromEntries(Object.entries(fallbackMnoDatabase).map(([c, d]) => [c, d.mnos.map(b => ({ brand: b, country: d.name }))])); updateCountryList(); }); }
function updateCountryList() { const list = Object.keys(fullMnoDatabase).map(c => ({ code: c, name: fallbackMnoDatabase[c]?.name || c.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name)); countrySelector.innerHTML = '<option value="">국가를 선택하세요</option>'; list.forEach(c => countrySelector.appendChild(new Option(`${c.name} (${c.code.toUpperCase()})`, c.code))); countrySelector.disabled = false; checkSelections(); }
function onCountryChange() { const code = countrySelector.value; mnoSelector.innerHTML = '<option value="">통신사를 선택하세요</option>'; mnoSource.textContent = ''; if (code && fullMnoDatabase[code]) { let brands = [...new Set(fullMnoDatabase[code].map(i => i.brand))]; if (code === 'kr') brands.sort((a, b) => ['LG U+', 'SK Telecom', 'KT'].indexOf(a) - ['LG U+', 'SK Telecom', 'KT'].indexOf(b)); else brands.sort(); brands.forEach(b => mnoSelector.appendChild(new Option(b, b))); mnoSelector.disabled = false; mnoSource.textContent = isDbLoadedFromWeb ? '(Live DB)' : '(내장 DB)'; } else { mnoSelector.disabled = true; } checkSelections(); }
function checkSelections() { startButton.disabled = !(countrySelector.value && mnoSelector.value && ratSelector.value && testIdSelector.value); if (!startButton.disabled) startButton.textContent = 'Start Test'; else startButton.textContent = 'Select Country, MNO, RAT, Test SIM'; }

async function getLocation() {
    locationText.innerHTML = `📍 Detecting location...`; refreshLocationBtn.disabled = true;
    if (!navigator.geolocation) { locationText.innerHTML = '⚠️ Geolocation not supported'; return; }
    try {
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000 }));
        currentGpsCoords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=en`);
        const data = await res.json();
        let addressStr = 'Unknown';
        if (data.address) {
            addressStr = `${data.address.country || ''}, ${data.address.city || data.address.town || ''}`;
            if (data.address.country_code) {
                const detectedCode = data.address.country_code.toLowerCase();
                if (countrySelector.querySelector(`option[value="${detectedCode}"]`)) { 
                    countrySelector.value = detectedCode; 
                    countrySelector.classList.add('auto-filled'); // 📍 자동음영
                    onCountryChange(); 
                }
            }
        }
        currentAddress = addressStr; locationText.innerHTML = `📍 GPS: ${currentGpsCoords}<br>🏠 Address: ${currentAddress}`;
    } catch (e) { locationText.innerHTML = '⚠️ 위치 감지 실패'; currentGpsCoords = 'N/A'; } finally { refreshLocationBtn.disabled = false; refreshLocationBtn.textContent = '⟳'; }
}

async function getDeviceInfo() {
    let info = 'Unknown';
    try {
        if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
            const data = await navigator.userAgentData.getHighEntropyValues(['platformVersion', 'model']);
            info = `${navigator.userAgentData.platform} ${data.platformVersion ? data.platformVersion.split('.')[0] : ''} ${data.model || ''}`.trim();
        } else throw new Error('Fallback');
    } catch(e) { 
        if (/Android/.test(navigator.userAgent)) { const m = navigator.userAgent.match(/Android\s([0-9.]+)/); info = m ? `Android ${m[1]}` : 'Android'; }
        else info = 'Other';
    }
    currentDeviceInfo = info; deviceInfo.innerHTML = `📱 Device: ${currentDeviceInfo}`;
}

function saveHistory(res) { let h = JSON.parse(localStorage.getItem('speedtestHistory')) || []; h.unshift(res); localStorage.setItem('speedtestHistory', JSON.stringify(h)); }
function loadHistory() {
    const h = JSON.parse(localStorage.getItem('speedtestHistory')) || []; historyTableBody.innerHTML = h.length ? '' : '<tr><td colspan="22">No History</td></tr>';
    h.forEach(r => {
        const row = document.createElement('tr');
        const iperfStatus = r.iperf3_log && !r.iperf3_log.includes("Error") && !r.iperf3_log.includes("Timeout") ? "✅" : "❌";
        const traceStatus = r.traceroute_log && !r.traceroute_log.includes("Error") && !r.traceroute_log.includes("Timeout") ? "✅" : "❌";
        const protocolDisplay = r.protocol ? r.protocol : '';

        row.innerHTML = `<td>${r.time}</td><td>${r.testId || 'N/A'}</td><td>${r.country}</td><td>${r.mno}</td><td>${r.rat}</td><td>${r.testMode}</td><td>${r.ping_avg}</td><td>${r.download}</td><td>${r.upload}</td><td>${r.packetLoss || '-'}</td><td>${r.youtube || ''}</td><td>${r.instagram || ''}</td><td>${r.kakao || ''}</td><td>${r.naver || ''}</td><td>${r.whatsapp || ''}</td><td>${r.device}</td><td>${r.location}</td><td>${r.gps || ''}</td><td>${r.manualLocation || ''}</td><td><b>${protocolDisplay}</b></td><td>${iperfStatus}</td><td>${traceStatus}</td>`;
        historyTableBody.appendChild(row);
    });
}

// 📍 플러그인 연동 및 자동 입력 음영 처리
async function fetchNetworkInfoWithRetry(retryCount = 0) {
    if (retryCount > 10) return; 
    if (window.Capacitor && window.Capacitor.Plugins.NetworkInfo) {
        try {
            const info = await window.Capacitor.Plugins.NetworkInfo.getDetail();
            const testIdSel = document.getElementById('testIdSelector');
            if (testIdSel && info.hplmnName) {
                testIdSel.value = info.hplmnName; 
                testIdSel.classList.add('auto-filled'); // 📍 자동음영
            }
            const ratSel = document.getElementById('ratSelector');
            if (ratSel && info.rat) {
                ratSel.value = info.rat;
                ratSel.classList.add('auto-filled'); // 📍 자동음영
            }
            const mnoSource = document.getElementById('mno-source');
            if (mnoSource && info.operatorName) mnoSource.innerText = ` (현재: ${info.operatorName})`;

            if (info.hplmnName || info.rat) {
                if (typeof checkSelections === 'function') checkSelections();
                return; 
            }
        } catch (e) { }
    }
    setTimeout(() => fetchNetworkInfoWithRetry(retryCount + 1), 1000);
}

window.addEventListener('load', () => { fetchNetworkInfoWithRetry(); });