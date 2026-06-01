    /* ============ START CONFIG ============ */
    const GAS_KEY = 'AKfycbwAfDMv8iRWo4gD2mC9whGmVggSUzzjgyEMubXOIiN7zi-OIiC5djCyQE38soL7tSCMyg';
    
    let schoolname = ''; 
    let department = '';
    let academicYear = '';
    let semester = 0;
    let CONFIG = {};

    window.onload = async () => {
      const url = getGasUrl();
      const res = await fetch(
        `${url}?action=config`
      );

      CONFIG = await res.json();
      initApp();

    };

    function initApp(){
      schoolname = CONFIG.schoolName;
      department = CONFIG.department;
      academicYear = CONFIG.academicYear;
      semester = (new Date().getMonth() >= 4 && new Date().getMonth() <= 9)
        ? 1
        : 2; // กำหนดเทอมตามเดือน (พ.ค.-ต.ค = เทอม 1, พ.ย.-มี.ค. = เทอม 2)

      getDefault()
      
    }
    
    /* ============= END CONFIG ============ */

    
    /* ============= Load default values ======== */
    let curPage = 0, memberCount = 0;
    
    // เมื่อโหลดหน้าเว็บเสร็จ ให้เรียกฟังก์ชัน loadRecords() เพื่อโหลดรายการที่มีอยู่แล้ว และ updateMemberCount() เพื่ออัปเดตจำนวนแถวของสมาชิกในฟอร์มตามค่าเริ่มต้น
    window.addEventListener('DOMContentLoaded', () => {
      loadRecords();
      updateMemberCount();
    });
    
    // ฟังก์ชันนี้ใช้สำหรับการรับ URL ของ Google Apps Script ที่จะใช้ในการส่งข้อมูลจากฟอร์มไปยังสเปรดชีต โดยจะใช้ค่าจากตัวแปร GAS_KEY ที่กำหนดไว้ใน CONFIG เพื่อสร้าง URL ที่ถูกต้องสำหรับการเชื่อมต่อกับ GAS
    function getGasUrl() { return `https://script.google.com/macros/s/${GAS_KEY}/exec` }
    
    // ฟังก์ชันนี้ใช้สำหรับการตั้งค่าค่าเริ่มต้นของฟอร์ม โดยจะนำค่าจากตัวแปรที่กำหนดไว้ใน CONFIG มาใส่ในช่อง input ของฟอร์ม
    function getDefault() {
      document.getElementById('f_school').value = schoolname;
      document.getElementById('f_department').value = department;
      document.getElementById('f_academicYear').value = academicYear;
      document.getElementById('f_semester').value = semester;
    }

    /* ===== NAV ===== */
    // ฟังก์ชันนี้ใช้สำหรับการแสดงหน้าต่างๆ ของฟอร์ม โดยรับพารามิเตอร์เป็นหมายเลขหน้า (n) และองค์ประกอบที่ถูกคลิก (el) เพื่อเพิ่มคลาส active ให้กับแท็บเมนูที่ตรงกัน
    function showPage(n, el) {
      document.querySelectorAll('.fp').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.pt').forEach(t => t.classList.remove('active'));
      document.getElementById('page-' + n).classList.add('active');
      if (el) el.classList.add('active');
      else document.querySelectorAll('.pt')[n].classList.add('active');
      curPage = n;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (String(n) === '5') { initCanvas();}
      //if (String(n) === '0') { showPage(0, null);}
      
    }
    
    // เพื่อให้ปุ่ม "หน้าถัดไป" ในแต่ละหน้า สามารถใช้ได้ทั้งการคลิกที่ปุ่มเอง หรือการคลิกที่แท็บด้านบนที่มีหมายเลขหน้าเดียวกัน
    function nextPage() { if (curPage < 5) showPage(curPage + 1, null);}
    
    function prevPage() { if (curPage > 0) showPage(curPage - 1, null);}
    
    // ฟังก์ชันนี้ใช้สำหรับการคลิกที่แท็บเมนูด้านบน เพื่อแสดงหน้าที่ตรงกับเมนูนั้น และซ่อนหน้าที่เหลือ
    function showSection(n, el) {
      const p = el;
      console.log('Show section:', n, p);
      //if(p === "formSection"){clearForm();}
      if(String(n) === '1') { curPage = 0; showPage(curPage, null);}
      document.querySelectorAll('.nav-link-c')
        .forEach(item => item.classList.remove('active'));

      document.getElementById(`m-${n}`)?.classList.add('active');

      document.querySelectorAll('.sect')
        .forEach(item => item.classList.add('d-none'));

      document.getElementById(el)?.classList.remove('d-none');
    }

    // ==========UPDATE MEMBER COUNT=============================
    // ฟังก์ชันนี้ใช้สำหรับอัปเดตจำนวนแถวของสมาชิกในฟอร์ม โดยจะลบแถวเก่าออกทั้งหมดแล้วสร้างแถวใหม่ตามจำนวนที่ระบุในช่อง input
    function updateMemberCount() {

      const cnt =
        parseInt(
          document.getElementById(
            'f_memberCount'
          ).value
        ) || 1;

      const tb =
        document.getElementById(
          'f_memberRows'
        );

      // ============CLEAR OLD ROWS=========================

      tb.innerHTML = '';

      memberCount = 0;

      // ============CREATE ROWS=========================

      for(let i = 1; i <= cnt; i++) {

        addMemberRow();

      }
    }

    // ========ADD MEMBER ROW=======================
    
    // ฟังก์ชันนี้ใช้สำหรับการเพิ่มแถวของสมาชิกในฟอร์ม โดยจะสร้างแถวใหม่ที่มีช่อง input สำหรับกรอกข้อมูลของสมาชิก และเพิ่มเข้าไปในตารางของฟอร์ม
    function addMemberRow() {

      memberCount++;

      const tb =
        document.getElementById(
          'f_memberRows'
        );

      const tr =
        document.createElement('tr');

      const mid = 'm' + memberCount;

      tr.id = 'mrow_' + memberCount;

      tr.innerHTML = `

      <td class="text-center">
        ${memberCount}
      </td>

      <td>
        <input
          type="text"
          class="form-control"
          id="${mid}_name"
          placeholder="ชื่อ-นามสกุล">
      </td>

      <td>
        <select
          class="form-select"
          id="${mid}_rel"
          style="font-size:.74rem;padding:.28rem">

          <option>ตนเอง</option>
          <option>บิดา</option>
          <option>มารดา</option>
          <option>พี่/น้อง</option>
          <option>ปู่/ย่า/ตา/ยาย</option>
          <option>อื่น ๆ</option>

        </select>
      </td>

      <td>
        <input
          type="text"
          class="form-control"
          id="${mid}_idcard"
          placeholder="เลขบัตร">
      </td>

      <td>
        <select
          class="form-select"
          id="${mid}_edu"
          style="font-size:.74rem;padding:.28rem">

          <option>ป.1-ป.6</option>
          <option>ม.1-ม.3</option>
          <option>ม.4-ม.6/ปวช.</option>
          <option>ปวส.</option>
          <option>ปริญญาตรี+</option>
          <option>ไม่ได้เรียน</option>

        </select>
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_age"
          min="0"
          placeholder="อายุ">
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_inc1"
          placeholder="0"
          oninput="calcRow(${memberCount})">
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_inc2"
          placeholder="0"
          oninput="calcRow(${memberCount})">
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_inc3"
          placeholder="0"
          oninput="calcRow(${memberCount})">
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_incSum"
          placeholder="0"
          readonly
          style="background:var(--sur)">
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_welfare1"
          placeholder="0"
          oninput="calcRow(${memberCount})">
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_welfare2"
          placeholder="0"
          oninput="calcRow(${memberCount})">
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_other"
          placeholder="0"
          oninput="calcRow(${memberCount})">
      </td>

      <td>
        <input
          type="number"
          class="form-control"
          id="${mid}_total"
          placeholder="0"
          readonly
          style="background:var(--sur);font-weight:600">
      </td>

      `;

      tb.appendChild(tr);
      document.getElementById(
        'f_memberCount'
      ).value = memberCount;
    }

    // ฟังก์ชันนี้ใช้สำหรับการลบแถวของสมาชิกในฟอร์ม โดยจะลบแถวสุดท้ายออก
    function removeLastMemberRow() {

      // เหลือขั้นต่ำ 1 แถว
      if(memberCount <= 1) {

        toast(
          'ต้องมีสมาชิกอย่างน้อย 1 คน',
          'warning'
        );

        return;
      }

      const lastRow =
        document.getElementById(
          'mrow_' + memberCount
        );

      if(lastRow) {
        lastRow.remove();
      }

      memberCount--;

      document.getElementById(
        'f_memberCount'
      ).value = memberCount;
    }

    // ฟังก์ชันนี้ใช้สำหรับการคำนวณรายได้รวมของแต่ละแถวสมาชิก และอัปเดตผลรวมในช่อง total ของแถวนั้น รวมถึงคำนวณรายได้รวมทั้งหมดและค่าเฉลี่ยของสมาชิกทุกคน
    function calcRow(n) {
      const v = id => parseFloat(document.getElementById('m' + n + '_' + id)?.value) || 0;
      const s = v('inc1') + v('inc2') + v('inc3');
      const tot = s + v('welfare1') + v('welfare2') + v('other');
      document.getElementById('m' + n + '_incSum').value = s || '';
      document.getElementById('m' + n + '_total').value = tot || '';
      calcTotals();
    }
    
    // ฟังก์ชันนี้ใช้สำหรับการคำนวณรายได้รวมทั้งหมดและค่าเฉลี่ยของสมาชิกทุกคน โดยจะวนลูปผ่านแถวสมาชิกทั้งหมดเพื่อรวมค่ารายได้รวม และคำนวณค่าเฉลี่ยโดยหารด้วยจำนวนสมาชิก
    function calcTotals() {
      let sum = 0;
      for (let i = 1; i <= memberCount; i++) {
        sum += parseFloat(document.getElementById('m' + i + '_total')?.value) || 0;
      }
      const cnt = parseInt(document.getElementById('f_memberCount').value) || 1;
      document.getElementById('f_totalIncome').value = sum ? sum.toLocaleString() : '';
      document.getElementById('f_avgIncome').value = sum ? (sum / cnt).toFixed(0) : '';
    }

    
    /* 
    ============= PHOTO PREVIEW ============= 
    */
    // ฟังก์ชันนี้ใช้สำหรับการแสดงตัวอย่างภาพที่ผู้ใช้เลือกในช่อง input type="file" โดยจะอ่านไฟล์ภาพและแสดงผลลัพธ์ในองค์ประกอบที่ระบุด้วย boxId หรือ wrapId
    function previewPhoto(inp, boxId) {
      if (!inp.files[0]) return;
      const r = new FileReader();
      r.onload = e => {
        const b = document.getElementById(boxId);
        b.innerHTML = `<img src="${e.target.result}" alt="preview">`;
      };
      r.readAsDataURL(inp.files[0]);
    }
    
    function previewUpload(inp, wrapId) {
      if (!inp.files[0]) return;
      const r = new FileReader();
      r.onload = e => {
        const w = document.getElementById(wrapId);
        w.innerHTML = `<img src="${e.target.result}" style="max-height:180px;border-radius:8px;object-fit:contain" alt="preview"><div style="font-size:.78rem;color:var(--txt-m);margin-top:.4rem">${inp.files[0].name}</div>`;
      };
      r.readAsDataURL(inp.files[0]);
    }

    /* 
    =====  COLLECT FORM DATA ===== 
    */
    function getRadio(name) { const r = document.querySelector(`input[name="${name}"]:checked`); return r ? r.value : ''; }
    function getCheckboxes(ids) { return ids.filter(id => document.getElementById(id)?.checked).map(id => document.getElementById(id).nextElementSibling.textContent.trim()).join(', '); }

    function collectData() {
      const members = [];
      for (let i = 1; i <= memberCount; i++) {
        const g = k => document.getElementById('m' + i + '_' + k)?.value || '';
        members.push({ name: g('name'), rel: g('rel'), idcard: g('idcard'), edu: g('edu'), age: g('age'), inc1: g('inc1'), inc2: g('inc2'), inc3: g('inc3'), welfare1: g('welfare1'), welfare2: g('welfare2'), other: g('other'), total: g('total') });
      }
      const fd = id => document.getElementById(id)?.value || '';
      const fc = id => document.getElementById(id)?.checked || false;
      return {
        rowId: fd('f_rowIndex').startsWith('0') ? "'" + fd('f_rowIndex') : fd('f_rowIndex'),
        semester: fd('f_semester'), academicYear: fd('f_academicYear'),
        school: fd('f_school'), department: fd('f_department'),
        prefix: fd('f_prefix'), studentFirstName: fd('f_studentFirstName'),
        studentLastName: fd('f_studentLastName'), grade: fd('f_grade'),
        studentId: "'"+fd('f_studentId'), birthDate: fd('f_birthDate'),
        familyStatus: getRadio('family_status'), liveWith: getRadio('live_with'),
        guardianName: fd('f_guardianName'), guardianRelation: fd('f_guardianRelation'),
        guardianEducation: fd('f_guardianEducation'), guardianOccupation: fd('f_guardianOccupation'),
        guardianPhone: fd('f_guardianPhone').startsWith('0') ? "'" + fd('f_guardianPhone') : fd('f_guardianPhone'), 
        guardianId: fd('f_guardianId').startsWith('0') ? "'" + fd('f_guardianId') : fd('f_guardianId'),
        noId: fc('f_noId'), welfare: fc('f_welfare'),
        memberCount: fd('f_memberCount'), totalIncome: fd('f_totalIncome'), avgIncome: fd('f_avgIncome'),
        members: JSON.stringify(members),
        burden: getRadio('f_burden'),
        burden_detail: getCheckboxes(['f_bd1', 'f_bd2', 'f_bd3', 'f_bd4', 'f_bd5']),
        housing: getRadio('f_housing'), rentAmount: fd('f_rentAmount'),
        floor: getCheckboxes(['f_fl1', 'f_fl2', 'f_fl3', 'f_fl4', 'f_fl5', 'f_fl6']),
        wall: getCheckboxes(['f_wa1', 'f_wa2', 'f_wa3', 'f_wa4', 'f_wa5', 'f_wa6']),
        roof: getCheckboxes(['f_ro1', 'f_ro2', 'f_ro3', 'f_ro4', 'f_ro5']),
        toilet: getRadio('f_toilet'), agri: getRadio('f_agri'),
        water: getCheckboxes(['f_water1', 'f_water2', 'f_water3', 'f_water4']),
        elec: getRadio('f_elec'),
        vehicle: getCheckboxes(['f_veh1', 'f_veh2', 'f_veh3', 'f_veh4', 'f_veh5', 'f_veh6']),
        goods: getCheckboxes(['f_goods1', 'f_goods2', 'f_goods3', 'f_goods4', 'f_goods5']),
        travel: getRadio('f_travel'), travelDistance: fd('f_travelDistance'),
        travelTime: fd('f_travelTime'), travelCost: fd('f_travelCost'), dailyMoney: fd('f_dailyMoney'),
        houseNo: fd('f_houseNo'), moo: fd('f_moo'), soi: fd('f_soi'), road: fd('f_road'),
        subdistrict: fd('f_subdistrict'), district: fd('f_district'),
        province: fd('f_province'), postalCode: fd('f_postalCode'),
        photoSource: getRadio('f_photoSource'), photoType: getRadio('f_photoType'),
        cert1: fc('f_cert1'), pdpa: fc('f_pdpa'),
        studentSignName: fd('f_studentSignName'), guardianSignName: fd('f_guardianSignName'),
        officerName: fd('f_officerName'), officerId: fd('f_officerId'),
        officerPosition: fd('f_officerPosition'), officialCert: getRadio('f_officialCert'),
        nonCertReason: fd('f_nonCertReason'), officerSignName: fd('f_officerSignName'),
        principalName: fd('f_principalName'), teacherName: fd('f_teacherName'),
        teacherPosition: fd('f_teacherPosition'),
        
        // ไฟล์ที่อัปโหลดจะส่งเป็น base64 แยกต่างหาก ไม่ต้องส่ง URL เดิมไปด้วย เพราะอาจจะไม่มีแล้ว
        photoUrl: fd('f_url1'),
        housePhoto2Url: fd('f_url2wrap'), housePhoto1Url: fd('f_url1wrap'),
        
        // ลายเซ็นต์จะส่งเป็น base64 แยกต่างหาก ไม่ต้องส่ง URL เดิมไปด้วย เพราะอาจจะไม่มีแล้ว
        studentUrl: fd('studentUrl'), guardianUrl: fd('guardianUrl'),
        officerUrl: fd('officerUrl'), principalUrl: fd('principalUrl'),
        teacherUrl: fd('teacherUrl'),
        
        // ข้อมูลเพิ่มเติม ข้อ4 ที่เพิ่มมาในฟอร์มใหม่
        institutionType: document.getElementById('institutionType').value,
        institutionRegistered: document.getElementById('institutionRegistered').value,
        institutionName: document.getElementById('institutionName').value,
        institutionProvince: document.getElementById('institutionProvince').value,
        institutionManager: document.getElementById('institutionManager').value,
        institutionPhone: document.getElementById('institutionPhone').value,
        stayMonth: document.getElementById('stayMonth').value,
        stayYear: document.getElementById('stayYear').value,
        stayType: document.querySelector('input[name="stayType"]:checked')?.value || '',

        supportCash: document.getElementById('supportCash').checked ? "1" : "0",
        supportItems: document.getElementById('supportItems').checked ? "1" : "0",
        supportHousing: document.getElementById('supportHousing').checked ? "1" : "0",
        supportFood: document.getElementById('supportFood').checked ? "1" : "0",
        supportTransport: document.getElementById('supportTransport').checked ? "1" : "0",
        supportEducation: document.getElementById('supportEducation').checked ? "1" : "0",
        supportHealth: document.getElementById('supportHealth').checked ? "1" : "0",

        expensePerStudent: document.getElementById('expensePerStudent').value,
        studentCount: document.getElementById('studentCount').value,
        donationValue: document.getElementById('donationValue').value,

        landRai: document.getElementById('landRai').value,
        landNgan: document.getElementById('landNgan').value,
        buildingCount: document.getElementById('buildingCount').value,
        vehicleCount: document.getElementById('vehicleCount').value,

        needScholarship:
          document.querySelector('input[name="needScholarship"]:checked')?.value || '',

        canFollowConditions:
          document.querySelector('input[name="canFollowConditions"]:checked')?.value || ''
      };
    }

    /* ===== FILE TO BASE64 ===== */
    function fileToBase64(file) {
      return new Promise((res, rej) => {
        if (!file) { res(null); return; }
        const r = new FileReader();
        r.onload = e => res(e.target.result.split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
    }


    /* 
    ========================= 
    SAVE (CREATE / UPDATE) 
    ========================= 
    */
    async function saveRecord() {

      const url = getGasUrl();
      const id = document.getElementById('f_studentId').value;
      const cert = document.getElementById('f_cert1').checked;
      const pdpa = document.getElementById('f_pdpa').checked;

      if (!url) {
        toast('กรุณาใส่ GAS URL ก่อน', 'danger');
        return;
      }

      const data = collectData();

      if (!id) {
        toast('กรุณากรอกเลขประจำตัวนักเรียน', 'warning');
        return;
      }
      if (!cert) {
        toast('กรุณายืนยันการรับรองข้อมูล', 'warning');
        return;
      }
      if (!pdpa) {
        toast('กรุณายืนยันการให้ความยินยอมในการจัดการข้อมูลส่วนบุคคล', 'warning');
        return;
      }

      showLoading('กำลังอัปโหลดไฟล์และบันทึกข้อมูล...');

      try {

        const [p64, h1b64, h2b64] = await Promise.all([

          fileToBase64(
            document.getElementById('f_photo').files[0]
          ),

          fileToBase64(
            document.getElementById('f_housePhoto1').files[0]
          ),

          fileToBase64(
            document.getElementById('f_housePhoto2').files[0]
          )

        ]);

        const studentSign =
          isCanvasBlank('studentCanvas')
            ? ''
            : cropSignature('studentCanvas') //getSignature('studentCanvas');

        const guardianSign =
          isCanvasBlank('guardianCanvas')
            ? ''
            : cropSignature('guardianCanvas'); //getSignature('guardianCanvas');

        const officerSign =
          isCanvasBlank('officerCanvas')
            ? ''
            : cropSignature('officerCanvas'); //getSignature('officerCanvas');

        const principalSign =
          isCanvasBlank('principalCanvas')
            ? ''
            : cropSignature('principalCanvas'); //getSignature('principalCanvas');

        const teacherSign =
          isCanvasBlank('teacherCanvas')
            ? ''
            : cropSignature('teacherCanvas'); // getSignature('teacherCanvas');

        // =========================
        // DEBUG: ดูข้อมูลที่จะส่งไปยัง GAS ในคอนโซลก่อนส่งจริง เพื่อให้แน่ใจว่าข้อมูลถูกต้องและครบถ้วน รวมถึงไฟล์ที่ถูกแปลงเป็น base64 และลายเซ็นต์ที่ถูกตัดขอบแล้ว
        const ids = String(data.rowId).replace(/^'/, '')
        const isUpdate = !!(Number(ids));
        console.log('Payload:', {
          action: isUpdate ? 'update' : 'create',
          ...data,
          photo_b64: p64,
          housePhoto1_b64: h1b64,
          housePhoto2_b64: h2b64,
          studentSign_b64: studentSign,
          guardianSign_b64: guardianSign,
          officerSign_b64: officerSign,
          principalSign_b64: principalSign,
          teacherSign_b64: teacherSign
        });

        // สร้าง payload สำหรับส่งไปยัง GAS โดยรวมข้อมูลจากฟอร์มและไฟล์ที่อัปโหลดในรูปแบบ base64 ไว้ในอ็อบเจ็กต์เดียวกัน เพื่อให้ GAS สามารถรับข้อมูลทั้งหมดได้ในคำขอเดียว
        const payload = {

          action: isUpdate ? 'update' : 'create',

          ...data,

        // ========= IMAGES ======================
          photo_b64: p64,
          photo_name:
            document.getElementById('f_photo')
              .files[0]?.name || '',

          housePhoto1_b64: h1b64,
          housePhoto1_name:
            document.getElementById('f_housePhoto1')
              .files[0]?.name || '',

          housePhoto2_b64: h2b64,
          housePhoto2_name:
            document.getElementById('f_housePhoto2')
              .files[0]?.name || '',

        // ============SIGNATURES======================
          studentSign_b64: studentSign,
          guardianSign_b64: guardianSign,
          officerSign_b64: officerSign,
          principalSign_b64: principalSign,
          teacherSign_b64: teacherSign

        };

        const formData = new FormData();

        formData.append(
          'data',
          JSON.stringify(payload)
        );

        // ส่งข้อมูลไปยัง GAS โดยใช้ fetch API ในรูปแบบ POST และส่งข้อมูลในรูปแบบ FormData ซึ่งสามารถรวมไฟล์และข้อมูลอื่นๆ ได้ในคำขอเดียว
        const res = await fetch(url, {
          method: 'POST',
          body: formData
        });

        const json = await res.json();

        if (json.status) {
          hideLoading();
          toast(
            (isUpdate ? 'อัปเดต' : 'บันทึก')
            + 'ข้อมูลสำเร็จ ✓',
            'success'
          );

          document.getElementById('f_rowIndex').value = '';
          clearForm();
          loadRecords();

        } else {
          hideLoading();
          toast(
            'เกิดข้อผิดพลาด: '
            + json.message,
            'danger'
          );
        }

      } catch (e) {

        hideLoading();

        toast(
          'เชื่อมต่อ GAS ไม่ได้: '
          + e.message,
          'danger'
        );
      }
      
      // ฟังก์ชันนี้ใช้สำหรับการตรวจสอบว่าแคนวาสที่ใช้สำหรับลายเซ็นต์ว่างหรือไม่ โดยจะเปรียบเทียบข้อมูลของแคนวาสกับแคนวาสเปล่าที่สร้างขึ้นใหม่ หากข้อมูลตรงกันแสดงว่าแคนวาสนั้นว่างและยังไม่มีการวาดลายเซ็นต์ใดๆ
      function isCanvasBlank(canvasId) {

        const canvas = document.getElementById(canvasId);

        if (!canvas) return true;

        // canvas เปล่าสำหรับเปรียบเทียบ
        const blank = document.createElement('canvas');

        blank.width = canvas.width;
        blank.height = canvas.height;

        return canvas.toDataURL() === blank.toDataURL();
      }
      
      // ฟังก์ชันนี้ใช้สำหรับการตรวจสอบว่าไฟล์ที่ผู้ใช้เลือกในช่อง input type="file" เป็นไฟล์ภาพหรือไม่ โดยจะตรวจสอบประเภทของไฟล์จากคุณสมบัติ type ของไฟล์ และตรวจสอบว่ามีไฟล์ที่ถูกเลือกหรือไม่
      function isImgFile(fileId) {
        const input = document.getElementById(fileId);

        // ไม่มี input
        if (!input) return false;

        // ไม่มีไฟล์
        if (!input.files || !input.files.length) {
          return false;
        }

        const file = input.files[0];

        return file.type.startsWith('image/');
      }
    }


    /* 
    ===================== 
    LOAD RECORDS 
    ===================== 
    */
   // โหลดทั้งหมดทุกรายการ 
    async function loadRecords() {

      const url = getGasUrl();

      showLoading('กำลังโหลดรายการ...');

      try {

        const res = await fetch(url + '?action=read');
        const json = await res.json();

        hideLoading();

        if (json.status) {  
          document.getElementById('recBody').innerHTML = '';
          renderRecords(json.data);
          document.getElementById('recListWrap').style.display = 'block';
        } else {
          toast(json.message, 'danger');
        }
      } catch (err) {
        hideLoading();
        toast(err.message, 'danger');
      }
    }

    // โหลด 1 รายการตาม id ที่ส่งมา (ใช้สำหรับแก้ไขข้อมูล)
    async function loadRecord(id) {
      const url = getGasUrl();
      showLoading('กำลังโหลดข้อมูล...');
      try {
        const res = await fetch(
          `${url}?action=read&id=${id}`
        );

        const json = await res.json();
        hideLoading();

        if (json.status) {
          console.log('Record data:', json.data);
          
          fillForm(json.data);
          
          showSection('1','formSection');
          // โหลดสมาชิก
          const row = json.data;
          renderMembers(row.members);

        } else {
          toast(json.message, 'danger');
        }

      } catch (err) {

        hideLoading();

        toast(err.message, 'danger');

      }
    }


    // ======================================
    // RENDER MEMBERS
    // ======================================

    function renderMembers(members) {

      // แปลง JSON string -> Array
      if(typeof members === 'string') {
        try {
          members = JSON.parse(members);
        } catch(err) {
          console.error('members parse error', err);
          members = [];
        }
      }

      // กัน undefined
      if(!Array.isArray(members)) {
        members = [];
      }

      // tbody
      const tb =
        document.getElementById(
          'f_memberRows'
        );

      // clear
      tb.innerHTML = '';

      // reset
      memberCount = 0;

      // ไม่มีข้อมูล
      if(members.length === 0) {
        addMemberRow();
        return;
      }

      // CREATE ROWS

      members.forEach(m => {
        addMemberRow();
        const mid = 'm' + memberCount;

        // SET VALUES
        setValue(mid + '_name', m.name);
        setValue(mid + '_rel', m.rel);
        setValue(mid + '_idcard', m.idcard);
        setValue(mid + '_edu', m.edu);
        setValue(mid + '_age', m.age);
        setValue(mid + '_inc1', m.inc1);
        setValue(mid + '_inc2', m.inc2);
        setValue(mid + '_inc3', m.inc3);
        setValue(mid + '_incSum', m.incSum);
        setValue(mid + '_welfare1', m.welfare1);
        setValue(mid + '_welfare2', m.welfare2);
        setValue(mid + '_other', m.other);
        setValue(mid + '_total', m.total);
      });

      // update จำนวนสมาชิก
      document.getElementById(
        'f_memberCount'
      ).value = members.length;
    }

    // ---------SET VALUE SAFE-----------
    function setValue(id, value) {

      const el = document.getElementById(id);

      if(el) {
        el.value = value || '';
      }
    }


   /* ===== LOAD ONE RECORD ===== */
    function renderRecords(rows) {
      console.log('Rendering records:', rows);
      const tb = document.getElementById('recBody');
      tb.innerHTML = '';
      if (!rows || rows.length === 0) { tb.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">ยังไม่มีรายการ</td></tr>'; return; }
      rows.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i + 1}</td><td>${r.studentId || '-'}</td><td>${(r.prefix || '') + ' ' + (r.studentFirstName || '') + ' ' + (r.studentLastName || '')}</td><td>${r.school || '-'}</td><td>${r.semester || '-'}/${r.academicYear || '-'}</td><td style="font-size:.76rem">${formatThaiDate(r.timestamp) || '-'}</td>
    <td class="text-center d-flex gap-1 justify-content-center">
      <button class="btn-e" onclick="loadRecord(${r.studentId})"><i class="bi bi-pencil"></i></button>
      <button class="btn-d" onclick="deleteRecord(${r.studentId},'${r.studentFirstName} ${r.studentLastName}')"><i class="bi bi-trash"></i></button>
    </td>`;
        tb.appendChild(tr);
      });
    }


    /* 
    ================================== 
    DELETE
    ================================== 
    */
    async function deleteRecord(id,name) {

      if (!confirm(`ลบรายการ "${name}" จริงหรือ?`))
        return;

      showLoading('กำลังลบ...');

      try {

        const res = await fetch(getGasUrl(), {
          method: 'POST',
          body: new URLSearchParams({
            data: JSON.stringify({
              action: 'delete',
              id: id,
              name: name
            })
          })
        });

        const json = await res.json();

        hideLoading();

        if (json.status) {
          toast(`ลบรายการ ${name} สำเร็จ`, 'success');
          loadRecords();
        } else {
          toast(json.message, 'danger');
        }

      } catch (err) {
        hideLoading();
        toast(err.message, 'danger');
      }

    }

    /* 
    ================================== 
          FILL FORM Update
    ================================== 
    */
    function fillForm(d) {
      const sv = convertSV(); //(id,v)=>{ const el=document.getElementById(id); if(el) el.value=v||''; };
      const sc = (id, v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };
      sv('f_rowIndex', d.rowId);
      sv('f_semester', d.semester); sv('f_academicYear', d.academicYear);
      sv('f_school', d.school); sv('f_department', d.department);
      sv('f_prefix', d.prefix); sv('f_studentFirstName', d.studentFirstName);
      sv('f_studentLastName', d.studentLastName); sv('f_grade', d.grade);
      sv('f_studentId', d.studentId); sv('f_birthDate', d.birthDate);
      if (d.familyStatus) { const r = document.querySelector(`input[name="family_status"][value="${d.familyStatus}"]`); if (r) r.checked = true; }
      if (d.liveWith) { const r = document.querySelector(`input[name="live_with"][value="${d.liveWith}"]`); if (r) r.checked = true; }
      sv('f_guardianName', d.guardianName); sv('f_guardianRelation', d.guardianRelation);
      sv('f_guardianEducation', d.guardianEducation); sv('f_guardianOccupation', d.guardianOccupation);
      sv('f_guardianPhone', d.guardianPhone); sv('f_guardianId', d.guardianId);
      sc('f_noId', d.noId); sc('f_welfare', d.welfare);
      sv('f_memberCount', d.memberCount); sv('f_totalIncome', d.totalIncome); sv('f_avgIncome', d.avgIncome);
      sv('f_rentAmount', d.rentAmount);
      if (d.housing) { const r = document.querySelector(`input[name="f_housing"][value="${d.housing}"]`); if (r) r.checked = true; }
      if (d.burden) { const r = document.querySelector(`input[name="f_burden"][value="${d.burden}"]`); if (r) r.checked = true; }
      ['f_bd1', 'f_bd2', 'f_bd3', 'f_bd4', 'f_bd5'].forEach((id, i) => { const el = document.getElementById(id); if (el && d.burden_detail) el.checked = d.burden_detail.includes(el.nextElementSibling.textContent.trim()); });
      sv('f_travelDistance', d.travelDistance); sv('f_travelTime', d.travelTime);
      sv('f_travelCost', d.travelCost); sv('f_dailyMoney', d.dailyMoney);
      sv('f_houseNo', d.houseNo); sv('f_moo', d.moo); sv('f_soi', d.soi); sv('f_road', d.road);
      sv('f_subdistrict', d.subdistrict); sv('f_district', d.district);
      sv('f_province', d.province); sv('f_postalCode', d.postalCode);
      sc('f_cert1', d.cert1); sc('f_pdpa', d.pdpa);
      sv('f_studentSignName', d.studentSignName); sv('f_guardianSignName', d.guardianSignName);
      sv('f_officerName', d.officerName); sv('f_officerId', d.officerId);
      sv('f_officerPosition', d.officerPosition); sv('f_nonCertReason', d.nonCertReason);
      sv('f_officerSignName', d.officerSignName); sv('f_principalName', d.principalName);
      sv('f_teacherName', d.teacherName); sv('f_teacherPosition', d.teacherPosition);
      
      // ไฟล์รูปภาพ ถ้าเป็น URL เดิมจะไม่แสดงแล้ว เพราะอาจจะไม่มี แต่ถ้าเป็นการอัปเดต จะมี URL ใหม่ที่ส่งกลับมา ให้แสดงแทน
      sv(getDriveImg(d.photoUrl, 'photoPreview')); sv('f_url1', d.photoUrl);
      sv(getDriveImg(d.housePhoto1Url, 'prev1Wrap')); sv('f_url1wrap', d.housePhoto1Url);
      sv(getDriveImg(d.housePhoto2Url, 'prev2Wrap')); sv('f_url2wrap', d.housePhoto2Url);

      // ลายเซ็นต์ ถ้าเป็นการอัปเดต จะมี URL ใหม่ที่ส่งกลับมา ให้แสดงแทน แต่ถ้าเป็น URL เดิมจะไม่แสดงแล้ว เพราะอาจจะไม่มี
      sv(getDriveImg(d.studentSignUrl, 'studentPreview')); sv('studentUrl', d.studentSignUrl);
      sv(getDriveImg(d.guardianSignUrl, 'guardianPreview')); sv('guardianUrl', d.guardianSignUrl);
      sv(getDriveImg(d.officerSignUrl, 'officerPreview')); sv('officerUrl', d.officerSignUrl);
      sv(getDriveImg(d.principalSignUrl, 'principalPreview')); sv('principalUrl', d.principalSignUrl);
      sv(getDriveImg(d.teacherSignUrl, 'teacherPreview')); sv('teacherUrl', d.teacherSignUrl);

      // ข้อมูลเพิ่มเติม ข้อ4 ที่เพิ่มมาในฟอร์มใหม่
      sv("institutionType", d.institutionType); sv("institutionRegistered", d.institutionRegistered);
      sv("institutionName", d.institutionName); sv("institutionProvince", d.institutionProvince);
      sv("institutionManager", d.institutionManager); sv("institutionPhone", d.institutionPhone);
      sv("stayMonth", d.stayMonth ? d.stayMonth : ' '); sv("stayYear", d.stayYear);
      sv("stayType", d.stayType); sv("supportCash", d.supportCash);
      sv("supportItems", d.supportItems); sv("supportHousing", d.supportHousing);
      sv("supportFood", d.supportFood); sv("supportTransport", d.supportTransport);
      sv("supportEducation", d.supportEducation); sv("supportHealth", d.supportHealth);
      sv("expensePerStudent", d.expensePerStudent); sv("studentCount", d.studentCount);
      sv("donationValue", d.donationValue); sv("landRai", d.landRai);
      sv("landNgan", d.landNgan); sv("buildingCount", d.buildingCount);
      sv("vehicleCount", d.vehicleCount); sv("needScholarship", d.needScholarship);
      sv("canFollowConditions", d.canFollowConditions);

      if(d.housing === 'บ้านเช่า') {
        document.getElementById('subh2').style.display = 'block';
      }
      if(d.burden === 'มีภาระ') {
        document.getElementById('subDependency').style.display = 'block';
      }

    }

    // สำหรับกรณีที่ต้องการแปลงค่าวันที่ให้เหมาะกับ input[type=date]
    function convertSV() {
      const sv = (id, v) => {

        const el = document.getElementById(id);

        if (!el) return;

        // ===== date input =====
        if (el.type === 'date' && v) {

          try {

            const d = new Date(v);

            const yyyy = d.getFullYear();

            const mm = String(d.getMonth() + 1).padStart(2, '0');

            const dd = String(d.getDate()).padStart(2, '0');

            el.value = `${yyyy}-${mm}-${dd}`;

          } catch (err) {

            el.value = '';

          }

        } else {

          el.value = v || '';

        }
      }
      return sv;

    }

    // สำหรับแปลงวันที่ให้เป็นรูปแบบไทย
    function formatThaiDate(dateString) {

      if (!dateString) return '';

      const d = new Date(dateString);

      const months = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
        'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
        'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];

      const day = d.getDate();

      const month = months[d.getMonth()];

      const year = d.getFullYear() + 543;

      const hh = String(d.getHours()).padStart(2, '0');

      const mm = String(d.getMinutes()).padStart(2, '0');

      return `${day} ${month} ${year}, ${hh}:${mm}`;
    }

    /* 
    ============================ 
          CLEAR FORM 
    =========================== 
    */
    function clearForm() {
      document.querySelectorAll('.fb input[type=text],.fb input[type=number],.fb input[type=tel],.fb input[type=date],.fb textarea').forEach(el => el.value = '');
      document.querySelectorAll('.fb input[type=checkbox],.fb input[type=radio]').forEach(el => el.checked = false);
      document.querySelectorAll('.signImg').forEach(el => el.innerHTML = '');
      document.querySelectorAll('select').forEach(el => {
        if (el.id !== 'f_semester') {
          el.selectedIndex = 0;
        }
      });

      memberCount = 0;
      curPage = 0;

      showPage(curPage,null);
      updateMemberCount();
      toggleDependency(false);
      toggleHouse(false);
      getDefault();

      document.getElementById('photoPreview').innerHTML = '<i class="bi bi-camera"></i><span>คลิกอัปโหลด</span>';
      document.getElementById('prev1Wrap').innerHTML = '<i class="bi bi-camera-fill" style="font-size:2rem;color:var(--brd)"></i><div class="mt-2 text-muted" style="font-size:.82rem">คลิกเพื่ออัปโหลด</div>';
      document.getElementById('prev2Wrap').innerHTML = '<i class="bi bi-camera-fill" style="font-size:2rem;color:var(--brd)"></i><div class="mt-2 text-muted" style="font-size:.82rem">คลิกเพื่ออัปโหลด</div>';
        
    }


    

  /* ==================================================
  SIGNATURE PAD Smooth แบบ DocuSign / Adobe Sign
  =================================================== */
    class ProSignaturePad {

      constructor(canvasId) {

        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.points = [];
        this.isDrawing = false;

        this.lastVelocity = 0;
        this.lastWidth = 2.5;

        this.minWidth = 0.8;
        this.maxWidth = 4.2;

        this.init();
      }

      //---------INIT---------------
      init() {

        this.resizeCanvas();

        this.ctx.strokeStyle = '#000';
        this.ctx.fillStyle = '#000';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Mouse
        this.canvas.addEventListener('mousedown', this.startDraw.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        window.addEventListener('mouseup', this.endDraw.bind(this));

        // Touch
        this.canvas.addEventListener('touchstart', this.startDraw.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.draw.bind(this), { passive: false });
        window.addEventListener('touchend', this.endDraw.bind(this));

        // Resize
        window.addEventListener('resize', () => {
          const image = this.canvas.toDataURL();
          this.resizeCanvas();

          const img = new Image();
          img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
          };
          img.src = image;
        });

      }

      resizeCanvas() {

        const ratio = Math.max(window.devicePixelRatio || 1, 1);

        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;

        this.ctx.scale(ratio, ratio);
      }

      //------POSITION----------------------------
      getPoint(e) {

        const rect = this.canvas.getBoundingClientRect();

        if (e.touches && e.touches.length > 0) {

          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
            time: Date.now()
          };

        }

        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          time: Date.now()
        };
      }

      //-------START---------------------
      startDraw(e) {

        e.preventDefault();

        this.isDrawing = true;

        this.points = [];

        const point = this.getPoint(e);

        this.points.push(point);
      }

      //------DRAW-----------------
      draw(e) {

        if (!this.isDrawing) return;

        e.preventDefault();

        const point = this.getPoint(e);

        this.points.push(point);

        if (this.points.length < 3) return;

        // ใช้ 3 จุดสร้าง Bezier Curve
        const p0 = this.points[this.points.length - 3];
        const p1 = this.points[this.points.length - 2];
        const p2 = this.points[this.points.length - 1];

        // midpoint
        const mid1 = this.midPoint(p0, p1);
        const mid2 = this.midPoint(p1, p2);

        // velocity
        const velocity = this.calculateVelocity(p1, p2);

        // smooth velocity
        const smoothVelocity = 0.7 * velocity + 0.3 * this.lastVelocity;

        // width
        const newWidth = this.strokeWidth(smoothVelocity);

        // draw curve
        this.drawCurve(
          mid1,
          p1,
          mid2,
          this.lastWidth,
          newWidth
        );

        this.lastVelocity = smoothVelocity;
        this.lastWidth = newWidth;
      }

      // END DRAW
      endDraw() {

        if (!this.isDrawing) return;

        this.isDrawing = false;

        this.points = [];
      }


      // MIDPOINT
      midPoint(p1, p2) {

        return {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2
        };
      }

      // VELOCITY
      calculateVelocity(start, end) {

        const dx = end.x - start.x;
        const dy = end.y - start.y;

        const dt = end.time - start.time || 1;

        return Math.sqrt(dx * dx + dy * dy) / dt;
      }

      // WIDTH ตามความเร็ว
      strokeWidth(velocity) {

        return Math.max(
          this.maxWidth / (velocity + 1),
          this.minWidth
        );
      }

      // DRAW CURVE
      drawCurve(start, control, end, startWidth, endWidth) {

        const ctx = this.ctx;

        const steps = 30;

        for (let i = 0; i < steps; i++) {

          const t = i / steps;

          const x = this.bezier(t, start.x, control.x, end.x);
          const y = this.bezier(t, start.y, control.y, end.y);

          const width = startWidth + (endWidth - startWidth) * t;

          ctx.beginPath();

          ctx.arc(x, y, width / 2, 0, Math.PI * 2);

          ctx.fill();
        }
      }

      // BEZIER
      bezier(t, start, control, end) {

        return (
          (1 - t) * (1 - t) * start +
          2 * (1 - t) * t * control +
          t * t * end
        );
      }

      // CLEAR
      clear() {

        this.ctx.clearRect(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
      }

      // EXPORT
      toDataURL() {
        return this.canvas.toDataURL('image/png');
      }
    }


    // GLOBAL
    const signaturePads = {};

    //INIT CANVAS-----------------
    function initCanvas() {

      signaturePads.studentCanvas =
        new ProSignaturePad('studentCanvas');

      signaturePads.guardianCanvas =
        new ProSignaturePad('guardianCanvas');

      signaturePads.officerCanvas =
        new ProSignaturePad('officerCanvas');

      signaturePads.principalCanvas =
        new ProSignaturePad('principalCanvas');

      signaturePads.teacherCanvas =
        new ProSignaturePad('teacherCanvas');

    }

    // CLEAR-------------
    function clearSignature(canvasId) {

      signaturePads[canvasId].clear();
    }

    // EXPORT----------
    function getSignature(canvasId) {

      return signaturePads[canvasId].toDataURL();
    }

    /* ========================================
    AUTO CROP SIGNATURE
    ======================================== */

    function cropSignature(canvasId) {

      const canvas =
        document.getElementById(canvasId);

      const ctx =
        canvas.getContext('2d');

      const width = canvas.width;
      const height = canvas.height;

      // GET IMAGE DATA
      const imageData =
        ctx.getImageData(0, 0, width, height);

      const data = imageData.data;

      // FIND BOUNDS
      let top = null;
      let left = null;
      let right = null;
      let bottom = null;

      for(let y = 0; y < height; y++) {

        for(let x = 0; x < width; x++) {

          const index = (y * width + x) * 4;

          const alpha = data[index + 3];

          // มี pixel
          if(alpha > 0) {

            if(top === null) {
              top = y;
            }

            if(left === null || x < left) {
              left = x;
            }

            if(right === null || x > right) {
              right = x;
            }

            bottom = y;
          }
        }
      }

      // ไม่มีลายเซ็น
      if(top === null) {

        return '';
      }

      // PADDING
      const padding = 20;

      top = Math.max(top - padding, 0);

      left = Math.max(left - padding, 0);

      right = Math.min(
        right + padding,
        width
      );

      bottom = Math.min(
        bottom + padding,
        height
      );

      // CROP SIZE
      const cropWidth =
        right - left;

      const cropHeight =
        bottom - top;

      // CREATE TEMP CANVAS
      const tempCanvas =
        document.createElement('canvas');

      tempCanvas.width = cropWidth;
      tempCanvas.height = cropHeight;

      const tempCtx =
        tempCanvas.getContext('2d');

      // DRAW CROPPED IMAGE
      tempCtx.drawImage(

        canvas,

        left,
        top,
        cropWidth,
        cropHeight,

        0,
        0,
        cropWidth,
        cropHeight
      );

      // EXPORT PNG
      return tempCanvas.toDataURL(
        'image/png'
      );
    }
    
    /* 
    ============================ 
          UTIL 
    =========================== 
    */
    // ฟังก์ชันสำหรับแสดงและซ่อนข้อความโหลดและหน้าจอโหลดที่ครอบคลุมทั้งหน้า
    function showLoading(msg) { document.getElementById('loadMsg').textContent = msg || 'กำลังดำเนินการ...'; document.getElementById('loading').style.display = 'flex'; }
    function hideLoading() { document.getElementById('loading').style.display = 'none'; }
    
    //--------แจ้งเตือนแบบ Toast---------------
    function toast(msg, type = 'info') {
      const t = document.getElementById('toast');
      t.className = `alert alert-${type} shadow`;
      t.textContent = msg;
      t.style.display = 'block';
      setTimeout(() => t.style.display = 'none', 4000);
    }

    //-------สำหรับกรณีที่ต้องการใช้รูปจาก Google Drive---------
    function getDriveImg(url, boxId) {
      const size = boxId === 'photoPreview' ? "object-fit:contain"
        : (boxId === 'prev1Wrap' || boxId === 'prev2Wrap')
          ? "max-height:180px;border-radius:8px;object-fit:contain"
          : "max-height:48px;object-fit:contain";
      const id = (
        url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ||
        url.match(/id=([a-zA-Z0-9_-]+)/)?.[1] ||
        ''
      );
      const boximg = document.getElementById(boxId);
      if (!url) { return; }
      boximg.innerHTML = `<img class="img-center" src="https://lh3.googleusercontent.com/d/${id}" style="${size}" alt="preview">`;
    }

    //------ฟังก์ชันนี้ใช้สำหรับการสร้างตัวเลือกของเดือนในรูปแบบภาษาไทยในช่อง select ที่มี id เป็น "stayMonth"------
    // รายชื่อเดือนภาษาไทย
    const thaiMonths = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
        "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
        "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const monthSelect = document.getElementById("stayMonth");
    const f_month = monthSelect.value;
    
    // สร้าง option สำหรับแต่ละเดือน
    thaiMonths.forEach((month, index) => {
        const option = document.createElement("option");
        option.value = month; // เดือนเริ่มจาก มกราคม = 1 ถึง ธันวาคม = 12
        option.textContent = month;
        monthSelect.appendChild(option);
    });
   
    //-----SHOW / HIDE SECTION---------------
    function toggleDependency(show){
      const box = document.getElementById('subDependency')
      box.style.display = show ? 'block' : 'none';
    }

    function toggleHouse(show){
      const boxh = document.getElementById('subh2')
      boxh.style.display = show ? 'block' : 'none';
    }

