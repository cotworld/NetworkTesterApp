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

let startButton, cancelButton, countrySelector, mnoSelector, ratSelector, testIdSelector, 
    mnoSource, pingResult, jitterResult, ttfbResult, downloadResult, uploadResult,
    youtubeLatency, instagramLatency, kakaotalkLatency, naverLatency, whatsappLatency,
    historyContainer, showHistoryButton, clearHistoryButton, exportHistoryButton, 
    historyTableBody, locationInput, refreshLocationBtn, locationText, statusBanner;

document.addEventListener('DOMContentLoaded', () => {
    // 📍 1. 테마 변경(다크모드) 완벽 복구 로직
    const themeToggle = document.getElementById('theme-toggle');
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.textContent = '🌙';
        }
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        applyTheme(isDark ? 'light' : 'dark');
    });

    // 2. UI 요소 바인딩
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
    jitterResult = document.getElementById('jitter-result');
    ttfbResult = document.getElementById('ttfb-result');
    downloadResult = document.getElementById('download-result');
    uploadResult = document.getElementById('upload-result');
    youtubeLatency = document.getElementById('youtube-latency');
    instagramLatency = document.getElementById('instagram-latency');
    kakaotalkLatency = document.getElementById('kakaotalk-latency');
    naverLatency = document.getElementById('naver-latency');
    whatsappLatency = document.getElementById('whatsapp-latency');
    historyContainer = document.getElementById('history-container');
    showHistoryButton = document.getElementById('showHistoryButton');
    clearHistoryButton = document.getElementById('clearHistoryButton');
    exportHistoryButton = document.getElementById('exportHistoryButton');
    historyTableBody = document.querySelector('#historyTable tbody');
    refreshLocationBtn = document.getElementById('refreshLocationBtn');
    locationText = document.getElementById('location-text');
    deviceInfo = document.getElementById('device-info');

    // 기초 데이터 로드
    getDeviceInfo(); loadMnoDatabase(); getLocation(); loadHistory();

    countrySelector.addEventListener('change', onCountryChange);
    mnoSelector.addEventListener('change', checkSelections);
    ratSelector.addEventListener('change', checkSelections);
    testIdSelector.addEventListener('change', checkSelections);
    refreshLocationBtn.addEventListener('click', getLocation);
    if(locationInput) locationInput.addEventListener('input', (e) => manualLocationValue = e.target.value);

    // 상세 설정 토글
    const profileEl = document.getElementById('iperfProfile');
    const advancedSettings = document.getElementById('advanced-native-settings');
    const advancedToggle = document.getElementById('advanced-native-toggle');
    advancedToggle.addEventListener('click', () => {
        const isHidden = advancedSettings.style.display === 'none';
        advancedSettings.style.display = isHidden ? 'block' : 'none';
        advancedToggle.textContent = isHidden ? '▲ 상세 설정 접기' : '▼ 상세 설정 펼치기';
    });

    // 3. 네이티브 버튼 이벤트
    document.getElementById('iperfButton').addEventListener('click', async () => {
        const args = getIperfArgs(document.querySelector('input[name="targetProtocol"]:checked').value, profileEl.value, document.getElementById('iperfHost').value, document.getElementById('iperfPort').value, '');
        await measureNativeTool('iperf3', args, `수동 iperf3`, 35000);
    });

    document.getElementById('traceButton').addEventListener('click', async () => {
        await measureNativeTool('traceroute', document.getElementById('iperfHost').value, `수동 traceroute`, 40000);
    });

    // 4. 메인 루프 실행
    startButton.addEventListener('click', async () => {
        isTestCancelled = false;
        startButton.style.display = 'none'; cancelButton.style.display = 'block'; 
        const loopCount = parseInt(document.querySelector('input[name="testMode"]:checked').value, 10);
        const profile = profileEl.value;
        const protocol = document.querySelector('input[name="targetProtocol"]:checked').value;
        const host = document.getElementById('iperfHost').value;
        const port = document.getElementById('iperfPort').value;

        if (statusBanner) { statusBanner.style.display = 'block'; statusBanner.style.backgroundColor = '#ff9800'; }

        for (let i = 1; i <= loopCount; i++) {
            if (isTestCancelled) break;
            if (speedtestWorker) speedtestWorker.terminate();
            speedtestWorker = new Worker('speedtest-worker.js');

            [pingResult, jitterResult, ttfbResult, downloadResult, uploadResult, youtubeLatency, instagramLatency, kakaotalkLatency, naverLatency, whatsappLatency].forEach(el => el.innerHTML = '');

            if (statusBanner) statusBanner.innerHTML = `⏳ [${i}/${loopCount}회차] <br> 네트워크 응답성 측정 중...`;
            const q = await measureLatencyAndJitter();
            const dl = await measureSpeedWithWorker('download');
            const ul = await measureSpeedWithWorker('upload');
            
            const services = [
                { name: 'YouTube', url: 'https://www.youtube.com', element: youtubeLatency },
                { name: 'Instagram', url: 'https://www.instagram.com', element: instagramLatency },
                { name: 'Kakao', url: 'https://www.kakao.com', element: kakaotalkLatency },
                { name: 'Naver', url: 'https://www.naver.com', element: naverLatency },
                { name: 'WhatsApp', url: 'https://www.whatsapp.com', element: whatsappLatency }
            ];
            const sResults = {};
            for(let s of services) { sResults[s.name] = await measureServiceLatency(s.url, s.element, s.name); if(isTestCancelled) break; }

            let iperfFullLog = "";
            if (profile === 'stress_dual') {
                if (statusBanner) statusBanner.innerHTML = `⏳ [${i}/${loopCount}회차] <br> iperf3 UL 부하 측정...`;
                const ulRes = await measureNativeTool('iperf3', getIperfArgs(protocol, profile, host, port, 'UL'), `자동 iperf3 (UL)`, 35000);
                if (statusBanner) statusBanner.innerHTML = `⏳ [${i}/${loopCount}회차] <br> iperf3 DL 부하 측정...`;
                const dlRes = await measureNativeTool('iperf3', getIperfArgs(protocol, profile, host, port, 'DL'), `자동 iperf3 (DL)`, 35000);
                iperfFullLog = `[UL]\n${ulRes}\n\n[DL]\n${dlRes}`;
            } else {
                if (statusBanner) statusBanner.innerHTML = `⏳ [${i}/${loopCount}회차] <br> iperf3 부하 측정...`;
                iperfFullLog = await measureNativeTool('iperf3', getIperfArgs(protocol, profile, host, port, ''), `자동 iperf3`, 35000);
            }

            const traceLog = await measureNativeTool('traceroute', host, `자동 traceroute`, 40000);
            
            const resData = {
                time: new Date().toLocaleString('ko-KR', { hourCycle: 'h23' }),
                testId: testIdSelector.value, country: countrySelector.options[countrySelector.selectedIndex].text, mno: mnoSelector.value, rat: ratSelector.value, testMode: i + "/" + loopCount,
                ping_avg: q.avg, download: dl, upload: ul, packetLoss: `J:${q.jitter}ms / T:${q.ttfb}ms`,
                youtube: sResults.YouTube, instagram: sResults.Instagram, kakao: sResults.Kakao, naver: sResults.Naver, whatsapp: sResults.WhatsApp,
                device: currentDeviceInfo, location: currentAddress, gps: currentGpsCoords, manualLocation: manualLocationValue, protocol: `${protocol} (${profile})`, 
                iperf3_log: iperfFullLog, // 📍 measureNativeTool에서 이미 압축된 로그가 반환됨
                traceroute_log: traceLog
            };

            saveHistory(resData); logResultToServer(resData); loadHistory();
            if (i < loopCount && !isTestCancelled) await new Promise(r => setTimeout(r, 2000));
        }
        if (!isTestCancelled && statusBanner) { statusBanner.style.backgroundColor = '#4CAF50'; statusBanner.innerHTML = '✅ 측정 완료!'; setTimeout(() => statusBanner.style.display = 'none', 4000); }
        startButton.style.display = 'block'; cancelButton.style.display = 'none';
    });
});

// 📍 엑셀 행 크기 방지를 위한 로그 압축 함수
function compressIperfLog(rawLog) {
    const lines = rawLog.split('\n');
    let summaryLines = lines.filter(line => 
        line.includes('[SUM]') || 
        line.includes('iperf3 (opensignal') || 
        line.includes('- 분석') || 
        line.includes('- 전체') || 
        line.includes('- 최종') || 
        line.includes('- 📢') || 
        line.includes('[UL]') ||
        line.includes('[DL]') ||
        line.includes('Error') || 
        line.includes('Timeout')
    );
    return summaryLines.join('\n') || "Log Summary Error";
}

function getIperfArgs(protocol, profile, host, port, forcedMode) {
    let args = `-c ${host} -p ${port} -t 10`;
    if (protocol === 'UDP') args += ' -u';
    if (profile === 'stress_bw') args += (protocol === 'UDP' ? ' -b 50M -P 5' : ' -P 5');
    else if (profile === 'stress_dl') args += (protocol === 'UDP' ? ' -b 50M -P 5 -R' : ' -P 5 -R');
    else if (profile === 'stress_dual') args += (protocol === 'UDP' ? ' -b 50M -P 5' : ' -P 5'); 
    else if (profile === 'stress_mtu') args += (protocol === 'UDP' ? ' -b 20M -l 1460 -R' : ' -M 1460 -R');
    else args += (protocol === 'UDP' ? ' -b 10M' : '');
    if (forcedMode === 'DL' && !args.includes('-R')) args += ' -R';
    if (forcedMode === 'UL' && args.includes('-R')) args = args.replace(' -R', '');
    return args;
}

async function measureNativeTool(cmd, args, label, timeoutMs) {
    const outputEl = document.getElementById('shell-result');
    if (window.Capacitor?.Plugins?.ShellExecutor) {
        try {
            const execPromise = window.Capacitor.Plugins.ShellExecutor.runCommand({ command: cmd, args: args });
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeoutMs));
            const { result } = await Promise.race([execPromise, timeoutPromise]);
            let finalResult = result;

            if (cmd === 'iperf3' && result.includes('Lost/Total')) {
                const lines = result.split('\n');
                const sumLine = lines.reverse().find(l => l.includes('[SUM]') && (l.includes('receiver') || l.includes('0/')));
                const match = sumLine ? sumLine.match(/(\d+)\/(\d+)\s+\(/) : result.match(/(\d+)\/(\d+)\s+\(/);
                const oooMatch = result.match(/(\d+)\s+datagrams\s+received\s+out-of-order/);
                const ooo = oooMatch ? parseInt(oooMatch[1], 10) : 0;
                if (match) {
                    const lost = parseInt(match[1], 10), total = parseInt(match[2], 10), discarded = lost + ooo;
                    const osLoss = total > 0 ? ((discarded/total)*100).toFixed(2) : 0;
                    finalResult += `\n\niperf3 (opensignal 판단기준 적용) : \n- 분석구간: ${sumLine && sumLine.includes('receiver') ? 'DL' : 'UL'}\n- 전체 패킷: ${total}\n- 최종 손실(Lost+OOO): ${discarded}\n- 📢 재계산 유실률: ${osLoss}%`;
                }
            }
            
            // 앱 화면에는 전체 로그 출력
            outputEl.textContent = `✅ [${label} 완료]\n${finalResult}`;
            
            // 📍 구글 시트 및 히스토리용으로는 압축된 로그 반환
            return cmd === 'iperf3' ? compressIperfLog(finalResult) : finalResult; 
        } catch (e) { return "Error: " + e.message; }
    }
    return "App Only";
}

async function measureLatencyAndJitter() {
    const pingTimes = []; let firstTTFB = 0;
    for (let i = 0; i < 5; i++) {
        try {
            const start = Date.now();
            await fetch(SERVER_URL + '/ping.txt?r=' + Math.random(), { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(3000) });
            const time = Date.now() - start;
            pingTimes.push(time); if (i === 0) firstTTFB = time;
            await new Promise(r => setTimeout(r, 200));
        } catch (e) { return { avg: 'N/A', jitter: 'N/A', ttfb: 'N/A' }; }
    }
    const valid = pingTimes.slice(1);
    const avg = Math.round(valid.reduce((a,b)=>a+b,0)/valid.length);
    const jit = Math.round(valid.reduce((a,b)=>a+Math.abs(b-avg),0)/valid.length);
    pingResult.innerHTML = `서버Ping:<span class="highlight-ms">${avg} ms</span>`;
    jitterResult.innerHTML = `Jitter:<span class="highlight-ms">${jit} ms</span>`;
    ttfbResult.innerHTML = `TTFB:<span class="highlight-ms">${firstTTFB} ms</span>`;
    return { avg, jitter: jit, ttfb: firstTTFB };
}

async function measureServiceLatency(url, element, name) {
    const times = [];
    for (let i = 0; i < 3; i++) {
        try {
            const start = Date.now();
            await fetch(`${url}?r=${Math.random()}`, { mode: 'no-cors', cache: 'no-store', signal: AbortSignal.timeout(3000) });
            times.push(Date.now() - start); await new Promise(r => setTimeout(r, 400));
        } catch (e) { element.innerHTML = `${name}:<span class="highlight-ms" style="color:red;">Fail</span>`; return 'Failed'; }
    }
    const avg = Math.round(times.slice(1).reduce((a,b)=>a+b,0)/2);
    element.innerHTML = `${name}:<span class="highlight-ms">${avg} ms</span>`;
    return avg;
}

function createOrUpdateProgressBar(el, prg, spd) {
    if (!el.querySelector('.progress-container')) el.innerHTML = '<div class="progress-container" style="margin-top:5px; background:rgba(150,150,150,0.3); border-radius:4px; overflow:hidden;"><div class="progress-bar" style="height:8px; background:#2196F3; width:0%; transition: width 0.2s;"></div></div><div class="progress-text" style="font-size:0.85em; margin-top:3px; color:#888;"></div>';
    el.querySelector('.progress-bar').style.width = `${prg * 100}%`; 
    el.querySelector('.progress-text').textContent = `${(prg * 100).toFixed(0)}% @ ${spd} Mbps`;
}

async function measureSpeedWithWorker(type) {
    const el = (type === 'download') ? downloadResult : uploadResult;
    const baseText = el.dataset.baseText;
    const colorClass = type === 'download' ? '' : 'speed-large-value-up';
    el.innerHTML = `<span style="font-size:1em; font-weight:bold;">${baseText}</span>`;
    createOrUpdateProgressBar(el, 0, '0.00');
    return new Promise((resolve) => {
        const fbTimer = setTimeout(() => { el.innerHTML = `⚠️ ${baseText}: Timeout`; speedtestWorker.terminate(); resolve('Timeout'); }, 25000);
        const handler = (event) => {
            if (isTestCancelled) { clearTimeout(fbTimer); speedtestWorker.removeEventListener('message', handler); resolve('Cancelled'); return; }
            const { type: mType, progress, speed, finalSpeed } = event.data;
            if (mType === 'progress') createOrUpdateProgressBar(el, progress, speed);
            if (mType === 'complete') { clearTimeout(fbTimer); el.innerHTML = `<span style="font-size:1em; font-weight:bold;">${baseText}</span> <span class="speed-large-value ${colorClass}">${finalSpeed} Mbps</span>`; speedtestWorker.removeEventListener('message', handler); resolve(finalSpeed); }
            if (mType === 'error') { clearTimeout(fbTimer); el.innerHTML = `❌ ${baseText}: Failed`; speedtestWorker.removeEventListener('message', handler); resolve('Failed'); }
        };
        speedtestWorker.addEventListener('message', handler);
        speedtestWorker.postMessage({ type: (type === 'download' ? 'start-download' : 'start-upload'), url: (type === 'download' ? SERVER_URL + '/download.php' : SERVER_URL + '/upload.php'), size: 10 * 1024 * 1024 });
    });
}

async function logResultToServer(data) { try { await fetch("https://script.google.com/macros/s/AKfycby7PrdmKFxAIuYRgw3mzQQpZIEy6zqU7YVLkVB3Hu1wDw07KVqZArZOti1M7a3g6_X2/exec", { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) }); } catch (e) { } }
function loadMnoDatabase() { fetch('./mno.json?v=' + Date.now()).then(res => res.json()).then(data => { fullMnoDatabase = data; isDbLoadedFromWeb = true; updateCountryList(); }).catch(() => { fullMnoDatabase = Object.fromEntries(Object.entries(fallbackMnoDatabase).map(([c, d]) => [c, d.mnos.map(b => ({ brand: b, country: d.name }))])); updateCountryList(); }); }
function updateCountryList() { const list = Object.keys(fullMnoDatabase).map(c => ({ code: c, name: fallbackMnoDatabase[c]?.name || c.toUpperCase() })).sort((a,b) => a.name.localeCompare(b.name)); countrySelector.innerHTML = '<option value="">국가 선택</option>'; list.forEach(c => countrySelector.appendChild(new Option(`${c.name} (${c.code.toUpperCase()})`, c.code))); countrySelector.disabled = false; checkSelections(); }
function onCountryChange() { const code = countrySelector.value; mnoSelector.innerHTML = '<option value="">통신사 선택</option>'; if (code && fullMnoDatabase[code]) { let brands = [...new Set(fullMnoDatabase[code].map(i => i.brand))]; brands.sort().forEach(b => mnoSelector.appendChild(new Option(b, b))); mnoSelector.disabled = false; } checkSelections(); }
function checkSelections() { startButton.disabled = !(countrySelector.value && mnoSelector.value && ratSelector.value && testIdSelector.value); if (!startButton.disabled) startButton.textContent = 'Start Test'; }

async function getLocation() {
    try {
        const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000 }));
        currentGpsCoords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=en`);
        const data = await res.json();
        if (data.address) {
            currentAddress = `${data.address.country || ''}, ${data.address.city || data.address.town || ''}`;
            const detectedCode = data.address.country_code?.toLowerCase();
            if (detectedCode && countrySelector.querySelector(`option[value="${detectedCode}"]`)) { countrySelector.value = detectedCode; countrySelector.classList.add('auto-filled'); onCountryChange(); }
        }
        locationText.innerHTML = `📍 GPS: ${currentGpsCoords}<br>🏠 Address: ${currentAddress}`;
    } catch (e) {}
}

async function getDeviceInfo() {
    try {
        if (navigator.userAgentData?.getHighEntropyValues) {
            const data = await navigator.userAgentData.getHighEntropyValues(['model']);
            currentDeviceInfo = `${navigator.userAgentData.platform} ${data.model || ''}`.trim();
        } else { const m = navigator.userAgent.match(/Android\s([0-9.]+)/); currentDeviceInfo = m ? `Android ${m[1]}` : 'Android'; }
    } catch(e) {}
    deviceInfo.innerHTML = `📱 Device: ${currentDeviceInfo}`;
}

function saveHistory(res) { let h = JSON.parse(localStorage.getItem('speedtestHistory')) || []; h.unshift(res); localStorage.setItem('speedtestHistory', JSON.stringify(h)); }
function loadHistory() {
    const h = JSON.parse(localStorage.getItem('speedtestHistory')) || []; historyTableBody.innerHTML = h.length ? '' : '<tr><td colspan="22">No History</td></tr>';
    h.forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${r.time}</td><td>${r.testId}</td><td>${r.country}</td><td>${r.mno}</td><td>${r.rat}</td><td>${r.testMode}</td><td>${r.ping_avg}</td><td>${r.download}</td><td>${r.upload}</td><td>${r.packetLoss}</td><td>${r.youtube}</td><td>${r.instagram}</td><td>${r.kakao}</td><td>${r.naver}</td><td>${r.whatsapp}</td><td>${r.device}</td><td>${r.location}</td><td>${r.gps}</td><td>${r.manualLocation}</td><td><b>${r.protocol}</b></td><td>${r.iperf3_log ? "✅" : "❌"}</td><td>${r.traceroute_log ? "✅" : "❌"}</td>`;
        historyTableBody.appendChild(row);
    });
}

async function fetchNetworkInfoWithRetry(retryCount = 0) {
    if (retryCount > 10 || !window.Capacitor?.Plugins?.NetworkInfo) return; 
    try {
        const info = await window.Capacitor.Plugins.NetworkInfo.getDetail();
        if (info.hplmnName) { testIdSelector.value = info.hplmnName; testIdSelector.classList.add('auto-filled'); }
        if (info.rat) { ratSelector.value = info.rat; ratSelector.classList.add('auto-filled'); }
        if (info.operatorName) mnoSource.innerText = ` (현재: ${info.operatorName})`;
        checkSelections();
    } catch (e) { setTimeout(() => fetchNetworkInfoWithRetry(retryCount + 1), 1000); }
}
window.addEventListener('load', fetchNetworkInfoWithRetry);